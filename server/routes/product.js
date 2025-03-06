const express = require('express');
const { getAllProducts, addProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const router = express.Router();

router.get('/', getAllProducts);
router.post('/', addProduct);  // This would require authentication and authorization in a real app

// TODO: Make routes admin only routes
router.post("/create", createProduct)
router.post("/update", updateProduct)
router.post("/delete", deleteProduct)

module.exports = router;