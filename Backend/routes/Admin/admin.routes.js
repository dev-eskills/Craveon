// routes/Admin/index.js
const express = require("express");
const router = express.Router();
const {adminDashboard} = require("../../controllers/Admin/admin.controller");
const protect = require("../../middleware/auth");
const adminProtect = require("../../middleware/adminProtect");

// Combine banner routes
router.use("/", require("./banner.route"));
router.use("/", require("./user.route"));
router.use("/restaurant", require("./restaurant.route"));
router.use("/category", require("../categoryRoutes"));


router.get("/", protect, adminProtect, adminDashboard);

module.exports = router;

