const express = require('express');
const router = express.Router();
const {test} = require("../controllers/adminController")

router.post("/test", test);

module.exports = router;