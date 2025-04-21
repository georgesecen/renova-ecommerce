const OrderItem = require('../models/orderItemModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ProductVariantModel = require('../models/productVariantModel');
const ShippingAddress = require('../models/ShippingAddressModel');
const { refundOrder } = require("../services/orderIntegrationService")

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
 * Gets all relevant order details to display to user in user dashboard. Such as total amount and all
 * items included in the orders.
 * @param {object} request Express js request object.
 * @param {object} response Express js response object.
 */
exports.getUserOrdersV2 = async (request, response) => {

    // TODO: Make function validate that user accessing function is only able to fetch orders which
    // they have made. Otherwise its possible that malicious users can see other users orders.

    const { userId } = request.params

    try{

        const orders = await Order.findAll({
            where: {
                user_id: userId
            },
            attributes: ["id", "total_price", "status", "updated_at"],

            // Join tables
            include: [
                {
                    model: OrderItem,
                    as: "order_items",
                    attributes: ["quantity"],
                    include: [
                        {
                            model: ProductVariantModel,
                            as: "product_variant",
                            attributes: ["color", "size"],

                            // To get soft deleted records as its possible product variants have been deleted
                            // via admin dashboard
                            paranoid: false, 
                            include: [
                                {
                                    model: Product,
                                    as: "product",
                                    attributes: ["name", "gender"],

                                    // To get soft deleted records as its possible products have been deleted
                                    // via admin dashboard
                                    paranoid: false,
                                }
                            ]
                        }
                    ]
                }
            ]
        })

        console.log("Orders queried successfully in database.")
        response.status(200).json({
            message: "Orders queried successfully in database.",
            data: orders
        })
    } 
    catch (error){
        console.log(`Error in orderController.js function getUserOrdersV2: ${error.message}`)
        response.status(500).json({error: error.message})
    }
}

/**
 * Updates an orders status in the database.
 * @param {object} request Express js request object.
 * @param {object} response Express js response object.
 */
exports.updateOrderStatus = async (request, response) => {

    const {orderId, status} = request.body

    try{

        // Get order
        const order = await Order.findByPk(orderId)

        // If order does not exist
        if (order == null){
            throw new Error(`Order with ID ${orderId} does not exist in database.`)
        }
        
        // If status is not a valid option
        if (!new Set(["pending", "completed", "cancelled", "shipped"]).has(status)){
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
 * @param {object} request Express js request object.
 * @param {object} response Express js response object.
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

                            // To get soft deleted records as its possible product variants have been deleted
                            // via admin dashboard
                            paranoid: false, 
                            include: [
                                {
                                    model: Product,
                                    as: "product",

                                    // To get soft deleted records as its possible products have been deleted
                                    // via admin dashboard
                                    paranoid: false,
                                }
                            ]
                        }
                    ]
                }
            ]
        })

        console.log("Orders queried successfully in database.")
        response.status(200).json({
            message: "Orders queried successfully in database.",
            data: orders
        })
    } 
    catch (error){
        console.log(`Error in orderController.js function getOrders: ${error.message}`)
        response.status(500).json({error: error.message})
    }
}

/**
 * Refunds order on Stripe.
 * @param {object} request Express js request object.
 * @param {object} response Express js response object.
 */
exports.refundOrder = async (request, response) => {

    const {orderId} = request.body

    try{

        await refundOrder(orderId)
        
        console.log("Order refunded successfully on Stripe.")
        response.status(200).json({
            message: "Order refunded successfully on Stripe.",
        })
    } 
    catch (error){
        console.log(`Error in orderController.js function refundOrder: ${error.message}`)
        response.status(500).json({error: error.message})
    }

    // Allow new operations to proceed
    global.stripeOperationInProgress = false
}