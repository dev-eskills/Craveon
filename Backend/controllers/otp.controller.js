const { default: axios } = require("axios");
const OTP = require("../models/otpModel");
const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();


const sendSMS = async (phone, otp) => {
  try {
    const response = await axios.get("https://www.fast2sms.com/dev/bulkV2", {
      params: {
        authorization: process.env.SMS_KEY, // Your API key
        route: "dlt",                       // DLT route
        sender_id: "CRAVEO",                // Your sender ID
        message: "194835",                  // Template ID from DLT
        variables_values: `${otp}|`,        // Values for template vars
        flash: "0",
        numbers: phone,                     // Recipient phone number(s)
        // schedule_time: "2025-08-14 14:30" // Optional: schedule sending
      },
    });

    return response.status === 200;
  } catch (err) {
    console.error("SMS send error:", err);
    return false;
  }
};


const verifyOtpToken = async (phone, token) => {
  const data = await jwt.verify(token, process.env.JWT_SECRET);
  return data?.phone === phone;
};

const sendOtp = expressAsyncHandler(async (req, res) => {
  const { phone } = req.query;
  if (phone?.length !== 10) {
    res.status(400);
    throw new Error("Enter Valid Phone Number");
  }
  const newOTP = generateOTP();
  const entry = await OTP.findOne({ phone });
  if (entry) {
    const sixtySecondsAgo = new Date(Date.now() - 60 * 1000);
    if (entry.updatedAt < sixtySecondsAgo) {
      if (!(await sendSMS(phone, newOTP))) {
        res.status(400);
        throw new Error("Something went Wrong");
      }
      entry.otp = newOTP;
      entry.expiresAt = new Date(Date.now() + 5 * 60000);
      await entry.save();
      res.status(200).json({
        message: "OTP sent Successfully",
      });
    } else {
      res.status(400);
      throw new Error("Please wait to send new OTP");
    }
  } else {
    if (!(await sendSMS(phone, newOTP))) {
      res.status(400);
      throw new Error("Something went Wrong");
    }
    const entry = new OTP({
      phone,
      otp: newOTP,
      expiresAt: new Date(Date.now() + 5 * 60000),
    });
    await entry.save();
    console.log("OTP sent Successfully else block", entry);
    res.status(200).json({
      message: "OTP sent Successfully",
    });
  }
});

const verifyOtp = expressAsyncHandler(async (req, res) => {
  const { phone, otp } = req.body;
  if (phone?.length !== 10 || !otp) {
    res.status(400);
    throw new Error("Invalid Fields");
  }
  console.log("Received verification request:", { phone, otp });
  const entry = await OTP.findOne({ phone });
  console.log("Database entry found:", entry);
  if (!entry) {
    console.log("No Entry Found");
    res.status(400);
    throw new Error("Invalid OTP");
  }
  if (entry.expiresAt < new Date()) {
    await OTP.deleteOne({ phone });
    res.status(400);
    throw new Error("OTP has Expired");
  }
  if (entry.otp === otp) {
    await OTP.deleteOne({ phone });
    res.status(200).json({
      message: "OTP Verified Successfully",
      otpToken: await jwt.sign({ phone }, process.env.JWT_SECRET, {
        // expiresIn: "5m",
      }),
    });
  } else {
    console.log("else block");
    res.status(400);
    throw new Error("Invalid OTP");
  }
});

module.exports = { sendOtp, verifyOtp, verifyOtpToken };
