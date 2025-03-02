const Image = require('../models/productImageModel');
const fs = require('fs')
const path = require('path');
const { createProductImage } = require('../services/productVariantIntegrationService');

/**
 * Creates an image in the database and adds image to the server.
 * @param {Object} request Express js request object.
 * @param {Object} response Express js response object.
 */
exports.createImage = async (request, response) => {

    const {productId, productVariantId, isPrimary} = request.body
    const {originalname, buffer} = request.file

    try{

        await createProductImage(productId, productVariantId, isPrimary, originalname, buffer)

        console.log("Image created successfully in database and added to server.")
        response.status(200).json({
            message: "Image created successfully in database and added to server.",
        })
    } 
    catch (error){
        console.log(`Error in imageController.js function createImage: ${error.message}`)
        response.status(500).json({error: error.message})
    }
}

/**
 * Deletes an image in the database and on the server.
 * @param {Object} request Express js request object.
 * @param {Object} response Express js response object.
 */
exports.deleteImage = async (request, response) => {

    const {id} = request.body

    try{

        // Get image from database
        const image = await Image.findByPk(id)

        // If image does not exist
        if (image == null){
            throw new Error(`Image with ID ${id} does not exist in database.`)
        }

        // Get image name so we know what image to delete on server
        const imageName = image.image_url

        // Delete image on database
        await image.destroy()

        // Get path to image on server
        const serverPath = path.dirname(__dirname)
        const imagePath = path.join(serverPath, "public", "images", imageName)   

        // Delete image on server
        await fs.promises.rm(imagePath)

        console.log("Image deleted successfully in database and on server.")
        response.status(200).json({
            message: "Image deleted successfully in database and on server.",
        })
    } 
    catch (error){
        console.log(`Error in productImageController.js function deleteImage: ${error.message}`)
        response.status(500).json({error: error.message})
    }
}