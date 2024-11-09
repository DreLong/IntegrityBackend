// routes/auth.js
const express = require('express');
const { sendOtp, verifyOtp, register, login } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register', authMiddleware, register);
router.post('/login', login);

module.exports = router;
