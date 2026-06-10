const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  selectedAttributes: [
    {
      attributeName: String,
      selectedOption: [
        {
          name: String, // Option name (e.g., "Medium")
          price: {
            type: Number,
            default: 0,
          },
          _id: mongoose.Schema.Types.ObjectId, // If storing ObjectId
        },
      ],
      additionalPrice: {
        type: Number,
        default: 0,
      },
    },
  ],
  selectedAddons: [
    {
      addon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product.addons",
      },
      name: String,
      price: {
        type: Number,
        default: 0,
      },
      quantity: {
        type: Number,
        min: 1,
      },
    },
  ],
  itemTotal: {
    type: Number,
    required: true,
    min: 0,
  },
  specialInstructions: {
    type: String,
    trim: true,
    maxlength: 200,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    items: [cartItemSchema],
    totalQuantity: {
      type: Number,
      default: 0,
    },
    subtotal: {
      type: Number,
      default: 0,
    },
    taxRate: {
      type: Number,
      default: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    packagingCharge: {
      type: Number,
      default: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    discounts: [
      {
        type: {
          type: String,
          enum: ["percentage", "flat"],
          required: true,
        },
        value: {
          type: Number,
          required: true,
          min: 0,
        },
        description: String,
      },
    ],
    discountAmount: {
      type: Number,
      default: 0,
    },
    finalTotal: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours expiry
    },
  },
  { timestamps: true }
);

// Index for expiration - useful for TTL cleanup
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Pre-save middleware to calculate totals
cartSchema.pre("save", async function (next) {
  try {
    this.lastUpdated = new Date();
    this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    if (this.items.length === 0) {
      this.subtotal = 0;
      this.taxAmount = 0;
      this.discountAmount = 0;
      this.finalTotal = 0;
      return next();
    }

    if (this.restaurant) {
      const Restaurant = mongoose.model("Restaurant");
      const Setting = mongoose.model("Setting");
      const restaurant = await Restaurant.findById(this.restaurant).select(
        "packagingCharge deliverySettings.deliveryFee deliverySettings.minimumOrderAmount"
      );

      const settings = await Setting.findOne();

      if (restaurant) {
        this.totalQuantity = this.items.reduce(
          (total, item) => total + item.quantity,
          0
        );

        this.subtotal = this.items.reduce(
          (total, item) => total + item.itemTotal,
          0
        );

        this.taxRate = settings?.GST;

        this.taxAmount =
          Math.round(this.subtotal * (this.taxRate / 100) * 100) / 100;

        console.log("this.items", this.items);

        if (this.items.length > 0) {
          this.packagingCharge = restaurant.packagingCharge || 0;

          this.deliveryFee =
            this.subtotal >= restaurant.deliverySettings.minimumOrderAmount
              ? 0
              : restaurant.deliverySettings.deliveryFee;
        }

        let totalBeforeDiscount =
          this.subtotal +
          this.taxAmount +
          this.packagingCharge +
          this.deliveryFee +
          this.discountAmount;
        if (this.discounts && this.discounts.length > 0) {
          this.discounts.forEach((discount) => {
            if (discount.type === "percentage") {
              this.discountAmount += this.subtotal * (discount.value / 100);
            } else if (discount.type === "flat") {
              this.discountAmount += discount.value;
            }
          });
        }

        this.discountAmount = Math.min(this.discountAmount, this.subtotal);

        this.finalTotal = Math.max(
          totalBeforeDiscount - this.discountAmount,
          0
        );

        this.finalTotal = Math.floor(this.finalTotal);
      }
    }

    next();
  } catch (error) {
    console.error("❌ Error in cart pre-save hook:", error);
    next(error);
  }
});

// Method to add or update item in cart
cartSchema.methods.addOrUpdateItem = function (
  productDetails,
  quantity,
  selectedAttributes,
  selectedAddons
) {
  // Implementation of adding or updating cart item
  const existingItemIndex = this.items.findIndex(
    (item) => item.product.toString() === productDetails._id.toString()
  );

  const itemTotal = calculateItemTotal(
    productDetails,
    quantity,
    selectedAttributes,
    selectedAddons
  );

  if (existingItemIndex > -1) {
    // Update existing item
    this.items[existingItemIndex] = {
      ...this.items[existingItemIndex].toObject(),
      product: productDetails._id,
      quantity,
      selectedAttributes,
      selectedAddons,
      itemTotal,
    };
  } else {
    // Add new item
    this.items.push({
      product: productDetails._id,
      quantity,
      selectedAttributes,
      selectedAddons,
      itemTotal,
    });
  }
};

// Helper function to calculate item total
function calculateItemTotal(
  product,
  quantity,
  selectedAttributes,
  selectedAddons
) {
  let basePrice = product.discountedPrice || product.price;
  let itemTotal;

  // Add attribute price
  if (selectedAttributes && selectedAttributes.length > 0) {
    itemTotal = selectedAttributes[0]?.additionalPrice * quantity;
  } else {
    itemTotal = basePrice * quantity;
  }

  // Add addons price
  if (selectedAddons && selectedAddons.length > 0) {
    selectedAddons.forEach((addon) => {
      itemTotal += (addon.price || 0) * (addon.quantity || 1);
    });
  }

  return Math.round(itemTotal * 100) / 100; // Round to 2 decimal places
}

// Virtual for cart status/validity
cartSchema.virtual("isValid").get(function () {
  return this.items.length > 0 && new Date() < this.expiresAt;
});

// Method to check if cart belongs to a user
cartSchema.methods.belongsToUser = function (userId) {
  return this.user.toString() === userId.toString();
};

module.exports = mongoose.model("Cart", cartSchema);
