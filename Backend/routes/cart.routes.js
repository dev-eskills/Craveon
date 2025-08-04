const express = require("express");
const cart = require("../controllers/cart.controller");
const protect = require("../middleware/auth");

const router = express.Router();

// Protect all cart routes to ensure user authentication
router.use(protect);

// Get user's cart and add to cart
router.route("/").get(cart.getCart).post(cart.addToCart);

// Remove item from cart and update cart item quantity
router
  .route("/item/:id")
  .delete(cart.removeFromCart)
  .patch(cart.updateCartItem);

// Apply and remove discounts
router.route("/discount").post(cart.applyDiscount).delete(cart.removeDiscount);

// Clear entire cart
router.route("/clear").delete(cart.clearCart);

module.exports = router;
