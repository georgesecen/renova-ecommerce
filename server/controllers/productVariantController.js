const ProductVariant = require("../models/productVariantModel")
const { 
    createDatabaseAndStripeProductVariant, 
    deleteDatabaseAndStripeProductVariant, 
    deleteProductVariantGroup,
    updateProductVariantAndStripePrice,
    cloneProductVariantImages,
    addDatabaseAndStripeProductVariantImage,
    removeDatabaseAndStripeProductVariantImage
 } = require("../services/productVariantIntegrationService")
const { downloadImage, deleteImages } = require("../services/productService")

/**
 * Creates a product variant in the database and on Stripe.
 * @param {object} request Express js request object.
 * @param {object} response Express js response object.
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

    // Allow new operations to proceed
    global.stripeOperationInProgress = false
}

/**
 * Updates a product variants quantity in the database.
 * @param {object} request Express js request object.
 * @param {object} response Express js response object.
 */
exports.updateProductVariantQuantity = async (request, response) => {

    const {productVariantId, quantity} = request.body

    try{

        // Update quantity
        await ProductVariant.update(
            {
                stock_quantity: quantity
            },
            {
                where: {
                    id: productVariantId
                }
            }
        )

        console.log("Product variant quantity updated successfully in database.")
        response.status(200).json({
            message: "Product variant quantity updated successfully in database.",
        })
    } 
    catch (error){
        console.log(`Error in productVariantController.js function updateProductVariantQuantity: ${error.message}`)
        response.status(500).json({error: error.message})
    }
}

/**
 * Deletes a product variant in the database and on Stripe.
 * @param {object} request Express js request object.
 * @param {object} response Express js response object.
 */
exports.deleteProductVariant = async (request, response) => {

    const {productVariantId} = request.body

    try{

        await deleteDatabaseAndStripeProductVariant(productVariantId)

        console.log("Product variant deleted successfully in database and on Stripe.")
        response.status(200).json({
            message: "Product variant deleted successfully in database and on Stripe.",
        })
    } 
    catch (error){
        console.log(`Error in productVariantController.js function updateProductVariant: ${error.message}`)
        response.status(500).json({error: error.message})
    }

    // Allow new operations to proceed
    global.stripeOperationInProgress = false
}

exports.getProductVariants = async (request, response) => {
    try {
        const productId = request.params.id;
        console.log(request.params)

        console.log(productId)
        if (!productId) {
            console.log("no product id")
            return response.status(400).json({ error: 'product ID is required' });
        }

        console.log(`Fetching variants for product: ${productId}`);


        const variants = await ProductVariant.findAll({
            where: { product_id: productId }
        });

        console.log(variants);
        response.status(200).json(variants);
    } catch (error) {
        console.error('There was an error fetching variants', error);
        response.status(500).json({error: 'failed to fetch variants'});
    }
}

/*
Product variant groups are treated as all product variants which share the same product id
and color. 
*/

/**
 * Deletes every product variant in the group in the database and on Stripe.
 * @param {object} request Express js request object.
 * @param {object} response Express js response object.
 */
exports.deleteProductVariantGroup = async (request, response) => {

    const {productVariantIds} = request.body

    try{

        await deleteProductVariantGroup(productVariantIds)

        console.log("Product variant group deleted successfully in database and on Stripe.")
        response.status(200).json({
            message: "Product variant group deleted successfully in database and on Stripe.",
        })
    } 
    catch (error){
        console.log(`Error in productVariantController.js function deleteProductVariantGroup: ${error.message}`)
        response.status(500).json({error: error.message})
    }

    // Allow new operations to proceed
    global.stripeOperationInProgress = false
}

/**
 * Updates every product variants price in the group in the database and on Stripe.
 * @param {object} request Express js request object.
 * @param {object} response Express js response object.
 */
exports.updateProductVariantGroupPrice = async (request, response) => {

    const {productVariantIds, price} = request.body

    try{

        // Update price for every product variant in group
        for (const id of productVariantIds){
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

    // Allow new operations to proceed
    global.stripeOperationInProgress = false
}

/**
 * Adds image to every product variant in the group in the database and on Stripe.
 * @param {object} request Express js request object.
 * @param {object} response Express js response object.
 */
exports.addProductVariantGroupImage = async (request, response) => {

    try{

        const {productVariantIds, productId} = request.body
        const {originalname, buffer} = request.file

        // Download image to server and get file name
        const fileName = await downloadImage(originalname, buffer)

        // Add image to every product variant in group
        for (const id of productVariantIds){
            await addDatabaseAndStripeProductVariantImage(productId, id, fileName)
        }

        console.log("Product variant group image added successfully in database, on Stripe, and on server.")
        response.status(200).json({
            message: "Product variant group image added successfully in database, on Stripe, and on server.",
        })
    } 
    catch (error){
        console.log(`Error in productVariantController.js function addProductVariantGroupImage: ${error.message}`)
        response.status(500).json({error: error.message})
    }

    // Allow new operations to proceed
    global.stripeOperationInProgress = false
}

/**
 * Removes image from every product variant in the group in the database and on Stripe.
 * @param {object} request Express js request object.
 * @param {object} response Express js response object.
 */
exports.removeProductVariantGroupImage = async (request, response) => {

    const {productVariantIds, fileName} = request.body

    try{

        // Remove image for every product variant in group
        for (const id of productVariantIds){
            await removeDatabaseAndStripeProductVariantImage(id, fileName)
        }

        // Delete image off of server as it is no longer being used by anything
        await deleteImages([fileName])

        console.log("Product variant group image removed successfully in database, on Stripe, and on server.")
        response.status(200).json({
            message: "Product variant group image removed successfully in database, on Stripe, and on server.",
        })
    } 
    catch (error){
        console.log(`Error in productVariantController.js function removeProductVariantGroupImage: ${error.message}`)
        response.status(500).json({error: error.message})
    }

    // Allow new operations to proceed
    global.stripeOperationInProgress = false
}
