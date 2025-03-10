const Product = require('../models/productModel');
const Image = require('../models/productImageModel');
const { deleteProduct, downloadImage, deleteImages } = require("../services/productService");
const ProductVariant = require('../models/productVariantModel');
const ProductImage = require('../models/productImageModel');

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
 * @param {object} request Express js request object.
 * @param {object} response Express js response object.
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
 * @param {object} request Express js request object.
 * @param {object} response Express js response object.
 */
exports.updateProduct = async (request, response) => {

    const {productId, description, price} = request.body

    try{

        // Update product
        await Product.update(
            {
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
 * @param {object} request Express js request object.
 * @param {object} response Express js response object.
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

/**
 * Adds image to product in database and on the server itself.
 * @param {object} request Express js request object.
 * @param {object} response Express js response object.
 */
exports.addProductImage = async (request, response) => {

    const {productId} = request.body
    const {originalname, buffer} = request.file

    try{

        // Download image to server and get file name
        const fileName = await downloadImage(originalname, buffer)

        // Add image to database
        await Image.create({
            product_id: productId,
            image_url: fileName
        })

        console.log("Product image added successfully in database and on server.")
        response.status(200).json({
            message: "Product image added successfully in database and on server.",
        })
    } 
    catch (error){
        console.log(`Error in productController.js function addProductImage: ${error.message}`)
        response.status(500).json({error: error.message})
    }
}

/**
 * Removes product image from database and server itself.
 * @param {object} request Express js request object.
 * @param {object} response Express js response object.
 */
exports.removeProductImage = async (request, response) => {

    const {fileName} = request.body

    try{

        // Remove image file from server
        await deleteImages([fileName])

        // Remove image from database
        await Image.destroy({
            where: {
                image_url: fileName
            }
        })

        console.log("Product image removed successfully in database and on server.")
        response.status(200).json({
            message: "Product image removed successfully in database and on server.",
        })
    } 
    catch (error){
        console.log(`Error in productController.js function removeProductImage: ${error.message}`)
        response.status(500).json({error: error.message})
    }
}


// TODO: Change name of function
/**
 * Get all products. Every product will also have all product variants included and their images. As well
 * as the product images.
 * @param {object} request Express js request object.
 * @param {object} response Express js response object.
 */
exports.getAllProductsV2 = async (request, response) => {

    try{

        const products = await Product.findAll({
            // Join tables
            include: [
                {
                    model: ProductVariant,
                    as: "product_variants",
                    include: [
                        {
                            model: ProductImage,
                            as: "images"
                        }
                    ]
                },

                // Get images which only belong to the product itself no product variants
                {
                    model: ProductImage,

                    // TODO: Change relationship name from image singular to images plural (Makes more sense)
                    as: "image",
                    required: false,
                    where: {
                        product_variant_id: null
                    }
                }
            ],
        })

        console.log("Products queried successfully in database.")
        response.status(200).json({
            message: "Products queried successfully in database.",
            data: products
        })
    } 
    catch (error){
        console.log(`Error in productController.js function getAllProductsV2: ${error.message}`)
        response.status(500).json({error: error.message})
    }
}

