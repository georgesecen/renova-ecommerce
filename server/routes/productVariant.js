const express = require('express');
const { 
    createProductVariant, 
    updateProductVariant, 
    deleteProductVariant,
    deleteProductVariantGroup,
    updateProductVariantGroupPrice
 } = require('../controllers/productVariantController');
const adminAuthentication = require('../middleware/adminMiddleware');
const router = express.Router();

router.post("/create", adminAuthentication, createProductVariant)
router.post("/update", adminAuthentication, updateProductVariant)
router.post("/delete", adminAuthentication, deleteProductVariant)
router.post("/delete-group", adminAuthentication, deleteProductVariantGroup)
router.post("/update-group-price", adminAuthentication, updateProductVariantGroupPrice)

module.exports = router;