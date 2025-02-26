const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

class StripePrice{

    #id
    #unitAmount
    #productId
    #active

    /**
     * Represents a Stripe price on the Stripe server.
     * @param {string} id Id of price.
     * @param {number} unitAmount The price of the Stripe product which this price is associated with. (In dollars)
     * @param {string} productId Id of the Stripe product which this price is associated with.
     * @param {boolean} active Whether the price can be used for new purchases.
     */
    constructor(id, unitAmount, productId, active){
        this.#id = id
        this.#unitAmount = unitAmount
        this.#productId = productId
        this.#active = active
    }

    /**
     * Creates a price on the Stripe server which must be associated with a product on the Stripe server.
     * @param {number} unitAmount How much to charge in dollars for the product associated with this price.
     * @param {string} productId Id of the Stripe product which this price is associated with.
     * @returns {StripePrice}
     */
    static async create(unitAmount, productId){
        try{

            // Create Stripe price object
            const price = await stripe.prices.create({
                // TODO: Add support for multiple currencies 
                currency: "cad",
                unit_amount: unitAmount * 100, // Convert price from dollars to cents
                product: productId
            })

            return new StripePrice(price.id, unitAmount, productId, true)
        }
        catch (error){
            console.log(`Error in stripePriceModel.js function create: ${error.message}`)
            throw new Error(error.message)
        }
    }

    /**
     * Retrieves price from the Stripe server with specified id.
     * @param {string} id Id of price to retrieve.
     * @returns {StripePrice}
     */
    static async findById(id){
        try{

            // Get price object from Stripe
            const price = await stripe.prices.retrieve(id);
            return new StripePrice(
                id, 
                price.unit_amount / 100, // Convert price from cents to dollars
                price.id,
                price.active
            )
        }
        catch (error){
            console.log(`Error in stripePriceModel.js function findById: ${error.message}`)
            throw new Error(error.message)
        }
    }
    
    // TODO: Be able to update currencies 
    /**
     * Updates the price on the Stripe server to reflect the current properties of this instance.
     * @returns {void}
     */
    async update(){
        try{

            // The only property which the api allows for updating is weather the price is active or not
            // Update active property of price
            await stripe.prices.update(
                this.id,
                {
                  active: this.#active
                }
            )
        }
        catch (error){
            console.log(`Error in stripePriceModel.js function update: ${error.message}`)
            throw new Error(error.message)
        }
    }

    // Getters and setters
    get id(){
        return this.#id
    }
    set id(_){
        throw new Error("StripePrice id cannot be modified.")
    }

    get unitAmount(){
        return this.#unitAmount
    }
    set unitAmount(_){
        throw new Error("StripePrice unitAmount cannot be modified.")
    }

    get productId(){
        return this.#productId
    }
    set productId(_){
        throw new Error("StripePrice productId cannot be modified.")
    }

    get active(){
        return this.#active
    }
    set active(newActive){
        this.#active = newActive
    }
}

module.exports = StripePrice