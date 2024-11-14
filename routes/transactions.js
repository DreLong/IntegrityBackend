const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); // Import your middleware
const {
  getUserByAccountNumber,
  sendMoneyToAccount,
} = require("../controllers/transactionController");

const { getRecentUsers } = require('../controllers/recentController');
const { getTransactionHistory } = require('../controllers/historyController');

// Define routes
router.get("/recent-users", getRecentUsers);  // Route to get recent users
router.get("/accountNumber/:accountNumber", getUserByAccountNumber);
router.post("/sendMoney", authMiddleware, sendMoneyToAccount); // Ensure authMiddleware is applied here
router.get("/history/:accountNumber", getTransactionHistory);

module.exports = router;
