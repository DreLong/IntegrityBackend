// routes/user.js
const express = require("express");
const { getUserData, getUserAccountBalance } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware"); // Assuming you have middleware to authenticate users

const router = express.Router();

// Protect the routes with authentication middleware
router.get("/data", authMiddleware, getUserData); // Route to get user data
router.get("/account/balance", authMiddleware, getUserAccountBalance); // Route to get account balance

module.exports = router;
