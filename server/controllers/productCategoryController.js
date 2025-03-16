const ProductCategory = require("../models/productCategoryModel")
const Product = require("../models/productModel")

/**
 * Creates a product category in the database.
 * @param {object} request Express js request object.
 * @param {object} response Express js response object.
 */
exports.createProductCategory = async (request, response) => {

    const {name} = request.body

    try{

        await ProductCategory.create({
            name: name
        })

        console.log("Product category created successfully in database.")
        response.status(200).json({
            message: "Product category created successfully in database.",
        })
    } 
    catch (error){
        console.log(`Error in productCategoryController.js function createProductCategory: ${error.message}`)
        response.status(500).json({error: error.message})
    }
}

/**
 * Updates a product category name in the database.
 * @param {object} request Express js request object.
 * @param {object} response Express js response object.
 */
exports.updateProductCategory = async (request, response) => {

    const {categoryId, name} = request.body

    try{

        await ProductCategory.update(
            {
                name: name
            },
            {
                where: {
                    id: categoryId
                }
            }
        )

        console.log("Product category updated successfully in database.")
        response.status(200).json({
            message: "Product category updated successfully in database.",
        })
    } 
    catch (error){
        console.log(`Error in productCategoryController.js function updateProductCategory: ${error.message}`)
        response.status(500).json({error: error.message})
    }
}

/**
 * Delete product category in the database. Category will only be deleted if there are
 * no products that are associated with category.
 * @param {object} request Express js request object.
 * @param {object} response Express js response object.
 */
exports.deleteProductCategory = async (request, response) => {

    const {categoryId} = request.body

    try{

        // Get all products belonging to category
        const products = await Product.findAll({
            where: {
                categoryId: categoryId
            }
        })

        // If there are products that exist in the category do not delete category as then there will be 
        // products with non existent categories
        if (products.length > 0){
            throw new Error("Must delete all products in category before deleting category!")
        }

        // Otherwise there are no products in category so category is safe to delete
        await ProductCategory.destroy({
            where: {
                id: categoryId
            }
        })

        console.log("Product category deleted successfully in database.")
        response.status(200).json({
            message: "Product category deleted successfully in database.",
        })
    } 
    catch (error){
        console.log(`Error in productCategoryController.js function deleteProductCategory: ${error.message}`)
        response.status(500).json({error: error.message})
    }
}