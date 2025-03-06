const Product = require('../models/productModel');
const Image = require('../models/productImageModel');
const { deleteProduct } = require("../services/productService")

//Fetch all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            //Join tables
            include:[
                {
                    model: Image,
                    as: 'image',
                    attributes: ['image_url', 'is_primary'],
                }
            ]
        });
        console.log(products);
        res.status(200).json(products);
    } catch (error) {
        console.error('There was an error fetching products', error);
        res.status(500).json({error: 'failed to fetch products'});
    }
}

//Add product to the cart
exports.addProduct = async (req, res) => {
    try {
        //TODO delete extra object fields later
        const { id, name, description, price, image, stock_quantity } = req.body;
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({message: 'product not found'});
        }
    } catch(error) {
        console.error('There was an error fetching products', error);
        res.status(200).json({error: 'failed to fetch products'});
    }
}

/**
 * Creates a product in the database.
 * @param {Object} request Express js request object.
 * @param {Object} response Express js response object.
 */
exports.createProduct = async (request, response) => {

    const {name, description, price} = request.body

    try{

        // Create product
        await Product.create({
            name: name,
            description: description,
            price: price,
        })

        console.log("Product created successfully in database.")
        response.status(200).json({
            message: "Product created successfully in database.",
        })
    } 
    catch (error){
        console.log(`Error in productController.js function createProduct: ${error.message}`)
        response.status(500).json({error: error.message})
    }
}

/**
 * Updates a product in the database.
 * @param {Object} request Express js request object.
 * @param {Object} response Express js response object.
 */
exports.updateProduct = async (request, response) => {

    const {productId, name, description, price} = request.body

    try{

        // Update product
        await Product.update(
            {
                name: name,
                description: description,
                price: price
            },
            {
                where: {
                    id: productId
                }
            }
        )

        console.log("Product updated successfully in database.")
        response.status(200).json({
            message: "Product updated successfully in database.",
        })
    } 
    catch (error){
        console.log(`Error in productController.js function updateProduct: ${error.message}`)
        response.status(500).json({error: error.message})
    }
}

/**
 * Deletes product and all associated product variants and images from database, server
 * and Stripe.
 * @param {Object} request Express js request object.
 * @param {Object} response Express js response object.
 */
exports.deleteProduct = async (request, response) => {

    const {productId} = request.body

    try{

        await deleteProduct(productId)

        console.log("Product deleted successfully in database.")
        response.status(200).json({
            message: "Product deleted successfully in database.",
        })
    } 
    catch (error){
        console.log(`Error in productController.js function deleteProduct: ${error.message}`)
        response.status(500).json({error: error.message})
    }
}
