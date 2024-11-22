const { User, Account } = require("../models");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { sendMail } = require("../utils/transporter");
// Utility function to send OTP


const sendOtpToDestination = async (destination, type, otp) => {
  if (type === "email") {
    try {
      const mailOptions = {
        to: destination,
        subject: "Your OTP Code",
        text: `Your OTP is ${otp}. It expires in ${process.env.OTP_EXPIRY_MINUTES} minutes.`,
        html: `<p>Your OTP is <strong>${otp}</strong>. It expires in ${process.env.OTP_EXPIRY_MINUTES} minutes.</p>`,
      };

      await sendMail(mailOptions);
      console.log(`OTP sent to email: ${destination}`);
    } catch (error) {
      console.error("Error sending OTP email:", error.message);
    }
  } else if (type === "phone") {
    console.log(`Sending SMS OTP to ${destination}: ${otp}`);
    // Handle SMS sending logic here
  }
};



// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Generate and sign a token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Middleware to verify the token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Send OTP for email verification
const sendEmailOtp = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ where: { email } });
    if (user && user.otp === "verified") {
      return res.status(400).json({ message: "Email already verified" });
    }

    if (!user) {
      user = await User.create({ email, uuid: uuidv4() });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiresAt = new Date(
      Date.now() + parseInt(process.env.OTP_EXPIRY_MINUTES) * 60 * 1000
    );
    await user.save();

    const token = generateToken({ uuid: user.uuid,  email: user.email, phoneNumber: user.phoneNumber });

    await sendOtpToDestination(email, "email", otp);
    res.json({
      message: "OTP sent to email for verification.",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while sending OTP" });
  }
};

// Verify email OTP
const verifyEmailOtp = async (req, res) => {
  const { token, otp } = req.body;

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  try {
    const user = await User.findOne({
      where: {
        uuid: decoded.uuid,
        otp,
        otpExpiresAt: { [Op.gte]: new Date() },
      },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

    user.otp = "verified";
    user.otpExpiresAt = null;
    await user.save();

    res.json({ message: "Email verified. Proceed to phone number verification.", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while verifying OTP" });
  }
};

// Send OTP for phone number verification
// Send OTP for phone number verification
const sendPhoneOtp = async (req, res) => {
  const { token, phoneNumber } = req.body;

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  try {
    const user = await User.findOne({ where: { uuid: decoded.uuid, otp: "verified" } });

    if (!user) {
      return res.status(400).json({ message: "Email not verified or not found" });
    }

    user.phoneNumber = phoneNumber;

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiresAt = new Date(
      Date.now() + parseInt(process.env.OTP_EXPIRY_MINUTES) * 60 * 1000
    );
    await user.save();

    // Send OTP to phone
    await sendOtpToDestination(phoneNumber, "phone", otp);

    // Send OTP to email as a backup
    if (user.email) {
      await sendOtpToDestination(user.email, "email", otp);
      console.log(`Backup OTP sent to email: ${user.email}`);
    }

    res.json({ message: "OTP sent to phone number and email for verification.", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while sending OTP" });
  }
};


// Verify phone OTP
const verifyPhoneOtp = async (req, res) => {
  const { token, otp } = req.body;

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  try {
    const user = await User.findOne({
      where: {
        uuid: decoded.uuid,
        otp,
        otpExpiresAt: { [Op.gte]: new Date() },
      },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

    const accountNumber = user.phoneNumber.slice(0, -1);
    user.accountNumber = accountNumber;
    user.otp = "verified";
    user.otpExpiresAt = null;
    await user.save();

    res.json({ message: "Phone verified. Proceed to complete profile.", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while verifying OTP" });
  }
};

const register = async (req, res) => {
  const { token, firstName, lastName, password } = req.body;

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ status: "error", message: "Invalid or expired token" });
  }

  try {
    // Find user by UUID and verified OTP
    const user = await User.findOne({ where: { uuid: decoded.uuid, otp: "verified" } });

    if (!user) {
      return res.status(400).json({ status: "error", message: "Email not verified or not found" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user details
    const [updatedCount] = await User.update(
      { firstName, lastName, password: hashedPassword },
      { where: { uuid: decoded.uuid, otp: "verified" } }
    );

    if (updatedCount === 0) {
      return res.status(400).json({ status: "error", message: "User registration failed" });
    }

    // Fetch updated user
    const updatedUser = await User.findOne({ where: { uuid: decoded.uuid } });

    // Create account for the user
    await Account.create({
      userUuid: updatedUser.uuid,
      accountNumber: updatedUser.accountNumber,
      accountTypeId: 1,
      balance: 100000.0,
    });

    res.json({ status: "success", message: "Registration successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred during registration",
      error: error.message,
    });
  }
};


// Login user
const login = async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }],
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = generateToken({
      uuid: user.uuid,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred during login" });
  }
};

module.exports = {
  sendEmailOtp,
  verifyEmailOtp,
  sendPhoneOtp,
  verifyPhoneOtp,
  register,
  login,
};
