const express = require('express');
<<<<<<< HEAD
const { createProductVariant, updateProductVariant, deleteProductVariant, getProductVariants } = require('../controllers/productVariantController');
const router = express.Router();

// TODO: Make routes admin only routes
router.post("/create-product-variant", createProductVariant)
router.post("/update-product-variant", updateProductVariant)
router.post("/delete-product-variant", deleteProductVariant)
router.get('/products/:id', getProductVariants)
=======
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
const limitStripe = require('../middleware/stripeLimitMiddleware');
const router = express.Router();

// Multer is middleware used for handling multipart/form-data
// https://expressjs.com/en/resources/middleware/multer.html
const multer = require('multer');

// Storage is set so image sent to server is stored in memory
const imageMiddleware = multer({storage: multer.memoryStorage()});

router.post("/create", [adminAuthentication, limitStripe], createProductVariant)
router.post("/update-quantity", adminAuthentication, updateProductVariantQuantity)
router.post("/delete", [adminAuthentication, limitStripe], deleteProductVariant)
router.post("/delete-group", [adminAuthentication, limitStripe], deleteProductVariantGroup)
router.post("/update-group-price", [adminAuthentication, limitStripe], updateProductVariantGroupPrice)

// image is the field name that Multer expects to find in the multipart/form-data request
router.post("/add-group-image", [imageMiddleware.single("image"), adminAuthentication, limitStripe], addProductVariantGroupImage)
router.post("/remove-group-image", [adminAuthentication, limitStripe], removeProductVariantGroupImage)
>>>>>>> development

module.exports = router;