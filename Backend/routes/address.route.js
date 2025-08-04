const express = require("express");
const protect = require("../middleware/auth");
const {
  editUser,
  addAddress,
  getAllAddresses,
  editAddress,
  deleteAddress,
} = require("../controllers/user.controller");
const router = express.Router();

router.put("/:id", protect, editUser);
router.post("/", protect, addAddress);
router.get("/", protect, getAllAddresses);
router.post("/EditAddress", protect, editAddress);
router.delete("/:id", protect, deleteAddress);

module.exports = router;
