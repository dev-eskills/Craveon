// routes/Admin/index.js
const express = require("express");
const router = express.Router();
const {
  getDashboard,
  getRestaurantRevenue,
  restaurantReport,
} = require("../controllers/restaurantOwner.controller");
const protect = require("../middleware/auth");
// Combine banner routes
router.use("/product", require("./product.routes"));
router.get("/", protect, getDashboard);
router.get("/revenue", protect, getRestaurantRevenue);
router.get("/report", protect, restaurantReport);

module.exports = router;
