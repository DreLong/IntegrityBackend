const { sequelize } = require("../models"); // Import sequelize instance
const { User, Account, Transaction, RecentTransaction } = require("../models");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

// New function to get user data by account number (UUID)
const getUserByAccountNumber = async (req, res) => {
  const { accountNumber } = req.params;

  try {
    // Find the account by account number
    const account = await Account.findOne({
      where: { accountNumber },
      include: [
        { model: User, as: "user", attributes: ["firstName", "lastName"] },
      ],
    });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const { firstName, lastName } = account.user;
    res.json({ firstName, lastName });
  } catch (error) {
    console.error(error);
  }
};

// Helper function to generate a unique 24-digit transaction number
function generateTransactionNumber() {
  const timestamp = Date.now();
  let transactionNumber = timestamp.toString();

  // Add random digits to make it exactly 24 digits long
  while (transactionNumber.length < 24) {
    transactionNumber += Math.floor(Math.random() * 10);
  }

  return transactionNumber;
}

const sendMoneyToAccount = async (req, res) => {
  const { accountNumber, amount } = req.body;
  const userUuid = req.user.uuid; // Get the current user's UUID

  const transaction = await sequelize.transaction();

  try {
    if (amount <= 0) {
      return res
        .status(400)
        .json({ message: "Amount must be greater than zero" });
    }

    // Find the sender account by userUuid
    const senderAccount = await Account.findOne({
      where: { userUuid },
      include: [
        { model: User, as: "user", attributes: ["firstName", "lastName", "uuid"] }, // Make sure user UUID is included
      ],
    });

    if (!senderAccount) {
      return res.status(404).json({ message: "Sender account not found" });
    }

    // Find the receiver account by account number
    const receiverAccount = await Account.findOne({
      where: { accountNumber },
      include: [
        { model: User, as: "user", attributes: ["firstName", "lastName"] },
      ],
    });

    if (!receiverAccount) {
      return res.status(404).json({ message: "Receiver account not found" });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const senderCurrentBalance = parseFloat(senderAccount.balance);
    if (parsedAmount > senderCurrentBalance) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Update sender and receiver balances within transaction
    senderAccount.balance = senderCurrentBalance - parsedAmount;
    await senderAccount.save({ transaction });

    const receiverCurrentBalance = parseFloat(receiverAccount.balance);
    receiverAccount.balance = receiverCurrentBalance + parsedAmount;
    await receiverAccount.save({ transaction });

    // Generate a 24-digit transaction number
    const SendertransactionNo = generateTransactionNumber();
    const ReceivertransactionNo = generateTransactionNumber();

    // Creating transaction entries for sender and receiver
    await Transaction.create({
      uuid: uuidv4(),
      accountUuid: senderAccount.uuid,
      senderAccountUuid: senderAccount.uuid,
      receiverAccountUuid: receiverAccount.uuid,
      amount: -parsedAmount,
      transactionType: "debit",
      description: "Money sent to another account",
      senderFirstName: senderAccount.user.firstName,
      senderLastName: senderAccount.user.lastName,
      receiverFirstName: receiverAccount.user.firstName,
      receiverLastName: receiverAccount.user.lastName,
      transactionNumber: SendertransactionNo,
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await Transaction.create({
      uuid: uuidv4(),
      accountUuid: receiverAccount.uuid,
      senderAccountUuid: senderAccount.uuid,
      receiverAccountUuid: receiverAccount.uuid,
      amount: parsedAmount,
      transactionType: "credit",
      description: "Money received from another account",
      senderFirstName: senderAccount.user.firstName,
      senderLastName: senderAccount.user.lastName,
      receiverFirstName: receiverAccount.user.firstName,
      receiverLastName: receiverAccount.user.lastName,
      transactionNumber: ReceivertransactionNo,
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Save to RecentTransaction table with senderUuid
    await RecentTransaction.create(
      {
        accountNumber: receiverAccount.accountNumber,
        firstName: receiverAccount.user.firstName,
        lastName: receiverAccount.user.lastName,
        transactionDate: new Date(),
        senderUuid: senderAccount.user.uuid,
      },
      { transaction }
    );

    await transaction.commit();

    const updatedSenderAccount = await Account.findOne({
      where: { accountNumber: senderAccount.accountNumber },
    });
    const updatedReceiverAccount = await Account.findOne({
      where: { accountNumber },
    });

    res.json({
      message: "Money transferred successfully",
      senderNewBalance: updatedSenderAccount.balance,
      receiverNewBalance: updatedReceiverAccount.balance,
      SendertransactionNo,
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    res.status(500).json({ message: "An error occurred while sending money" });
  }
};

module.exports = { getUserByAccountNumber, sendMoneyToAccount };
