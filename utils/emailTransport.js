const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,  
  secure: true,  // Use TLS
  auth: {
    user: process.env.EMAIL_USER,  // Ensure this is correctly set in .env file
    pass: process.env.EMAIL_PASS,  // Ensure this is correctly set in .env file
  },
});

module.exports = transporter;
