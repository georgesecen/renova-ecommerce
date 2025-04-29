const { createOrder } = require("../services/orderIntegrationService")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-12-18.acacia",
})

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

                // Add checkout session details to database
                await createOrder(event)
                
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


  