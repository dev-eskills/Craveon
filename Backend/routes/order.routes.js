const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const protect = require("../middleware/auth");

// Create new order from cart
router.post("/", protect, orderController.createOrder);

// admin dashboard overview
router.get("/overview", orderController.orderOverview);

// admin dashboard revenue
router.get("/revenue", orderController.revenueOverview);

// Verify payment for online orders
router.post(
  "/verify-payment",
  authenticate,
  authorize("user"),
  orderController.verifyPayment
);

// Get specific order by ID
router.get("/:id", authenticate, orderController.getOrderById);

// Get current user's orders
router.get("/user/my-orders/:id", protect, orderController.getUserOrders);

// Get restaurant orders
router.get(
  "/restaurant/:restaurantId",
  protect,
  orderController.getRestaurantOrders
);

// Update order status
router.patch("/:id/status", authenticate, orderController.updateOrderStatus);

// Assign delivery partner to order
router.post(
  "/assign-delivery",
  protect,
  // authenticate,
  // authorize("admin", "restaurant"),
  orderController.updateOrderTrackStatus
);

// Add customer rating
router.post(
  "/:orderId/rate",
  authenticate,
  authorize("user"),
  orderController.addCustomerRating
);

// Get all orders (admin only)
router.get("/", authenticate, authorize("admin"), orderController.getAllOrders);

// Get order metrics
router.get(
  "/metrics/dashboard",
  authenticate,
  authorize("admin", "restaurant"),
  orderController.getOrderMetrics
);

// Update order notes
router.patch(
  "/:id/notes",
  authenticate,
  authorize("admin", "restaurant"),
  orderController.updateOrderNotes
);

module.exports = router;
