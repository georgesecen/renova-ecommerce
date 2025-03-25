const { setTimeout }  = require("node:timers/promises")

// TODO: Import specific stripe api version
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

class StripeProduct{

    #id
    #name
    #images
    #url
    #active
    #defaultPriceId

    /**
     * Represents a Stripe product on the Stripe server.
     * @param {string} id Id of the product.
     * @param {string} name Name of the product.
     * @param {Array<string>} images Product image urls.
     * @param {string} url Product webpage url.
     * @param {string} defaultPriceId Id of Stripe price object which is the default price for this product.
     * @param {boolean} active Whether the product is currently available for purchase.
     */
    constructor(id, name, images, url, defaultPriceId, active){
        this.#id = id
        this.#name = name
        this.#images = images
        this.#url = url
        this.#defaultPriceId = defaultPriceId
        this.#active = active
    }

    /**
     * Creates a product on the Stripe server that will be available at checkout sessions. All details 
     * given will be displayed to customer at checkout. (Except id)
     * @param {string} id Id of product.
     * @param {string} name Name of product.
     * @param {Array<string>} images Product image urls. (Up to 8 urls)
     * @param {string} url Url of webpage for product.
     * @returns {StripeProduct}
     */
    static async create(id, name, images, url){
        try{

            // To not exceed Stripe rate limit
            await setTimeout(1000 / process.env.STRIPE_RATE_LIMIT)

            // Create Stripe product
            await stripe.products.create({
                id: id,
                name: name,
                images: images,
                url: url
            })

            return new StripeProduct(id, name, images, url, null, true)
        }
        catch (error){
            console.log(`Error in stripeProductModel.js function create: ${error.message}`)
            throw new Error(error.message)
        }
    }

    /**
     * Retrieves product from the Stripe server with specified id.
     * @param {string} id Id of product to retrieve.
     * @returns {StripeProduct}
     */
    static async findById(id){
        try{

            // To not exceed Stripe rate limit
            await setTimeout(1000 / process.env.STRIPE_RATE_LIMIT)

            // Get product from Stripe
            const product = await stripe.products.retrieve(id);

            return new StripeProduct(
                product.id,
                product.name,
                product.images,
                product.url,
                product.default_price,
                product.active
            )
        }
        catch (error){
            console.log(`Error in stripeProductModel.js function findById: ${error.message}`)
            throw new Error(error.message)
        }
    }

    /**
     * Updates the product on the Stripe server to reflect the current properties of this instance.
     * @returns {void}
     */
    async update(){
        try{

            // To not exceed Stripe rate limit
            await setTimeout(1000 / process.env.STRIPE_RATE_LIMIT)

            // Update product
            await stripe.products.update(
                this.#id,
                {
                    name: this.#name,
                    images: this.#images,
                    url: this.#url,
                    default_price: this.#defaultPriceId,
                    active: this.#active,
                }
            )
        }
        catch (error){
            console.log(`Error in stripeProductModel.js function update: ${error.message}`)
            throw new Error(error.message)
        }
    }

    // Getters and setters
    get id(){
        return this.#id
    }
    set id(_){
        throw new Error("StripeProduct id cannot be modified.")
    }

    get name(){
        return this.#name
    }
    set name(newName){
        this.#name = newName
    }

    get images(){
        return this.#images
    }
    set images(newImages){
        // Must be of length at most 8
        if (newImages.length > 8){
            throw new Error("There can only be at most 8 image urls.")
        }
        this.#images = newImages
    }

    get url(){
        return this.#url
    }
    set url(newUrl){
        this.#url = newUrl
    }

    get defaultPriceId(){
        return this.#defaultPriceId
    }
    set defaultPriceId(newDefaultPriceId){
        this.#defaultPriceId = newDefaultPriceId
    }

    get active(){
        return this.#active
    }
    set active(newActive){
        this.#active = newActive
    }
}

module.exports = StripeProduct