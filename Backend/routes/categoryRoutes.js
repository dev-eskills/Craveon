const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const categoryController = require("../controllers/categoryController"); // Adjust path as needed
const protect = require("../middleware/auth");
const adminProtect = require("../middleware/adminProtect");
const upload = require("../middleware/upload"); // Multer middleware for file uploads

// Public routes
router.get("/all", categoryController.getCategories);
router.get("/:id", categoryController.getCategory);

// Protected admin routes with file uploads for logo and cover
router.post(
  "/",
  protect,
  adminProtect,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  categoryController.createCategory
);

router.put(
  "/:id",
  protect,
  adminProtect,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  categoryController.updateCategory
);

router.delete("/:id", protect, adminProtect, categoryController.deleteCategory);

router.patch(
  "/:id/toggle-status",
  protect,
  adminProtect,
  categoryController.toggleCategoryStatus
);

module.exports = router;
