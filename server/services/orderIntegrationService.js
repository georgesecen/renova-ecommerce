const Order = require("../models/orderModel")
const OrderItem = require("../models/orderItemModel")
const ShippingAddress = require("../models/ShippingAddressModel")
const ProductVariantModel = require("../models/productVariantModel")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

/**
 * Create an order based on the items purchased from a Stripe checkout session. Creates an order, shipping, 
 * order items, and updates product variant stock quantities in the database.
 * @param {object} event Stripe checkout.session.completed event object.
 * @returns {Promise<void>}
 */
exports.createOrder = async (event) => {
    try{

        // Get all needed checkout session data
        const {
            id: checkoutId,
            payment_status: paymentStatus,
            payment_intent: paymentIntent, // Payment intent needed to refund the order
            email,
            phone: phoneNumber,
            shipping_details: shippingDetails,
            metadata
        } = event.data.object

        // Metadata values are strings we need values them to be numbers to insert them as ID's into tables
        let {userId, guestUserId} = metadata
        userId = userId === undefined ? undefined : Number(userId)
        guestUserId = guestUserId === undefined ? undefined : Number(guestUserId)

        // Convert amount total from cents to dollars
        const amountTotal = event.data.object.amount_total / 100

        // Get all needed shipping data
        const name = shippingDetails.name
        const { postal_code: postalCode, city,  country, line1, line2, state } = shippingDetails.address

        // Make sure we have not already processed event as it is 
        // possible we are sent duplicate events with the same payment intent
        const duplicates = await Order.findAll({
            where: {
                stripe_id: paymentIntent
            }
        })

        // If we have already added order to the database
        if (duplicates.length > 0) return

        // Create order
        const order = await Order.create({
            total_price: amountTotal,
            status: paymentStatus == "paid" ? "completed" : "pending",
            stripe_id: paymentIntent,

            // For some reason neither values can be present. One of them must be undefined. Always prioritize
            // making the userId present if possible.
            user_id: userId,
            guest_user_id: userId === undefined ? guestUserId : undefined,
        })

        // Create shipping
        await ShippingAddress.create({
            order_id: order.id,
            recipient_name: name,
            phone_number: phoneNumber,
            address_line1: line1,
            address_line2: line2,
            city: city,
            state: state,
            postal_code: postalCode,
            country: country,

            // For some reason neither values can be present. One of them must be undefined. Always prioritize
            // making the userId present if possible.
            user_id: userId,
            guest_user_id: userId === undefined ? guestUserId : undefined,
        })

        // https://docs.stripe.com/api/checkout/sessions/line_items

        // Get checkout session line items (max limit is 100 items)
        const lineItems = await stripe.checkout.sessions.listLineItems(
            checkoutId,
            {
                limit: 100
            }
        )

        // For every item purchased at checkout update its stock quantity and create an order item for its order
        for (const lineItem of lineItems["data"]){

            await ProductVariantModel.decrement("stock_quantity", {
                by: lineItem["quantity"],
                where: {
                    id: parseInt(lineItem["price"]["product"])
                }
            })

            await OrderItem.create({
                order_id: order.id,
                product_variant_id: parseInt(lineItem["price"]["product"]),
                quantity: lineItem["quantity"],
                price_at_purchase: lineItem["price"]["unit_amount"] / 100 // Convert from cents to dollars
            })
        }
        
        console.log("Checkout session successfully added to database.")

    } catch(error){
        throw new Error(`Error in orderIntegrationService.js function createOrder: ${error}`)
    }
}

/**
 * Refunds an orders full amount on Stripe and updates the orders status to cancelled.
 * Funds will be refunded to the credit or debit card that was originally charged.
 * @param {number} orderId ID of order to be fully refunded.
 * @returns {Promise<void>}
 */
exports.refundOrder = async (orderId) => {
    try{

        // Get the Stripe payment intent associated with the order
        const order = await Order.findByPk(orderId)
        const paymentIntent = order.stripe_id
        
        // Refund the order (Refunds full order amount by default)
        const refund = await stripe.refunds.create({
            payment_intent: paymentIntent,
        });

        // Update order status
        order.status = "cancelled"
        await order.save()
        
        console.log("Order refunded successfully on Stripe.")

    } catch(error){
        throw new Error(`Error in orderIntegrationService.js function refundOrder: ${error}`)
    }
}