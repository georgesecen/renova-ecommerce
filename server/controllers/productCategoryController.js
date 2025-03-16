const { where } = require("sequelize")
const ProductCategory = require("../models/productCategoryModel")

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