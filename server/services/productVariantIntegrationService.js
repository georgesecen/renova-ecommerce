const ProductImage = require("../models/productImageModel")
const Product = require("../models/productModel")
const ProductVariant = require("../models/productVariantModel")
const StripePrice = require("../models/stripePriceModel")
const StripeProduct = require("../models/stripeProductModel")
const path = require('path')
const fs = require('fs')

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
 * @param {number} productVariantId ID of product variant to be deleted.
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

/**
 * Creates an image for product/product variant in the database and on the server itself. (Name 
 * of image on server is primary key of corresponding image in database)
 * @param {number} productId ID of product that image will belong to.
 * @param {number} productVariantId ID of product variant that image will belong to.
 * @param {number} isPrimary 1 if the image is the primary image for the product/product variant, otherwise 0.
 * @param {string} fileName Image file name to be uploaded. (Name will be different on server)
 * @param {BUffer} buffer The file data as a buffer.
 */
exports.createProductImage = async (productId, productVariantId, isPrimary, fileName, buffer) => {
    try{

        // Add image details to database
        const image = await ProductImage.create({
            product_id: productId,
            product_variant_id: productVariantId,
            is_primary: isPrimary,
        })

        // Note: When working with paths avoid using slashes at all costs as different operating 
        // systems use different slashes

        // Get path to images folder on server
        const serverPath = path.dirname(__dirname)
        const imagesPath = path.join(serverPath, "public", "images") 
        
        // Image name on server will be primary key of corresponding image in database followed by
        // the image extension
        const imageName = `${image.id}${path.extname(fileName)}`

        // Add image to server
        // Note: Images with same name will be overwritten.
        await fs.promises.writeFile(path.join(imagesPath, imageName), buffer)

        // Update image_url to the image added to server
        await image.update({
            image_url: imageName
        })

    } catch(error){
        throw Error(`Error in productVariantIntegrationService.js function createProductImage: ${error}`)
    }
}

/**
 * Deletes an image in the database and on the server itself.
 * @param {number} imageId ID of image to delete.
 */
exports.deleteProductImage = async (imageId) => {
    try{

        // Get image from database
        const image = await ProductImage.findByPk(imageId)

        // Get image name so we know what image to delete on server
        const imageName = image.image_url

        // Delete image in database
        await image.destroy()

        // Get path to image on server
        const serverPath = path.dirname(__dirname)
        const imagePath = path.join(serverPath, "public", "images", imageName)   

        // Delete image on server
        await fs.promises.rm(imagePath)

    } catch(error){
        throw Error(`Error in productVariantIntegrationService.js function deleteProductImage: ${error}`)
    }
}

