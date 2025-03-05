const ProductImage = require("../models/productImageModel")
const Product = require("../models/productModel")
const ProductVariant = require("../models/productVariantModel")
const StripePrice = require("../models/stripePriceModel")
const StripeProduct = require("../models/stripeProductModel")
const path = require('path')
const fs = require('fs')
const { createProductImage, deleteDatabaseProductImage } = require("../services/productService")

/**
 * Creates a product variant in the database and on Stripe with the specified details.
 * @param {string} productId ID of product which product variant is derived from.
 * @param {string} color Color of product variant.
 * @param {string} size Size of product variant. (XL, S, M etc)
 * @param {number} quantity Quantity of product variant.
 * @param {number} price Price of product variant.
 */
exports.createDatabaseAndStripeProductVariant = async (productId, color, size, quantity, price) => {
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
        throw new Error(`Error in productVariantIntegrationService.js function createDatabaseAndStripeProductVariant: ${error}`)
    }
}

/**
 * Deletes product variant in the database and archives product variant on Stripe. All images 
 * belonging to product variant will also be deleted in the database.
 * @param {number} productVariantId ID of product variant to be deleted.
 */
exports.deleteDatabaseAndStripeProductVariant = async (productVariantId) => {
    try{

        // Delete all images of product variant from database
        await ProductImage.destroy({
            where: {
                product_variant_id: productVariantId
            }
        })

        // Delete product variant from database
        await ProductVariant.destroy({
            where: {
                id: productVariantId
            }
        })

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
        throw new Error(`Error in productVariantIntegrationService.js function deleteDatabaseAndStripeProductVariant: ${error}`)
    }
}

/**
 * Adds an image for a product variant in the database and on Stripe.
 * @param {number} productId ID of product that image will belong to.
 * @param {number} productVariantId ID of product variant that image will belong to.
 * @param {string} fileName Name of image file on server to be used.
 */
exports.addDatabaseAndStripeProductVariantImage = async (productId, productVariantId, fileName) => {
    try{

        // Add image for product variant in database
        await ProductImage.create({
            product_id: productId,
            product_variant_id: productVariantId,
            image_url: fileName
        })

        // Get product variant from Stripe
        const product = await StripeProduct.findById(`${productVariantId}`)

        // Get path to image on server
        const serverPath = path.dirname(__dirname)
        const imagePath = path.join(serverPath, "public", "images", fileName) 

        // Add image to Stripe product variant
        // TODO: Uncomment next line which adds actual image url (server cannot be localhost)
        // product.images.push(imagePath)
        product.images.push("https://google.com")
        await product.update()

    } catch(error){
        throw new Error(`Error in productVariantIntegrationService.js function addDatabaseAndStripeProductVariantImage: ${error}`)
    }
}

/**
 * Removes an image for a product variant in the database and on Stripe.
 * @param {number} productVariantId ID of product variant which image belongs to.
 * @param {number} fileName Name of image file on server.
 */
exports.removeDatabaseAndStripeProductVariantImage = async (productVariantId, fileName) => {
    try{

        // Delete image record for product variant in the database
        await ProductImage.destroy({
            where: {
                product_variant_id: productVariantId,
                image_url: fileName
            }
        })

        // Get product variant from Stripe
        const product = await StripeProduct.findById(`${productVariantId}`)

        // Get path to where image was is on server
        const serverPath = path.dirname(__dirname)
        const imagePath = path.join(serverPath, "public", "images", fileName) 

        // Remove image from Stripe product variant
        if (product.images.includes(imagePath)){
            product.images.splice(product.images.indexOf(imagePath), 1)
            await product.update()
        } 

    } catch(error){
        throw new Error(`Error in productVariantIntegrationService.js function removeDatabaseAndStripeProductVariantImage: ${error}`)
    }
}

/**
 * Clones the images which belong to the source product variant and adds them to the product variant. Product variants cloned images
 * will be added to the database and Stripe. (Product variant should have 0 images belonging to it, function does not remove current 
 * images belonging to product variant before adding cloned images)
 * @param {number} productId ID of product that product variant belongs to.
 * @param {number} productVariantId ID of product variant which images will be added to.
 * @param {number} sourceProductVariantId ID of product variant containing the images to be cloned.
 */
exports.cloneProductVariantImages = async (productId, productVariantId, sourceProductVariantId) => {
    try{

        // Get all the images of the source product variant
        const images = await ProductImage.findAll({
            where: {
                product_variant_id: sourceProductVariantId
            },
            attributes: ["is_primary", "image_url"]
        })

        // Store all urls of newly created images for product variant
        const imageUrls = []

        for (const image of images){
            
            // Copy exact same image from source product variant to product variant
            imageUrls.push(await createProductImage(productId, productVariantId, image.is_primary, image.image_url))
        }
        
        // Get product variant from Stripe
        const product = await StripeProduct.findById(`${productVariantId}`)

        // Replace images of product variant to those of target product variant on Stripe
        // TODO: Uncomment next line which adds actual image urls (server cannot be localhost)
        // product.images = imageUrls
        product.images = ["https://google.com"]
        await product.update()

    } catch(error){
        throw new Error(`Error in productVariantIntegrationService.js function cloneProductVariantImages: ${error}`)
    }
}

/**
 * Updates price for product variant in the database and on Stripe.
 * @param {number} productVariantId ID of product variant to update price for.
 * @param {number} price New price to give product variant. (In dollars)
 */
exports.updateProductVariantAndStripePrice = async (productVariantId, price) => {
    try{

        // Update product variant in database
        await ProductVariant.update(
            {
                price: price
            },
            {
                where: {
                    id: productVariantId
                }
            }
        )

        // Get product from Stripe
        const stripeProduct = await StripeProduct.findById(`${productVariantId}`)
        
        // Get products price object on Stripe server
        const stripePrice = stripeProduct.defaultPriceId ? await StripePrice.findById(stripeProduct.defaultPriceId) : null

        // If there is no price for product or price has changed
        if (stripePrice == null || stripePrice.unitAmount != price){

            // Create new Stripe price for product
            const newStripePrice = await StripePrice.create(price, stripeProduct.id)

            // Update Stripe product to have new price
            stripeProduct.defaultPriceId = newStripePrice.id
            await stripeProduct.update()
        }        

        // If there exists a price for product and price has been changed
        if (stripePrice !== null && stripePrice.unitAmount != price){
            
            // Archive old Stripe price as product has been given updated price
            stripePrice.active = false
            await stripePrice.update()
        }

    } catch(error){
        throw new Error(`Error in productVariantIntegrationService.js function updateProductVariantAndStripePrice: ${error}`)
    }
}