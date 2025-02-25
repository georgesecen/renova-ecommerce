const express = require('express');
const { placeOrder, getUserOrders, updateOrderStatus, getOrders } = require('../controllers/orderController');
const router = express.Router();

router.post('/', placeOrder);
router.get('/:userId', getUserOrders);

// TODO: Make route admin only
router.post("/update-order-status", updateOrderStatus)
router.post("/get-orders", getOrders)

module.exports = router;