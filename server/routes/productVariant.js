const express = require('express');

const { 
    createProductVariant, 
    updateProductVariantQuantity, 
    deleteProductVariant,
    deleteProductVariantGroup,
    updateProductVariantGroupPrice,
    addProductVariantGroupImage,
    removeProductVariantGroupImage,
    getProductVariants
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
router.get('/products/:id', getProductVariants)


// image is the field name that Multer expects to find in the multipart/form-data request
router.post("/add-group-image", [imageMiddleware.single("image"), adminAuthentication, limitStripe], addProductVariantGroupImage)
router.post("/remove-group-image", [adminAuthentication, limitStripe], removeProductVariantGroupImage)

module.exports = router;