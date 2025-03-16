const express = require('express');
const { createProductCategory } = require('../controllers/productCategoryController');
const adminAuthentication = require('../middleware/adminMiddleware');
const router = express.Router();

router.post("/create", adminAuthentication, createProductCategory)

module.exports = router;