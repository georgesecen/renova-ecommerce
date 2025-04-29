const express = require('express');
const { getAllOrderItems, addOrderItem } = require('../controllers/orderItemController');
const router = express.Router();

router.post('/', addOrderItem);
router.get('/', getAllOrderItems);

module.exports = router;