const express = require("express");
const router = express.Router();
const {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
} = require("../../controllers/Admin/banner.controller");
const upload = require("../../middleware/upload"); // Multer middleware for file uploads
const protect = require("../../middleware/auth"); // Authentication middleware
const adminProtect = require("../../middleware/adminProtect"); // Admin access middleware

// Routes
router.post(
  "/banner",
  protect,
  adminProtect,
  upload.single("image"), // Handle image upload
  createBanner
);

router.get("/banner", getAllBanners);
router.get("/banner/:id", getBannerById);
router.put(
  "/banner/:id",
  protect,
  adminProtect,
  upload.single("image"), // Handle image upload for updates
  updateBanner
);

router.delete("/banner/:id", protect, adminProtect, deleteBanner);

module.exports = router;
