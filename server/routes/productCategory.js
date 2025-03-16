const express = require('express');
const { 
    createProductCategory, 
    updateProductCategory,
    deleteProductCategory
 } = require('../controllers/productCategoryController');
const adminAuthentication = require('../middleware/adminMiddleware');
const router = express.Router();

router.post("/create", adminAuthentication, createProductCategory)
router.post("/update", adminAuthentication, updateProductCategory)
router.post("/delete", adminAuthentication, deleteProductCategory)

module.exports = router;