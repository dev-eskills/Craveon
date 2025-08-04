const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Authentication middleware to verify JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login.",
      });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];
    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // Find user by id
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found or token is invalid",
      });
    }

    // Check if token is in the blacklist (for logout functionality)
    // This would require a Redis or similar store for blacklisted tokens
    // if (isTokenBlacklisted(token)) {
    //   return res.status(401).json({
    //     success: false,
    //     message: 'Token has been revoked. Please login again.'
    //   });
    // }

    // Add user to request object
    req.user = user;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again.",
      });
    }

    console.error("Authentication error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during authentication",
    });
  }
};

/**
 * Authorization middleware to check user roles
 * @param {...String} roles - Roles allowed to access the route
 * @returns {Function} Express middleware function
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user exists and has a role
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: "Access forbidden. User role not defined.",
      });
    }

    // Check if user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access forbidden. ${req.user.role} role is not authorized.`,
      });
    }

    // If in restaurant role, check if they're accessing their own restaurant
    if (req.user.role === "restaurant" && req.params.restaurantId) {
      // Assuming restaurantId is stored in user object for restaurant owners
      if (req.user.restaurantId.toString() !== req.params.restaurantId) {
        return res.status(403).json({
          success: false,
          message:
            "Access forbidden. You can only access your own restaurant data.",
        });
      }
    }

    // User has permission, proceed to the next middleware
    next();
  };
};
