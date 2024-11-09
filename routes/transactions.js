const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); // Import your middleware
const {
  getUserByAccountNumber,
  sendMoneyToAccount,
  getTransactionHistory,
} = require("../controllers/transactionController");

router.get("/accountNumber/:accountNumber", getUserByAccountNumber);
router.post("/sendMoney", authMiddleware, sendMoneyToAccount); // Ensure authMiddleware is applied here
router.get("/history/:accountNumber", getTransactionHistory);

module.exports = router;
