const postmark = require("postmark");

// Initialize Postmark client
const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

/**
 * Send email using Postmark
 * @param {Object} mailOptions - Options for sending the email
 */
const sendMail = async (mailOptions) => {
  try {
    const data = {
      From: "tech@integritypay.com.ng",
      To: mailOptions.to,
      Subject: mailOptions.subject,
      TextBody: mailOptions.text,
      HtmlBody: mailOptions.html,
    };

    await client.sendEmail(data);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};

module.exports = { sendMail };
