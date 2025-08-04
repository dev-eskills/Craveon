const express = require("express");
const router = express.Router();
const deliveryPartnerController = require("../controllers/deleveryPartner");
const protect = require("../middleware/auth");

// Protect all routes - require authentication
router.use(protect);
// Restrict to delivery partners only
// router.use(restrictTo("delivery_partner"));

// Get available orders for pickup
router.get("/available-orders", deliveryPartnerController.getAvailableOrders);

// Get delivery partner's assigned orders
router.get("/my-orders", deliveryPartnerController.getMyOrders);

// Accept an order for delivery
router.post("/accept-order/:orderId", deliveryPartnerController.acceptOrder);

// Verify pickup with OTP
router.post("/verify-pickup/:orderId", deliveryPartnerController.verifyPickup);

// Mark order as out for delivery
router.post(
  "/out-for-delivery/:orderId",
  deliveryPartnerController.markOutForDelivery
);

// Verify delivery with OTP
router.post(
  "/verify-delivery/:orderId",
  deliveryPartnerController.verifyDelivery
);

// Report an issue with delivery
router.post(
  "/report-issue/:orderId",
  deliveryPartnerController.reportDeliveryIssue
);

// Update location during delivery
router.post(
  "/update-location/:orderId",
  deliveryPartnerController.updateLocation
);

module.exports = router;
