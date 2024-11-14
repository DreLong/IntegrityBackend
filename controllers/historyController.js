// controllers/historyController.js

const { Transaction } = require('../models'); // Adjust path to your models

// Get Transaction History
const getTransactionHistory = async (req, res) => {
  try {
    // Fetch all transactions, ordered by timestamp
    const transactions = await Transaction.findAll({
      order: [["timestamp", "DESC"]],
    });

    if (!transactions.length) {
      return res.status(404).json({ message: "No transactions found" });
    }

    const formattedTransactions = transactions.map(transaction => {
      const isSender = transaction.senderAccountUuid === transaction.accountUuid;
      const transactionDetails = {
        transactionNumber: transaction.transactionNumber,
        amount: transaction.amount,
        transactionType: transaction.transactionType,
        description: transaction.description,
        sender: `${transaction.senderFirstName} ${transaction.senderLastName}`,
        receiver: `${transaction.receiverFirstName} ${transaction.receiverLastName}`,
        timestamp: transaction.timestamp,
      };

      // Add extra details for the receiver side as well
      if (!isSender) {
        transactionDetails.receiverAmount = transaction.amount; // Amount received
        transactionDetails.senderAmount = -transaction.amount; // Amount sent
      }

      return transactionDetails;
    });

    res.json({ transactions: formattedTransactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while retrieving transactions" });
  }
};

module.exports = { getTransactionHistory };
