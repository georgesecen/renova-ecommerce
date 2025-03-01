const OrderItem = require('../models/orderItemModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ProductVariantModel = require('../models/productVariantModel');
const ShippingAddress = require('../models/ShippingAddressModel');

exports.placeOrder = (req, res) => {
    const { userId, products } = req.body;
    const totalAmount = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);

    Order.create(userId, totalAmount, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error placing order' });
        }

        const orderId = result.insertId;
        // Insert order items (use a separate table for this)
        res.status(201).json({ message: 'Order placed successfully', orderId });
    });
};

exports.getUserOrders = (req, res) => {
    const { userId } = req.params;

    Order.getByUserId(userId, (err, orders) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching orders' });
        }
        res.json(orders);
    });
};

/**
 * Updates an orders status in the database.
 * @param {Object} request Express js request object.
 * @param {Object} response Express js response object.
 */
exports.updateOrderStatus = async (request, response) => {

    const {id, status} = request.body
    console.log(request.body)

    try{

        // Get order
        const order = await Order.findByPk(id)

        // If order does not exist
        if (order == null){
            throw new Error(`Order with ID ${id} does not exist in database.`)
        }
        
        // If status is not a valid option
        if (!new Set(["pending", "completed", "canceled", "shipped"]).has(status)){
            throw new Error(`Status ${status} is not a valid option. Status must be pending, completed, canceled, or shipped.`)
        }

        // Update order
        await order.update({
            status: status
        })

        console.log("Order updated successfully in database.")
        response.status(200).json({
            message: "Order updated successfully in database.",
        })
    } 
    catch (error){
        console.log(`Error in orderController.js function updateOrderStatus: ${error.message}`)
        response.status(500).json({error: error.message})
    }
}

/**
 * Gets all orders from the database.
 * @param {Object} request Express js request object.
 * @param {Object} response Express js response object.
 */
exports.getOrders = async (request, response) => {

    try{

        const orders = await Order.findAll({
            // Join tables
            include: [
                {
                    model: ShippingAddress,
                    as: "shipping_address"
                },
                {
                    model: OrderItem,
                    as: "order_items",
                    include: [
                        {
                            model: ProductVariantModel,
                            as: "product_variant",
                            include: [
                                {
                                    model: Product,
                                    as: "product"
                                }
                            ]
                        }
                    ]
                }
            ]
        })

        console.log("Orders queried successfully in database.")
        response.status(200).json({
            message: "Order queried successfully in database.",
            data: orders
        })
    } 
    catch (error){
        console.log(`Error in orderController.js function getOrders: ${error.message}`)
        response.status(500).json({error: error.message})
    }
}