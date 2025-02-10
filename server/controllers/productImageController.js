const Image = require('../models/productImageModel');
const fs = require('fs')
const path = require('path')

/**
 * Creates an image in the database and adds image to the server.
 * @param {Object} request Express js request object.
 * @param {Object} response Express js response object.
 */
exports.createImage = async (request, response) => {

    const {productId, productVariantId, isPrimary} = request.body
    const {originalname, buffer} = request.file

    try{

        // Add image details to database
        const image = await Image.create({
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
        const imageName = `${image.id}${path.extname(originalname)}`
        
        // Add image to server
        // Note: Images with same name will be overwritten.
        await fs.promises.writeFile(path.join(imagesPath, imageName), buffer)

        // Update image_url to the image added to server
        await image.update({
            image_url: imageName
        })

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