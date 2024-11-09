// controllers/authController.js
const { User, Account } = require("../models");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    let user = await User.findOne({ where: { phoneNumber } });
    if (user && user.otp === "verified") {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    if (!user) {
      // Create a new user with UUID instead of auto-incrementing ID
      user = await User.create({ 
        phoneNumber,
        uuid: uuidv4() // Assign UUID
      });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiresAt = new Date(
      Date.now() + parseInt(process.env.OTP_EXPIRY_MINUTES) * 60 * 1000
    );
    await user.save();

    console.log(`Generated OTP: ${otp}`); // Remove this in production
    res.json({ message: "OTP sent to console for testing." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while sending OTP" });
  }
};

const verifyOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    const user = await User.findOne({
      where: {
        phoneNumber,
        otp,
        otpExpiresAt: { [Op.gte]: new Date() },
      },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

    const accountNumber = phoneNumber.slice(0, -1); // Example account number logic
    user.accountNumber = accountNumber;
    user.otp = "verified";
    user.otpExpiresAt = null;
    await user.save();

    const token = jwt.sign(
      { uuid: user.uuid, phoneNumber }, // Use UUID in token payload
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ message: "OTP verified, continue registration", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while verifying OTP" });
  }
};

const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const { phoneNumber } = req.user;

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [updatedCount, [user]] = await User.update(
      { firstName, lastName, email, password: hashedPassword },
      { where: { phoneNumber, otp: "verified" }, returning: true }
    );

    if (updatedCount === 0) {
      return res.status(400).json({ message: "User registration failed" });
    }

    const accountNumber = phoneNumber.slice(0, -1); // Adjust this logic as needed

    await Account.create({
      userUuid: user.uuid,
      accountNumber,
      accountTypeId: 1, // Assuming Tier 1 has ID of 1
      balance: 100000.00,
    });

    res.json({ message: "Registration successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred during registration",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  const { phoneNumber, password } = req.body;

  try {
    const user = await User.findOne({ where: { phoneNumber } });

    if (!user) {
      return res.status(404).json({ message: "Phone number does not exist" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { uuid: user.uuid, phoneNumber, accountNumber: user.accountNumber },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred during login" });
  }
};

module.exports = { sendOtp, verifyOtp, register, login };
