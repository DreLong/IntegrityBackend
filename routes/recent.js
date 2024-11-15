// routes/recent.js

const express = require("express");
const router = express.Router();
const { getRecentTransactionsForCurrentUser } = require('../controllers/recentController'); // Correct function
const { getTransactionHistory } = require('../controllers/historyController');
const authMiddleware = require('../middleware/authMiddleware');

// Define routes
router.get("/recent-users",authMiddleware, getRecentTransactionsForCurrentUser);  // Route to get recent users
router.get("/history/:accountNumber", getTransactionHistory);

module.exports = router;
