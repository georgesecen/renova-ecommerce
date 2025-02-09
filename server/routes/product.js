const express = require('express');
const { getAllProducts, addProduct, createProduct, updateProduct } = require('../controllers/productController');
const router = express.Router();

router.get('/', getAllProducts);
router.post('/', addProduct);  // This would require authentication and authorization in a real app

// TODO: Make routes admin only routes
router.post("/create-product", createProduct)
router.post("/update-product", updateProduct)

module.exports = router;