const express = require("express");
const {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  resetPassword,
} = require("../controllers/user.controller");
const { sendOtp, verifyOtp } = require("../controllers/otp.controller");

const router = express.Router();

router.post("/register", registerUser);
router.post("/logOut", logoutUser);
router.post("/login", loginUser);
router.get("/refresh", refreshToken);
router.get("/otp", sendOtp);
router.post("/verifyOtp", verifyOtp);
router.post("/resetPassword", resetPassword);

module.exports = router;
