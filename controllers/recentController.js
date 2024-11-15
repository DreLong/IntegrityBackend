// controllers/recentController.js

const { RecentTransaction } = require('../models');

// Get Recent Transactions for the current user (based on senderUuid)
const getRecentTransactionsForCurrentUser = async (req, res) => {
  const currentUserUuid = req.user.uuid;

  try {
    const recentTransactions = await RecentTransaction.findAll({
      where: {
        senderUuid: currentUserUuid, // Filter by senderUuid (the current user's UUID)
      },
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

module.exports = { getRecentTransactionsForCurrentUser };
