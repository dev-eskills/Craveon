const express = require("express");
const router = express.Router();
const protect = require("../../middleware/auth");
const adminProtect = require("../../middleware/adminProtect");
const {
  getAllRestaurants,
  getRestaurantById,
  deleteRestaurant,
  toggleActiveStatus,
  getRestaurantsByCity,
  getFeaturedRestaurants,
  getBusinessHours,
  updateRestaurantImages,
  uploadRestaurantImages,
  createRestaurant,
  updateRestaurant,
  updateBusinessHours,
} = require("../../controllers/restaurant.controller");

// Restaurant registration/creation (Admin route)
router.post("/", protect, adminProtect, createRestaurant);

// Get all restaurants with filtering (Public route)
router.get("/all", getAllRestaurants);

// Get featured restaurants (Public route)
router.get("/featured", getFeaturedRestaurants);

// Get restaurants by city (Public route)
router.get("/city/:city", getRestaurantsByCity);

// Get a single restaurant by ID (Public route)
router.get("/:id", getRestaurantById);

// Get restaurant business hours (Public route)
router.get("/:id/business-hours", getBusinessHours);
router.put("/:id/business-hours", updateBusinessHours);

// Update a restaurant (Restaurant owner only)
router.put("/:id", protect, updateRestaurant);

// Toggle restaurant active status (Restaurant owner only)
router.patch("/:id/toggle-status", protect, toggleActiveStatus);

// Update restaurant images (Restaurant owner only)
router.put(
  "/:id/update-images",
  protect, // Authentication middleware
  uploadRestaurantImages, // Multer middleware for handling multipart/form-data
  updateRestaurantImages // Controller function
);

// Delete a restaurant (Admin only)
router.delete("/:id", protect, adminProtect, deleteRestaurant);

module.exports = router;
