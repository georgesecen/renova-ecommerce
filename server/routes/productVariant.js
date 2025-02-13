const express = require('express');
const { createProductVariant, updateProductVariant, deleteProductVariant } = require('../controllers/productVariantController');
const router = express.Router();

// TODO: Make routes admin only routes
router.post("/create-product-variant", createProductVariant)
router.post("/update-product-variant", updateProductVariant)
router.post("/delete-product-variant", deleteProductVariant)

module.exports = router;