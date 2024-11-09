// controllers/userController.js
const { User, Account } = require("../models");

const getUserData = async (req, res) => {
    const uuid = req.user?.uuid; // Ensure uuid is available in the request
  
    if (!uuid) {
      return res.status(400).json({ message: "Invalid user, UUID not found" });
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
    try {
        const uuid = req.user?.uuid; // Safe access to avoid undefined errors

        if (!uuid) {
            return res.status(400).json({ message: "Invalid user, UUID not found" });
        }

        const account = await Account.findOne({ where: { userUuid: uuid } });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        // Log the account balance to the console
        console.log(`Account UUID: ${uuid}, Balance: ${account.balance}`);

        res.json({ balance: account.balance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching account balance" });
    }
};


module.exports = { getUserData, getUserAccountBalance };
