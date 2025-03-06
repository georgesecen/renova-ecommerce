const ProductVariant = require("../models/productVariantModel")
const { 
    createDatabaseAndStripeProductVariant, 
    deleteDatabaseAndStripeProductVariant, 
    deleteProductVariantGroup,
    updateProductVariantAndStripePrice,
    cloneProductVariantImages
 } = require("../services/productVariantIntegrationService")

/**
 * Creates a product variant in the database and on Stripe.
 * @param {Object} request Express js request object.
 * @param {Object} response Express js response object.
 */
exports.createProductVariant = async (request, response) => {

    const {productId, color, size, quantity, price, sourceProductVariantId} = request.body

    try{

        // Create product variant and get its id
        const id = await createDatabaseAndStripeProductVariant(productId, color, size, quantity, price)

        // If there exists a source product variant in the request, clone images of source product variant
        // to newly created product variant
        if (sourceProductVariantId !== null){
            await cloneProductVariantImages(id, sourceProductVariantId)
        }

        console.log("Product variant created successfully in database and on Stripe.")
        response.status(200).json({
            message: "Product variant created successfully in database and on Stripe.",
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
 * Deletes a product variant in the database and on Stripe.
 * @param {Object} request Express js request object.
 * @param {Object} response Express js response object.
 */
exports.deleteProductVariant = async (request, response) => {

    const {id} = request.body

    try{

        await deleteDatabaseAndStripeProductVariant(id)

        console.log("Product variant deleted successfully in database and on Stripe.")
        response.status(200).json({
            message: "Product variant deleted successfully in database and on Stripe.",
        })
    } 
    catch (error){
        console.log(`Error in productVariantController.js function updateProductVariant: ${error.message}`)
        response.status(500).json({error: error.message})
    }
}

/*
Product variant groups are treated as all product variants which share the same product id
and color. 
*/

/**
 * Deletes every product variant in the group in the database and on Stripe.
 * @param {Object} request Express js request object.
 * @param {Object} response Express js response object.
 */
exports.deleteProductVariantGroup = async (request, response) => {

    const {ids} = request.body

    try{

        await deleteProductVariantGroup(ids)

        console.log("Product variant group deleted successfully in database and on Stripe.")
        response.status(200).json({
            message: "Product variant group deleted successfully in database and on Stripe.",
        })
    } 
    catch (error){
        console.log(`Error in productVariantController.js function deleteProductVariantGroup: ${error.message}`)
        response.status(500).json({error: error.message})
    }
}

/**
 * Updates every product variants price in the group in the database and on Stripe.
 * @param {Object} request Express js request object.
 * @param {Object} response Express js response object.
 */
exports.updateProductVariantGroupPrice = async (request, response) => {

    const {ids, price} = request.body

    try{

        // Update price for every product variant in group
        for (const id in ids){
            await updateProductVariantAndStripePrice(id, price)
        }

        console.log("Product variant group price updated successfully in database and on Stripe.")
        response.status(200).json({
            message: "Product variant group price updated successfully in database and on Stripe.",
        })
    } 
    catch (error){
        console.log(`Error in productVariantController.js function updateProductVariantGroupPrice: ${error.message}`)
        response.status(500).json({error: error.message})
    }
}