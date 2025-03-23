const express = require('express');
const { placeOrder, getUserOrders, updateOrderStatus, getOrders, refundOrder } = require('../controllers/orderController');
const adminAuthentication = require('../middleware/adminMiddleware');
const limitStripe = require('../middleware/stripeLimitMiddleware');
const router = express.Router();

router.post('/', placeOrder);
router.get('/:userId', getUserOrders);

router.post("/update", adminAuthentication, updateOrderStatus)
router.post("/index", adminAuthentication, getOrders)
router.post("/refund", [adminAuthentication, limitStripe], refundOrder)

module.exports = router;