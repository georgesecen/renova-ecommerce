const ProductVariant = require("../models/productVariantModel")

/**
 * Creates a product variant in the database.
 * @param {Object} request Express js request object.
 * @param {Object} response Express js response object.
 */
exports.createProductVariant = async (request, response) => {

    const {productId, color, size, quantity, price} = request.body

    try{

        // Create product variant
        await ProductVariant.create({
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

/**
 * Updates a product variant in the database.
 * @param {Object} request Express js request object.
 * @param {Object} response Express js response object.
 */
exports.updateProductVariant = async (request, response) => {

    const {id, color, size, quantity, price} = request.body

    try{

        // Get product variant
        const productVariant = await ProductVariant.findByPk(id)

        // If product variant  does not exist
        if (productVariant == null){
            throw new Error(`Product variant with ID ${id} does not exist in database.`)
        }

        // Update product variant
        await productVariant.update({
            color: color,
            size: size,
            stock_quantity: quantity,
            price: price
        })

        console.log("Product variant updated successfully in database.")
        response.status(200).json({
            message: "Product variant updated successfully in database.",
        })
    } 
    catch (error){
        console.log(`Error in productVariantController.js function updateProductVariant: ${error.message}`)
        response.status(500).json({error: error.message})
    }
}

/**
 * Deletes a product variant in the database.
 * @param {Object} request Express js request object.
 * @param {Object} response Express js response object.
 */
exports.deleteProductVariant = async (request, response) => {

    const {id} = request.body

    try{

        // Get product variant
        const productVariant = await ProductVariant.findByPk(id)

        // If product variant does not exist
        if (productVariant == null){
            throw new Error(`Product variant with ID ${id} does not exist in database.`)
        }

        // Delete product variant
        await productVariant.destroy()

        console.log("Product variant deleted successfully in database.")
        response.status(200).json({
            message: "Product variant deleted successfully in database.",
        })
    } 
    catch (error){
        console.log(`Error in productVariantController.js function updateProductVariant: ${error.message}`)
        response.status(500).json({error: error.message})
    }
}