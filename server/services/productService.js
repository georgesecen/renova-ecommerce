const ProductImage = require("../models/productImageModel")
const ProductVariant = require("../models/productVariantModel")
const Product = require("../models/productModel")
const path = require('path')
const fs = require('fs')
const { deleteProductVariantGroup } = require("../services/productVariantIntegrationService")

/**
 * Downloads an image file to the server itself.
 * @param {string} fileName Original name of image file which will be downloaded. (Name will be different on server)
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
 * Deletes all image files in fileNames on the server itself.
 * @param {Array<string>} fileNames Image names on server to be deleted.
 */
exports.deleteImages = async (fileNames) => {
    try{

        // Get path to images folder on server
        const serverPath = path.dirname(__dirname)
        const imagesPath = path.join(serverPath, "public", "images")   

        // Delete every file in fileNames on server
        for (const fileName of new Set(fileNames)){
            await fs.promises.rm(path.join(imagesPath, fileName))
        }

    } catch(error){
        throw new Error(`Error in productService.js function deleteImages: ${error}`)
    }
}

/**
 * Deletes product and all product variants associated with product. All product variants are also removed
 * from Stripe. All images associated with product and all product variants are deleted in the database and
 * on the server itself.
 * @param {number} productId ID of product to delete.
 */
exports.deleteProduct = async (productId) => {
    try{

        // Get all product variant ids belonging to product
        const productVariantIds = (await ProductVariant.findAll({
            where: {
                product_id: productId
            }, 
            attributes: ["id"]
        })).map(productVariant => productVariant.id)
        

        // Delete all product variants from database and Stripe. Also deleting their images from database
        // and server.
        await deleteProductVariantGroup(productVariantIds)

        // Get all image files used by product
        const fileNames = (await ProductImage.findAll({
            where: {
                product_id: productId
            }, 
            attributes: ["image_url"]
        })).map(image => image.image_url)

        // Delete all images from server and database
        await this.deleteImages(fileNames)
        await ProductImage.destroy({
            where: {
                product_id: productId
            }
        })

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