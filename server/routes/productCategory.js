const express = require('express');
const { createProductCategory, updateProductCategory } = require('../controllers/productCategoryController');
const adminAuthentication = require('../middleware/adminMiddleware');
const router = express.Router();

router.post("/create", adminAuthentication, createProductCategory)
router.post("/update", adminAuthentication, updateProductCategory)

module.exports = router;