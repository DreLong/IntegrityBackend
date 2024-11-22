// routes/user.js
const express = require("express");
const { getUserData, getUserAccountBalance } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/data", authMiddleware, getUserData); // Only logged-in users can access
router.get("/account/balance", authMiddleware, getUserAccountBalance); // Only logged-in users can access

module.exports = router;
