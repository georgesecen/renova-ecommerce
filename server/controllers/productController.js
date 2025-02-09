const Product = require('../models/productModel');
const Image = require('../models/productImageModel');

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

