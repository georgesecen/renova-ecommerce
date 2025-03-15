const Order = require("../models/orderModel")
const OrderItem = require("../models/orderItemModel")
const ShippingAddress = require("../models/ShippingAddressModel")

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

// TODO: Create webhook which only listens to events we need as it is unnecessary to listen to
// every single event from Stripe

// TODO: For extra security verify that webhook events are only coming from Stripes trusted ip
// addresses https://docs.stripe.com/ips

// https://docs.stripe.com/webhooks

/**
 * Webhook which listens to Stripe events.
 * @param {object} request Express js request object.
 * @param {object} response Express js response object.
 * @returns {void}
 */
exports.webhook = async (request, response) => {
    
    let event = request.body
  
    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature'];

    // Verify
    try {
        event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        console.log(`⚠️  Webhook signature verification failed.`, error.message);
        return response.sendStatus(400);
    }

    // Go to https://docs.stripe.com/api/webhook_endpoints/create event parameters to view all possible events

    // TODO: Make changes to database on specific events
    // Handle events
    switch (event.type){

        // Occurs whenever a charge is successful
        case "charge.succeeded":
            console.log("Charge succeeded!")
            break
        
        // Occurs when a Checkout Session has been successfully completed
        case "checkout.session.completed":

            try {

                // Get all needed checkout session data
                const checkoutId = event.data.object["id"]
                const paymentStatus = event.data.object["payment_status"]
                const {email, phone: phoneNumber} = event.data.object["customer_details"]
                const name = event.data.object["shipping_details"]["name"]
                const {city, country, line1, line2, postal_code: postalCode, state} = event.data.object["shipping_details"]["address"]
                const amountTotal = event.data.object["amount_total"] / 100 // Convert from cents to dollars

                // Make sure we have not already processed event as it is 
                // possible we are sent duplicate events with the same event id
                // If we have already added order to the database
                const duplicate = await Order.findAll({
                    where: {
                        stripe_id: checkoutId
                    }
                })
                if (duplicate.length > 0){
                    break
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

                // Get checkout session line items (max limit is 100 items)
                const lineItems = await stripe.checkout.sessions.listLineItems(
                    checkoutId,
                    {
                        limit: 100
                    }
                )
                
                // Create order item for every item purchased at checkout
                // https://docs.stripe.com/api/checkout/sessions/line_items
                for (const lineItem of lineItems["data"]){
                    await OrderItem.create({
                        order_id: order.id,
                        product_variant_id: parseInt(lineItem["price"]["product"]),
                        quantity: lineItem["quantity"],
                        price_at_purchase: lineItem["price"]["unit_amount"] / 100 // Convert from cents to dollars
                    })
                }

                console.log("Checkout session successfully added to database.")
                
            } catch(error) {
                console.log(`Error in stripeWebhook.js function webhook: ${error.message}`)
            }
            break

        default:
            console.log(`Unhandled event: ${event.type}`)
            
    }
    
    // We must send response to acknowledge receipt of the event from Stripe
    response.json({received: true});
    
};


  