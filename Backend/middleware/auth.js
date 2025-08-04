const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Assuming you have a User model
const expressAsyncHandler = require("express-async-handler");

const protect = expressAsyncHandler(async (req, res, next) => {
  // console.log("Request Headers:", req.headers); // Log the request headers for debugging
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      // console.log("Decoded token:", decoded); // Log the decoded token for debugging
      // Extract the user from the decoded token
      req.user = await User.findById(decoded.id).select("-password"); // Use `userId` instead of `id`
      // console.log("User from token:", req.user); // Log the user for debugging
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }
      next(); // Proceed to the next middleware if the user is authenticated
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ Expired: "Session expired, please log in again" });
      }
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
});

module.exports = protect;
