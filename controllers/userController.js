// controllers/userController.js
const { User, Account } = require("../models");

const getUserData = async (req, res) => {
    const uuid = req.user?.uuid;

    if (!uuid) {
        return res.status(401).json({ message: "Unauthorized. User is not logged in." });
    }

    try {
        const user = await User.findOne({ where: { uuid } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { password, otp, otpExpiresAt, ...userData } = user.dataValues;
        res.json(userData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching user data" });
    }
};

const getUserAccountBalance = async (req, res) => {
    const uuid = req.user?.uuid;

    if (!uuid) {
        return res.status(401).json({ message: "Unauthorized. User is not logged in." });
    }

    try {
        const account = await Account.findOne({ where: { userUuid: uuid } });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        console.log(`Account UUID: ${uuid}, Balance: ${account.balance}`);
        res.json({ balance: account.balance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching account balance" });
    }
};

module.exports = { getUserData, getUserAccountBalance };
