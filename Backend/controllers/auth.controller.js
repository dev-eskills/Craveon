const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/errorResponse");
const {
  sendVerificationEmail,
  // sendResetPasswordEmail,
} = require("../services/email.service");
// const { sendSMS } = require("../services/sms.service");
const User = require("../models/user");



exports.verifyOtp = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  console.log(otp);

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  // Convert entered OTP to a number
  const enteredOtp = Number(otp);

  console.log("Stored OTP:", user.otp);
  console.log("Entered OTP:", enteredOtp);
  console.log("Stored OTP Expiry:", user.otpExpires);
  console.log("Current Time:", new Date());

  // Validate OTP and expiry
  if (user.otp !== enteredOtp || user.otpExpires < new Date()) {
    return next(new ErrorResponse("Invalid or expired OTP", 400));
  }

  // Mark user as verified and clear OTP fields
  user.verified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  // Generate tokens and send response
  sendTokenResponse(user, 200, res);
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  // Convert email to lowercase before querying
  const lowerCaseEmail = email.toLowerCase();

  // Fetch user and password
  const user = await User.findOne({ email: lowerCaseEmail }).select(
    "+password"
  );

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Validate password
  if (!(await user.matchPassword(password))) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(user, 200, res);
});

exports.logout = asyncHandler(async (req, res, next) => {
  req.user.tokens = req.user.tokens.filter(
    (tokenObj) => tokenObj.token !== req.token
  );
  await req.user.save();

  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).lean();
  res.status(200).json({ success: true, data: user });
});

exports.updateDetails = asyncHandler(async (req, res, next) => {
  const { name, email, phone } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, email, phone },
    { new: true, runValidators: true }
  ).lean();

  res.status(200).json({ success: true, data: user });
});

// Helper function to generate token and set cookie
const sendTokenResponse = async (user, statusCode, res) => {
  const accessToken = user.getSignedJwtToken();
  console.log(accessToken, "tokenn")
  const refreshToken = await user.getRefreshToken(); // Ensure refresh token is saved

  // Set cookies
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  // Send response
  res.status(statusCode).json({
    success: true,
    accessToken,
    refreshToken,
  });
};
