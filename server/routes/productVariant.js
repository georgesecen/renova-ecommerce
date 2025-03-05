const express = require('express');
const { 
    createProductVariant, 
    updateProductVariant, 
    deleteProductVariant,
    deleteProductVariantGroup
 } = require('../controllers/productVariantController');
const adminAuthentication = require('../middleware/adminMiddleware');
const router = express.Router();

router.post("/create", adminAuthentication, createProductVariant)
router.post("/update", adminAuthentication, updateProductVariant)
router.post("/delete", adminAuthentication, deleteProductVariant)
router.post("/delete-group", adminAuthentication, deleteProductVariantGroup)

module.exports = router;