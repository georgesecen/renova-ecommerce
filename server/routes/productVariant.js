const express = require('express');
const { createProductVariant, updateProductVariant } = require('../controllers/productVariantController');
const router = express.Router();

// TODO: Make routes admin only routes
router.post("/create-product-variant", createProductVariant)
router.post("/update-product-variant", updateProductVariant)

module.exports = router;