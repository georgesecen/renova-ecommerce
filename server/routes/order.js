const express = require('express');
const { placeOrder, getUserOrders, updateOrderStatus, getOrders, refundOrder } = require('../controllers/orderController');
const adminAuthentication = require('../middleware/adminMiddleware');
const limitStripe = require('../middleware/stripeLimitMiddleware');
const router = express.Router();

router.post('/', placeOrder);
router.get('/:userId', getUserOrders);

// TODO: Make route admin only, and fix route names
router.post("/update-order-status", updateOrderStatus)
router.post("/get-orders", adminAuthentication, getOrders)
router.post("/refund", [adminAuthentication, limitStripe], refundOrder)

module.exports = router;