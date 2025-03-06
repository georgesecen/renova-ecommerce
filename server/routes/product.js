const express = require('express');
const { 
    getAllProducts, 
    addProduct, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    addProductImage
 } = require('../controllers/productController');
const adminAuthentication = require('../middleware/adminMiddleware');
const router = express.Router();

router.get('/', getAllProducts);
router.post('/', addProduct);  // This would require authentication and authorization in a real app

router.post("/create", adminAuthentication, createProduct)
router.post("/update", adminAuthentication, updateProduct)
router.post("/delete", adminAuthentication, deleteProduct)
router.post("/add-image", adminAuthentication, addProductImage)

module.exports = router;