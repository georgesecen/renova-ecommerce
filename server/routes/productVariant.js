const express = require('express');
const { 
    createProductVariant, 
    updateProductVariantQuantity, 
    deleteProductVariant,
    deleteProductVariantGroup,
    updateProductVariantGroupPrice,
    addProductVariantGroupImage,
    removeProductVariantGroupImage
 } = require('../controllers/productVariantController');
const adminAuthentication = require('../middleware/adminMiddleware');
const router = express.Router();

// Multer is middleware used for handling multipart/form-data
// https://expressjs.com/en/resources/middleware/multer.html
const multer = require('multer');

// Storage is set so image sent to server is stored in memory
const imageMiddleware = multer({storage: multer.memoryStorage()});

router.post("/create", adminAuthentication, createProductVariant)
router.post("/update-quantity", adminAuthentication, updateProductVariantQuantity)
router.post("/delete", adminAuthentication, deleteProductVariant)
router.post("/delete-group", adminAuthentication, deleteProductVariantGroup)
router.post("/update-group-price", adminAuthentication, updateProductVariantGroupPrice)
router.post("/add-group-image", [imageMiddleware.single("image"), adminAuthentication], addProductVariantGroupImage)
router.post("/remove-group-image", adminAuthentication, removeProductVariantGroupImage)

module.exports = router;