

/**
 * Middleware function will make sure that there is only ever one Stripe operation running at a time. 
 * This way there is no way to go past the Stripe rate limits (As we have added timeouts in the Stripe models).
 * Also, if certain admin operations run at the same time which interact with Stripe, there may be
 * data corruption. Stripe operations are any controller functions which at some point will interact with
 * the Stripe api.
 * @param {object} request Express js request object.
 * @param {object} response Express js response object.
 * @param {function} next The next middleware function in the chain.
 * @returns {Promise<void>}
 */
const limitStripe = async (request, response, next) => {

    try{

        // If there are currently no Stripe operations running
        if (global.stripeOperationInProgress == false){
            
            // There will now be a new Stripe operation in progress
            global.stripeOperationInProgress = true

            next()
        }

        // If there are Stripe operations running
        else{
            throw new Error("Processing in progress. Please try again shortly.")
        }

    } catch (error){
        console.log(`Error in stripeLimitMiddleware.js function limitStripe: ${error.message}`)
        response.status(500).json({error: error.message})
    }    
}

module.exports = limitStripe;