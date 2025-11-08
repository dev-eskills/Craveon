const { createResponse } = require("../middleware/createResponse");
const { handleError } = require("../middleware/handleError");
const Cart = require("../models/cart");
const Product = require("../models/Products");
const asyncHandler = require("express-async-handler");
const Restaurant = require("../models/Restaurants");

/**
 * @desc    Add item to cart
 * @route   POST /api/cart
 * @access  Private
 */
exports.addToCart = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      productId,
      quantity = 1,
      selectedAttributes,
      selectedAddons,
    } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    // ⚠️ product.restaurant contains OWNER ID, not restaurant ID
    const restaurantOwnerId = product.restaurant;

    // Fetch the actual restaurant using owner ID
    const restaurant = await Restaurant.findOne({ owner: restaurantOwnerId })
      .select("_id commissionRate packagingCharge owner businessHours")
      .populate("owner", "name email");


    if (!product.isAvailable || !restaurant) {
      return handleError(res, 400, "Product is not available for ordering");
    }

    const isRestaurantOpen = restaurant.isOpen();

    if (!isRestaurantOpen) {
      return handleError(res, 400, "Restaurant is currently closed");
    }

    // ✅ USE THE ACTUAL RESTAURANT ID, NOT THE OWNER ID
    const actualRestaurantId = restaurant._id;

    let cart = await Cart.findOne({ user: userId });

    // Check restaurant mismatch
    if (cart && cart.restaurant) {
      if (cart.items.length === 0) {
        cart.restaurant = actualRestaurantId;
      } 
      else if (String(cart.restaurant) !== String(actualRestaurantId)) {
        return createResponse(
          res,
          400,
          "Items from different restaurants cannot be added to the same cart. Please clear your cart first."
        );
      }
    }

    if (!cart) {
      cart = new Cart({
        user: userId,
        restaurant: actualRestaurantId, // ✅ Use actual restaurant ID
        items: [],
      });
    } 
    else if (!cart.restaurant) {
      cart.restaurant = actualRestaurantId; // ✅ Use actual restaurant ID
    }

    const validatedAttributes = validateAttributes(product, selectedAttributes);
    const validatedAddons = validateAddons(product, selectedAddons);

    cart.addOrUpdateItem(
      product,
      quantity,
      validatedAttributes,
      validatedAddons
    );

    await cart.save();

    await cart.populate([
      {
        path: "items.product",
        select: "name price discountedPrice images isVeg attributes addons",
      },
      {
        path: "restaurant",
        select: "name address",
      },
    ]);

    return createResponse(res, 200, "Item added to cart successfully", cart);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    handleError(res, 500, "Error adding item to cart", error);
  }
});

/**
 * @desc    Get user's cart
 * @route   GET /api/cart
 * @access  Private
 */
// exports.getCart = asyncHandler(async (req, res) => {
//   try {
//     // Get userId from authenticated user
//     const userId = req.user._id;

//     const cart = await Cart.findOne({ user: userId })
//       .populate({
//         path: "items.product",
//         select:
//           "name price image isVeg restaurant description attributes addons",
//       })
//       .populate({
//         path: "restaurant",
//         select: "name address",
//       });

//     if (!cart) {
//       return createResponse(res, 200, "Cart is empty", {
//         items: [],
//         subtotal: 0,
//         finalTotal: 0,
//       });
//     }

//     return createResponse(res, 200, "Cart retrieved successfully", cart);
//   } catch (error) {
//     handleError(res, 500, "Error retrieving cart", error);
//   }
// });

exports.getCart = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId })
      .populate({
        path: "items.product",
        select:
          "name price image isVeg restaurant description attributes addons",
      })
      .populate({
        path: "restaurant",
        select: "name address",
      });

    console.log("cart", cart);

    if (!cart) {
      return createResponse(res, 200, "Cart is empty", null); // 🔥 Ensure null is returned, not an empty cart
    }

    return createResponse(res, 200, "Cart retrieved successfully", cart);
  } catch (error) {
    handleError(res, 500, "Error retrieving cart", error);
  }
});

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/item/:id
 * @access  Private
 */
exports.removeFromCart = asyncHandler(async (req, res) => {
  try {
    // Get userId from authenticated user
    const userId = req.user._id;
    const productId = req.params.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return handleError(res, 404, "Cart not found");
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    // If cart is empty, remove the cart
    if (cart.items.length === 0) {
      await Cart.findByIdAndDelete(cart._id);
      return createResponse(
        res,
        200,
        "Item removed and cart is now empty",
        null
      );
    }

    await cart.save();
    await cart.populate([
      {
        path: "items.product",
        select: "name price images isVeg",
      },
      {
        path: "restaurant",
        select: "name address",
      },
    ]);

    return createResponse(res, 200, "Item removed from cart", cart);
  } catch (error) {
    handleError(res, 500, "Error removing item from cart", error);
  }
});

/**
 * @desc    Update cart item quantity
 * @route   PATCH /api/cart/item/:id
 * @access  Private
 */
exports.updateCartItem = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;
    const { quantity } = req.body;

    // if (!quantity || quantity < 0) {
    //   return handleError(res, 400, "Invalid quantity provided");
    // }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return handleError(res, 404, "Cart not found");
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return handleError(res, 404, "Item not found in cart");
    }

    const product = await Product.findById(productId);
    if (!product) {
      return handleError(res, 404, "Product not found");
    }

    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
      await cart.save();
      return createResponse(res, 200, "Item removed from cart", cart);
    }

    // Get the current cart item
    const cartItem = cart.items[itemIndex];

    // Update quantity and total
    cartItem.quantity = quantity;
    cartItem.itemTotal = calculateItemTotal(
      product,
      quantity,
      cartItem.selectedAttributes,
      cartItem.selectedAddons
    );

    await cart.save();

    await cart.populate([
      {
        path: "items.product",
        select: "name price discountedPrice images isVeg",
      },
      {
        path: "restaurant",
        select: "name address",
      },
    ]);

    return createResponse(res, 200, "Cart item updated", cart);
  } catch (error) {
    handleError(res, 500, "Error updating cart item", error);
  }
});

/**
 * @desc    Apply discount to cart
 * @route   POST /api/cart/discount
 * @access  Private
 */
exports.applyDiscount = asyncHandler(async (req, res) => {
  try {
    // Get userId from authenticated user
    const userId = req.user._id;
    const { type, value, description } = req.body;

    if (!type || !value) {
      return handleError(res, 400, "Invalid discount details");
    }

    if (type !== "percentage" && type !== "flat") {
      return handleError(res, 400, "Invalid discount type");
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return handleError(res, 404, "Cart not found");
    }

    // Add discount to cart
    cart.discounts.push({
      type,
      value,
      description:
        description ||
        `${type === "percentage" ? value + "%" : "₹" + value} off`,
    });

    await cart.save();

    await cart.populate([
      {
        path: "items.product",
        select: "name price images isVeg",
      },
      {
        path: "restaurant",
        select: "name address",
      },
    ]);

    return createResponse(res, 200, "Discount applied to cart", cart);
  } catch (error) {
    handleError(res, 500, "Error applying discount", error);
  }
});

/**
 * @desc    Remove discount from cart
 * @route   DELETE /api/cart/discount
 * @access  Private
 */
exports.removeDiscount = asyncHandler(async (req, res) => {
  try {
    // Get userId from authenticated user
    const userId = req.user._id;
    const { discountIndex } = req.body;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return handleError(res, 404, "Cart not found");
    }

    // Remove all discounts if no index provided
    if (discountIndex === undefined) {
      cart.discounts = [];
    } else {
      // Remove specific discount
      if (discountIndex < 0 || discountIndex >= cart.discounts.length) {
        return handleError(res, 400, "Invalid discount index");
      }
      cart.discounts.splice(discountIndex, 1);
    }

    await cart.save();

    await cart.populate([
      {
        path: "items.product",
        select: "name price images isVeg",
      },
      {
        path: "restaurant",
        select: "name address",
      },
    ]);

    return createResponse(res, 200, "Discount removed from cart", cart);
  } catch (error) {
    handleError(res, 500, "Error removing discount", error);
  }
});

/**
 * @desc    Clear user's cart
 * @route   DELETE /api/cart/clear
 * @access  Private
 */
exports.clearCart = asyncHandler(async (req, res) => {
  try {
    // Get userId from authenticated user
    const userId = req.user._id;

    const result = await Cart.findOneAndDelete({ user: userId });

    if (!result) {
      return createResponse(res, 200, "Cart was already empty", null);
    }

    return createResponse(res, 200, "Cart cleared successfully", null);
  } catch (error) {
    handleError(res, 500, "Error clearing cart", error);
  }
});

// Helper functions for validation
function validateAttributes(product, selectedAttributes) {
  if (!selectedAttributes || !Array.isArray(selectedAttributes)) return [];

  return selectedAttributes
    .filter((attr) => {
      const productAttr = product.attributes.find((a) => a.name === attr.name);

      if (!productAttr) return false;

      const validOption = productAttr.options.find(
        (opt) => opt.name === attr.options[0].name
      );

      return !!validOption;
    })
    .map((attr) => {
      // Find the product attribute and option to get the correct price
      const productAttr = product.attributes.find((a) => a.name === attr.name);
      const option = productAttr.options.find(
        (opt) => opt.name === attr.options[0].name
      );

      return {
        attributeName: attr.name,
        selectedOption: attr.options,
        additionalPrice: option ? option.price : 0,
      };
    });
}

function validateAddons(product, selectedAddons) {
  if (!selectedAddons || !Array.isArray(selectedAddons)) return [];

  return selectedAddons
    .filter((addon) => {
      const productAddon = product.addons.find(
        (a) => a._id.toString() === addon._id
      );
      return !!productAddon;
    })
    .map((addon) => {
      const productAddon = product.addons.find(
        (a) => a._id.toString() === addon._id
      );

      return {
        addon: addon._id,
        name: productAddon ? productAddon.name : "",
        price: productAddon ? productAddon.price : 0,
        quantity: addon.quantity && addon.quantity > 0 ? addon.quantity : 1,
      };
    });
}

/**
 * Calculates the total cost of a cart item
 *
 * @param {Object} product - The product object with price or discountedPrice
 * @param {Number} quantity - Quantity of the product
 * @param {Array} selectedAttributes - Array of attribute objects with `additionalPrice`
 * @param {Array} selectedAddons - Array of addon objects with `price` and optional `quantity`
 * @returns {Number} total item cost
 */
function calculateItemTotal(
  product,
  quantity,
  selectedAttributes = [],
  selectedAddons = []
) {
  let basePrice = product.discountedPrice || product.price || 0;

  // If attributes exist, use the attribute price as base price (not additional)
  if (selectedAttributes && selectedAttributes.length > 0) {
    const attributePrice = selectedAttributes.reduce((sum, attr) => {
      return sum + (attr.selectedOption[0]?.price || 0);
    }, 0);

    // Use attribute price as base price if it exists
    if (attributePrice > 0) {
      basePrice = attributePrice;
    }
  }

  let itemTotal = basePrice * quantity;

  // Add addon costs
  const addonCost = selectedAddons.reduce((sum, addon) => {
    const addonQty = addon.quantity || 1;
    return sum + (addon.price || 0) * addonQty;
  }, 0);

  itemTotal += addonCost;

  console.log({
    basePrice,
    quantity,
    addonCost,
    itemTotal,
    selectedAttributes,
  });

  return itemTotal;
}
