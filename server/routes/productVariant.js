const express = require('express');
const { createProductVariant } = require('../controllers/productVariantController');
const router = express.Router();

// TODO: Make routes admin only routes
router.post("/create-product-variant", createProductVariant)

module.exports = router;