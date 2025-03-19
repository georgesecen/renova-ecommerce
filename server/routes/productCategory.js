const express = require('express');
const { 
    createProductCategory, 
    updateProductCategory,
    deleteProductCategory,
    getAllCategories
 } = require('../controllers/productCategoryController');
const adminAuthentication = require('../middleware/adminMiddleware');
const router = express.Router();

router.post("/create", adminAuthentication, createProductCategory)
router.post("/update", adminAuthentication, updateProductCategory)
router.post("/delete", adminAuthentication, deleteProductCategory)
router.post("/index", adminAuthentication, getAllCategories)
router.get("/all", getAllCategories)

module.exports = router;