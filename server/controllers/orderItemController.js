const OrderItem = require('../models/orderItemModel');

exports.getAllOrderItems = (req, res) => {
    OrderItem.getAll((err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching order items' });
        }
        res.json(results);
    });
};

exports.addOrderItem = (req, res) => {
    const { id, orderId, quantity, price_at_purchase, created_at } = req.body;

    OrderItem.create(id, orderId, quantity, price_at_purchase, created_at, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error adding order item' });
        }
        res.status(201).json({ message: 'Order item added successfully', productId: result.insertId });
    });
};