const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const productController = require("../controllers/product.controller");
const protect = require("../middleware/auth");
const upload = require("../middleware/upload");

// Routes
// POST - Create a new product (only restaurant owners)
router.post(
  "/",
  protect,
  upload.single("image"),
  productController.createProduct
);

// GET - Get all products of a restaurant
router.get("/:restaurantId", productController.getProductsByRestaurant);
router.get(
  "/user/:restaurantId",
  productController.getProductsByUserRestaurant
);
router.get("/category/:categoryId", productController.getProductsByCategory);

// GET - Get product details
router.get("/details/:id", productController.getProductDetails);

// PUT - Update a product (only by owner)
router.put(
  "/:id",
  protect,
  upload.single("image"),
  productController.updateProduct
);

// DELETE - Delete a product (only by owner)
router.delete("/:id", protect, productController.deleteProduct);

// PATCH - Toggle product availability (only by owner)
router.patch(
  "/:id/toggle-availability",
  protect,
  productController.toggleProductAvailability
);

module.exports = router;
