const express = require("express");
const adminProtect = require("../../middleware/adminProtect");
const {
  getAllUsers,
  userDetails,
} = require("../../controllers/user.controller");
const protect = require("../../middleware/auth");

const router = express.Router();

router.get("/allUsers", protect, adminProtect, getAllUsers);
router.get("/:id", protect, adminProtect, userDetails);

module.exports = router;
