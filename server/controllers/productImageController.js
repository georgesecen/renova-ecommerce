const Image = require('../models/productImageModel');
const fs = require('fs')
const path = require('path')

/**
 * Creates a image in the database.
 * @param {Object} request Express js request object.
 * @param {Object} response Express js response object.
 */
exports.createImage = async (request, response) => {

    const {productId, productVariantId, isPrimary, url} = request.body
    const {originalname, encoding, buffer} = request.file

    try{

        // Create image
        const image = await Image.create({
            product_id: productId,
            product_variant_id: productVariantId,
            is_primary: isPrimary,
            image_url: url
        })

        // Note: When working with paths avoid using slashes at all costs as different operating 
        // systems use different slashes

        // Get path to images folder on server
        const serverPath = path.dirname(__dirname)
        const imagesPath = path.join(serverPath, "public", "images")        
        
        // Add image to server
        // Note: Images with same name will be overwritten
        await fs.promises.writeFile(path.join(imagesPath, `test${path.extname(originalname)}`), buffer)

        console.log(request.file)

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