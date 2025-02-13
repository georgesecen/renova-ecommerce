const express = require('express');
const { getAllCartItems, getCartItem, addCartItem, removeCartItem } = require('../controllers/cartController');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');

router.post('/', authenticateJWT, addCartItem);
router.get('/', authenticateJWT, getAllCartItems);
router.get('/:cart_item_id', authenticateJWT, getCartItem)
router.delete(`/:cart_item_id`, authenticateJWT, removeCartItem);

module.exports = router;