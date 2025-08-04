// src/services/email.service.js
const nodemailer = require("nodemailer");
const logger = require("../config/logger");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendVerificationEmail = async (email, name, otp) => {
  try {
    await transporter.sendMail({
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: "Email Verification",
      html: `
        <h1>Hello ${name}</h1>
        <p>Your verification code is: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `,
    });
  } catch (error) {
    logger.error("Email service error:", error);
    throw new Error("Email could not be sent");
  }
};

// src/services/sms.service.js
const twilio = require("twilio");
const logger = require("../config/logger");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

exports.sendSMS = async (to, message) => {
  try {
    await client.messages.create({
      body: message,
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
    });
  } catch (error) {
    logger.error("SMS service error:", error);
    throw new Error("SMS could not be sent");
  }
};

// src/services/payment.service.js
const Razorpay = require("razorpay");
const crypto = require("crypto");
const ErrorResponse = require("../utils/errorResponse");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (amount, currency = "INR") => {
  try {
    const options = {
      amount: amount * 100, // amount in smallest currency unit
      currency,
      receipt: `order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    throw new ErrorResponse("Payment initialization failed", 500);
  }
};

exports.verifyPayment = (orderId, paymentId, signature) => {
  const text = `${orderId}|${paymentId}`;
  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(text)
    .digest("hex");

  return generated_signature === signature;
};

// src/services/cache.service.js
const redis = require("../config/redis");
const logger = require("../config/logger");

class CacheService {
  async get(key) {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error("Cache get error:", error);
      return null;
    }
  }

  async set(key, value, expireTime = 3600) {
    try {
      await redis.set(key, JSON.stringify(value), "EX", expireTime);
      return true;
    } catch (error) {
      logger.error("Cache set error:", error);
      return false;
    }
  }

  async del(key) {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      logger.error("Cache delete error:", error);
      return false;
    }
  }
}

module.exports = new CacheService();
