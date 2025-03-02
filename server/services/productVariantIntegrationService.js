const Product = require("../models/productModel")
const ProductVariant = require("../models/productVariantModel")
const StripePrice = require("../models/stripePriceModel")
const StripeProduct = require("../models/stripeProductModel")


/**
 * Creates a product variant in the database and on Stripe with the specified details.
 * @param {string} productId ID of product which product variant is derived from.
 * @param {string} color Color of product variant.
 * @param {string} size Size of product variant. (XL, S, M etc)
 * @param {number} quantity Quantity of product variant.
 * @param {number} price Price of product variant.
 */
exports.createDatabaseAndStripeProduct = async (productId, color, size, quantity, price) => {
    try{

        // Get product variants product
        const product = await Product.findByPk(productId)

        // Add product variant to database
        const productVariant = await ProductVariant.create({
            product_id: productId,
            color: color,
            size: size,
            stock_quantity: quantity,
            price: price
        })

        // Create product on Stripe server
        // TODO: Change product url
        const name = `${product.name} ${size} ${color}`
        const stripeProduct = await StripeProduct.create(`${productVariant.id}`, name, product.description, [], "https://google.com")

        // Create price on Stripe server for Stripe product
        const stripePrice = await StripePrice.create(price, stripeProduct.id)

        // Set the price of Stripe product
        stripeProduct.defaultPriceId = stripePrice.id
        await stripeProduct.update()

    } catch(error){
        throw Error(`Error in productVariantIntegrationService.js function createDatabaseAndStripeProduct: ${error}`)
    }
}

/**
 * Deletes product variant in the database and archives product variant on Stripe.
 * @param {number} productVariantId ID of product variant.
 */
exports.deleteDatabaseAndStripeProduct = async (productVariantId) => {
    try{

        // Get and delete product variant from database
        const productVariant = await ProductVariant.findByPk(productVariantId)
        await productVariant.destroy()

        // Get product on Stripe server
        const stripeProduct = await StripeProduct.findById(productVariantId)

        // Get products price on Stripe server
        const stripePrice = stripeProduct.defaultPriceId ? await StripePrice.findById(stripeProduct.defaultPriceId) : null

        // Archive product
        stripeProduct.active = false
        await stripeProduct.update()

        // If there is a price for product
        if (stripePrice !== null){

            // Archive products Stripe price
            stripePrice.active = false
            await stripePrice.update()
        }

    } catch(error){
        throw Error(`Error in productVariantIntegrationService.js function deleteDatabaseAndStripeProduct: ${error}`)
    }
}

