const express = require('express');
const { 
    getAllProducts, 
    addProduct, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    addProductImage,
    removeProductImage,
    getAllProductsV2,
    getProductInfo
 } = require('../controllers/productController');
const adminAuthentication = require('../middleware/adminMiddleware');
const limitStripe = require('../middleware/stripeLimitMiddleware');
const router = express.Router();

// Multer is middleware used for handling multipart/form-data
// https://expressjs.com/en/resources/middleware/multer.html
const multer = require('multer');

// Storage is set so image sent to server is stored in memory
const imageMiddleware = multer({storage: multer.memoryStorage()});

router.get('/', getAllProducts);
router.post('/', addProduct);  // This would require authentication and authorization in a real app

router.post("/create", adminAuthentication, createProduct)
router.post("/update", [adminAuthentication, limitStripe], updateProduct)
router.post("/delete", [adminAuthentication, limitStripe], deleteProduct)

// image is the field name that Multer expects to find in the multipart/form-data request
router.post("/add-image", [imageMiddleware.single("image"), adminAuthentication], addProductImage)
router.post("/remove-image", adminAuthentication, removeProductImage)
router.post("/index", adminAuthentication, getAllProductsV2)
router.get("/all", getAllProductsV2)

router.get('/get-product/:id', getProductInfo)

module.exports = router;