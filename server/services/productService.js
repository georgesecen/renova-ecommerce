const ProductImage = require("../models/productImageModel")
const ProductVariant = require("../models/productVariantModel")
const Product = require("../models/productModel")
const path = require('path')
const fs = require('fs')
const { deleteProductVariant } = require("../services/productVariantIntegrationService")

/**
 * Downloads an image file to the server itself.
 * @param {string} fileName Original name of image file which will be uploaded. (Name will be different on server)
 * @param {Buffer} buffer The file data as a buffer.
 * @returns {Promise<string>} Image name on server.
 */
exports.downloadImage = async (fileName, buffer) => {
    try{

        // Note: When working with paths avoid using slashes at all costs as different operating 
        // systems use different slashes

        // Get path to images folder on server
        const serverPath = path.dirname(__dirname)
        const imagesPath = path.join(serverPath, "public", "images") 
        
        // Image name on server will be time image was created at
        const imageName = `${new Date().getTime()}${path.extname(fileName)}`

        // Add image to server
        await fs.promises.writeFile(path.join(imagesPath, imageName), buffer)

        return imageName

    } catch(error){
        throw new Error(`Error in productService.js function downloadImage: ${error}`)
    }
}

/**
 * Creates an image for product/product variant in the database. If there exists a buffer, image will also be 
 * stored on the server itself.
 * @param {number} productId ID of product that image will belong to.
 * @param {number} productVariantId ID of product variant that image will belong to.
 * @param {number} isPrimary 1 if the image is the primary image for the product/product variant, otherwise 0.
 * @param {string} fileName Name of image file which will be uploaded. (If buffer exists name on server will be image primary key)
 * @param {Buffer} buffer The file data as a buffer. Defaults to null.
 * @returns {Promise<string>} Image url in database.
 */
exports.createProductImage = async (productId, productVariantId, isPrimary, fileName, buffer = null) => {
    try{

        // Add image details to database
        const image = await ProductImage.create({
            product_id: productId,
            product_variant_id: productVariantId,
            is_primary: isPrimary,
            image_url: fileName
        })

        // If there is an image to be uploaded to the server
        if (buffer !== null){

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
        }

        return fileName

    } catch(error){
        throw new Error(`Error in productService.js function createDatabaseProductImage: ${error}`)
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
        throw new Error(`Error in productService.js function deleteDatabaseProductImage: ${error}`)
    }
}

/**
 * Deletes product and all images associated with product, and any product variants belonging to product, in 
 * the database and on the server.
 * @param {number} productId ID of product to delete.
 */
exports.deleteProduct = async (productId) => {
    try{

        // Get all product variants belonging to product
        const productVariants = await ProductVariant.findAll({
            where: {
                product_id: productId
            }
        })

        // Delete all product variants
        for (const productVariant of productVariants){
            await deleteProductVariant(productVariant.id)
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

        // Delete product
        await Product.destroy({
            where: {
                id: productId
            }
        })

    } catch(error){
        throw new Error(`Error in productService.js function deleteProduct: ${error}`)
    }
}