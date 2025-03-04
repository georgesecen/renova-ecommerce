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
        throw Error(`Error in productVariantIntegrationService.js function createDatabaseAndStripeProduct: ${error}`)
    }
}

/**
 * Deletes product variant in the database and archives product variant on Stripe.
 * @param {number} productVariantId ID of product variant to be deleted.
 */
exports.deleteDatabaseAndStripeProductVariant = async (productVariantId) => {
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
 * @param {string} fileName Name of image file which will be uploaded. (Name will be different on server)
 * @param {Buffer} buffer The file data as a buffer.
 * @returns {Promise<string>} Image name of file on server.
 */
exports.createDatabaseProductImage = async (productId, productVariantId, isPrimary, fileName, buffer) => {
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

        return imageName

    } catch(error){
        throw Error(`Error in productVariantIntegrationService.js function createDatabaseProductImage: ${error}`)
    }
}

/**
 * Deletes an image in the database and on the server itself.
 * @param {number} imageId ID of image to delete.
 * @returns {Promise<string>} Image name of file deleted from server.
 */
exports.deleteDatabaseProductImage = async (imageId) => {
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

        return imageName

    } catch(error){
        throw Error(`Error in productVariantIntegrationService.js function deleteDatabaseProductImage: ${error}`)
    }
}

/**
 * Creates an image for a product variant in the database, on the server itself, and on Stripe.
 * @param {number} productId ID of product that image will belong to.
 * @param {number} productVariantId ID of product variant that image will belong to.
 * @param {number} isPrimary 1 if the image is the primary image for the product/product variant, otherwise 0.
 * @param {string} fileName Name of image file which will be uploaded. (Name will be different on server)
 * @param {Buffer} buffer The file data as a buffer.
 */
exports.createDatabaseAndStripeProductImage = async (productId, productVariantId, isPrimary, fileName, buffer) => {
    try{

        // Get name of image file added to server for product variant
        const name = await this.createDatabaseProductImage(productId, productVariantId, isPrimary, fileName, buffer)

        // Get product variant from Stripe
        const product = await StripeProduct.findById(`${productVariantId}`)

        // Get path to image on server
        const serverPath = path.dirname(__dirname)
        const imagePath = path.join(serverPath, "public", "images", name) 

        // Add image to Stripe product variant
        // TODO: Uncomment next line which adds actual image url (server cannot be localhost)
        // product.images.push(imagePath)
        product.images.push("https://google.com")
        await product.update()

    } catch(error){
        throw Error(`Error in productVariantIntegrationService.js function createDatabaseAndStripeProductImage: ${error}`)
    }
}

/**
 * Deletes an image for a product variant in the database, on the server itself, and on Stripe.
 * @param {number} productVariantId ID of product variant which image belongs to.
 * @param {number} imageId ID of image to be deleted.
 */
exports.deleteDatabaseAndStripeProductImage = async (productVariantId, imageId) => {
    try{

        // Get name of image file deleted from server
        const name = await this.deleteDatabaseProductImage(imageId)

        // Get product variant from Stripe
        const product = await StripeProduct.findById(`${productVariantId}`)

        // Get path to where image was on server
        const serverPath = path.dirname(__dirname)
        const imagePath = path.join(serverPath, "public", "images", name) 

        // Remove image from Stripe product variant
        // TODO: Uncomment next lines which removes actual image url (server cannot be localhost)
        // if (product.images.includes(imagePath)){
        //     product.images.splice(product.images.indexOf(imagePath), 1)
        //     await product.update()
        // } 

    } catch(error){
        throw Error(`Error in productVariantIntegrationService.js function deleteDatabaseAndStripeProductImage: ${error}`)
    }
}

/**
 * Clones the images which belong to the source product variant and adds them to the product variant. Product variants cloned images
 * will be added to the database and Stripe. (Product variant should have 0 images belonging to it, function does not remove current 
 * images belonging to product variant before adding clonded images)
 * @param {number} productId ID of product that product variant belongs to.
 * @param {number} productVariantId ID of product variant which images will be added to.
 * @param {number} sourceProductVariantId ID of product variant containing the images to be cloned.
 */
const cloneProductImages = async (productId, productVariantId, sourceProductVariantId) => {
    try{

        // Get all the images of the target product variant
        const images = await ProductImage.findAll({
            where: {
                product_variant_id: sourceProductVariantId
            },
            attributes: ["is_primary", "image_url"]
        })

        // Get path to images folder on server
        const serverPath = path.dirname(__dirname)
        const imagesPath = path.join(serverPath, "public", "images") 

        // Store all urls of newly created images for product variant
        const imageUrls = []

        for (const image of images){
            // Get buffer of image file
            const buffer = await fs.promises.readFile(path.join(imagesPath, image.image_url))
            
            // Copy exact same image from target product variant to product variant
            imageUrls.push(await this.createDatabaseProductImage(productId, productVariantId, image.is_primary, image.image_url, buffer))
        }
        
        // Get product variant from Stripe
        const product = await StripeProduct.findById(`${productVariantId}`)

        // Replace images of product variant to those of target product variant on Stripe
        // TODO: Uncomment next line which adds actual image urls (server cannot be localhost)
        // product.images = imageUrls
        product.images = ["https://google.com"]
        await product.update()

    } catch(error){
        throw Error(`Error in productVariantIntegrationService.js function cloneProductImages: ${error}`)
    }
}

/**
 * Deletes all images associated with product variant in the database and on the server itself.
 * @param {number} productVariantId ID of product variant to delete all associated images.
 */
exports.deleteAllDatabaseProductVariantImages = async (productVariantId) => {
    try{

        // Get all images of product variant
        const images = await ProductImage.findAll({
            where: {
                product_variant_id: productVariantId
            }
        })

        // Delete each image from server and database
        for (const image of images){
            await this.deleteDatabaseProductImage(image.id)
        }

    } catch(error){
        throw Error(`Error in productVariantIntegrationService.js function deleteAllDatabaseProductVariantImages: ${error}`)
    }
}

/**
 * Deletes all images associated with product, and any product variants belonging to product, in the database
 * and on the server.
 * @param {number} productId ID of product to delete all associated images.
 */
exports.deleteAllDatabaseProductImages = async (productId) => {
    try{

        // Get all product variants belonging to product
        const productVariants = await ProductVariant.findAll({
            where: {
                product_id: productId
            }
        })

        // Delete all images which belong to product variants
        for (const productVariant of productVariants){
            await this.deleteAllDatabaseProductVariantImages(productVariant.id)
        }

        // Get all images of product
        const images = await ProductImage.findAll({
            where: {
                product_id: productId
            }
        })

        // Delete each image of product from server and database
        for (const image of images){
            await this.deleteDatabaseProductImage(image.id)
        }

    } catch(error){
        throw Error(`Error in productVariantIntegrationService.js function deleteAllDatabaseProductImages: ${error}`)
    }
}