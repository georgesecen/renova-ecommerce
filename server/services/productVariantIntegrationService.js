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
        const stripeProduct = await StripeProduct.create(productVariant.id, name, product.description, [], "https://google.com")

        // Create price on Stripe server for Stripe product
        await StripePrice.create(price, stripeProduct.id)

    } catch(error){
        throw Error(`Error in productVariantIntegrationService.js function createDatabaseAndStripeProduct: ${error}`)
    }
}