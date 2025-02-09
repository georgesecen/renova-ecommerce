const Image = require('../models/productImageModel');

/**
 * Creates a image in the database.
 * @param {Object} request Express js request object.
 * @param {Object} response Express js response object.
 */
exports.createImage = async (request, response) => {

    const {productId, productVariantId, isPrimary, url} = request.body

    try{

        // Create image
        await Image.create({
            product_id: productId,
            product_variant_id: productVariantId,
            is_primary: isPrimary,
            image_url: url
        })

        console.log("Image created successfully in database.")
        response.status(200).json({
            message: "Image created successfully in database.",
        })
    } 
    catch (error){
        console.log(`Error in imageController.js function createImage: ${error.message}`)
        response.status(500).json({error: error.message})
    }
}