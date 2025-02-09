const express = require('express');
const { getAllProducts, addProduct, createProduct } = require('../controllers/productController');
const router = express.Router();

router.get('/', getAllProducts);
router.post('/', addProduct);  // This would require authentication and authorization in a real app

router.post("/create-product", createProduct)

module.exports = router;