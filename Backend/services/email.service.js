const nodemailer = require("nodemailer");
const logger = require("../config/logger");

// Initialize transporter once
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true", // Convert string to boolean
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send an email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML content for the email
 * @returns {Promise<void>}
 */
const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    logger.error(`Email sending failed for ${to}:`, error);
    throw new Error("Failed to send email");
  }
};

/**
 * Send a verification email
 * @param {string} email - Recipient email
 * @param {string} name - Recipient name
 * @param {string} otp - OTP for verification
 */
const sendVerificationEmail = async (email, name, otp) => {
  const subject = "Email Verification";
  const html = `
    <h1>Hello ${name},</h1>
    <p>Your verification code is: <strong>${otp}</strong></p>
    <p>This code will expire in 10 minutes.</p>
  `;
  await sendEmail(email, subject, html);
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
};
