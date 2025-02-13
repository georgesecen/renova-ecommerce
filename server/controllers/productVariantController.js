const ProductVariantModel = require("../models/productVariantModel")

/**
 * Creates a product variant in the database.
 * @param {Object} request Express js request object.
 * @param {Object} response Express js response object.
 */
exports.createProductVariant = async (request, response) => {

    const {productId, color, size, quantity, price} = request.body

    try{

        // Create product variant
        await ProductVariantModel.create({
            product_id: productId,
            color: color,
            size: size,
            stock_quantity: quantity,
            price: price
        })

        console.log("Product variant created successfully in database.")
        response.status(200).json({
            message: "Product variant created successfully in database.",
        })
    } 
    catch (error){
        console.log(`Error in productVariantController.js function createProductVariant: ${error.message}`)
        response.status(500).json({error: error.message})
    }
}