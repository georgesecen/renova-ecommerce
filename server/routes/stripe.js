const express = require('express');
const router = express.Router();
const {createProductAndPrice, 
    updateProductAndPrice, 
    archiveProductAndPrice, 
    getProductAndPrice, 
    createCheckoutSession, 
    getCheckoutSessionStatus} = require("../controllers/stripeController")
const {webhook} = require("../webhooks/stripeWebhook")

router.post("/create-product-and-price", createProductAndPrice);  
router.post("/update-product-and-price", updateProductAndPrice);  
router.post("/archive-product-and-price", archiveProductAndPrice);  
router.post("/get-product-and-price", getProductAndPrice);  
router.post("/create-checkout-session", createCheckoutSession);  
router.get("/session-status", getCheckoutSessionStatus);  

// Must be raw body for webhook verification
router.post("/webhook", express.raw({type: 'application/json'}), webhook) 

module.exports = router;