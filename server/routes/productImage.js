const express = require('express');
const { createImage } = require('../controllers/productImageController');
const router = express.Router();

router.post('/create-image', createImage);

module.exports = router;