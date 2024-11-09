// controllers/userController.js
const User = require("../models/User");
const Account = require("../models/Account");

const getUserData = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return user data excluding sensitive information
        const { password, otp, otpExpiresAt, ...userData } = user.dataValues;
        res.json(userData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching user data" });
    }
};

const getUserAccountBalance = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming the user ID is available in the request
        const account = await Account.findOne({ where: { userId } });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        // Log the account balance to the console
        console.log(`User ID: ${userId}, Balance: ${account.balance}`);

        res.json({ balance: account.balance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching account balance" });
    }
};

module.exports = { getUserData, getUserAccountBalance };
