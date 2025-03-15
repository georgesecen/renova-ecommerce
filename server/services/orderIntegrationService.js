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
        const checkoutId = event.data.object["id"]
        const paymentStatus = event.data.object["payment_status"]
        const {email, phone: phoneNumber} = event.data.object["customer_details"]
        const name = event.data.object["shipping_details"]["name"]
        const {city, country, line1, line2, postal_code: postalCode, state} = event.data.object["shipping_details"]["address"]
        const amountTotal = event.data.object["amount_total"] / 100 // Convert from cents to dollars

        // Make sure we have not already processed event as it is 
        // possible we are sent duplicate events with the same event id
        const duplicates = await Order.findAll({
            where: {
                stripe_id: checkoutId
            }
        })

        // If we have already added order to the database
        if (duplicates.length > 0){
            return
        }   

        // Create order
        const order = await Order.create({
            total_price: amountTotal,
            status: paymentStatus == "paid" ? "completed" : "pending",
            stripe_id: checkoutId,

            // TODO: Remove foreign key constraints as you cannot track user from webhook (I think)
            user_id: 2
        })

        // Create shipping
        await ShippingAddress.create({
            order_id: order.id,
            recipient_name: name,

            // TODO: Allow phone numbers to be null as they are not required at checkout
            phone_number: "test",
            address_line1: line1,
            address_line2: line2,
            city: city,
            state: state,
            postal_code: postalCode,
            country: country,

            // TODO: Remove foreign key constraints as you cannot track user from webhook (I think)
            user_id: 2
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

            console.log(lineItem["quantity"])
            console.log(Number(lineItem["quantity"]))

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