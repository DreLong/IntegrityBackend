// controllers/recentController.js

const { RecentTransaction } = require('../models'); // Adjust path to your models

// Get Recent Users
const getRecentUsers = async (req, res) => {
  try {
    const recentTransactions = await RecentTransaction.findAll({
      order: [["transactionDate", "DESC"]],
      limit: 10, // You can adjust the limit as needed
    });

    if (!recentTransactions.length) {
      return res.status(404).json({ message: "No recent transactions found" });
    }

    const formattedRecentTransactions = recentTransactions.map(transaction => ({
      accountNumber: transaction.accountNumber,
      firstName: transaction.firstName,
      lastName: transaction.lastName,
      transactionDate: transaction.transactionDate,
    }));

    res.json({ recentTransactions: formattedRecentTransactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while retrieving recent transactions" });
  }
};

module.exports = { getRecentUsers };
