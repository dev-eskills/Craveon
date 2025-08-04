const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const ErrorResponse = require("../utils/errorResponse");

exports.refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body; // Extract refreshToken from request body
  if (!refreshToken) {
    return next(new ErrorResponse("No refresh token provided", 401));
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== refreshToken) {
      return next(new ErrorResponse("Invalid refresh token", 401));
    }

    // Generate new access token
    const newAccessToken = user.getSignedJwtToken();

    // Send new access token in response
    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (err) {
    return next(new ErrorResponse("Invalid refresh token", 401));
  }
});
