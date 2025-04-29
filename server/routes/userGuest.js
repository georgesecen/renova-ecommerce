const express = require('express');
const { createUserGuest, getGuestUser } = require('../controllers/userGuestController');
const router = express.Router();

router.post('/register', createUserGuest);
router.get('/guest/:guestUserId', getGuestUser);

module.exports = router;