const express = require('express');
const { createImage, deleteImage } = require('../controllers/productImageController');
const router = express.Router();

// Multer is middleware used for handling multipart/form-data
// https://expressjs.com/en/resources/middleware/multer.html
const multer = require('multer');

// Storage is set so image sent to server is stored in memory
const imageMiddleware = multer({storage: multer.memoryStorage()});

// TODO: Make routes admin only
router.post('/create-image', imageMiddleware.single("image"), createImage);
router.post('/delete-image', deleteImage);

module.exports = router;