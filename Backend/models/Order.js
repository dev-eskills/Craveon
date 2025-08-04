const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
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
      index: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        price: Number,
        quantity: Number,
        variations: Object,
        addons: Array,
      },
    ],
    deliveryAddress: {
      fullName: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      postalCode: String,
      phoneNumber: String,
      alternatePhoneNumber: String,
      addressType: {
        type: String,
        enum: ["home", "work", "other"],
        default: "home",
      },
      deliveryInstructions: String,
    },
    totalQuantity: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    taxRate: {
      type: Number,
      required: true,
    },
    taxAmount: {
      type: Number,
      required: true,
    },
    packagingCharge: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      required: true,
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
        },
        description: String,
      },
    ],
    discountAmount: {
      type: Number,
      required: true,
    },
    finalTotal: {
      type: Number,
      required: true,
    },
    paymentMode: {
      type: String,
      enum: ["COD", "ONLINE", "WALLET"],
      required: true,
    },
    paymentProvider: {
      type: String,
      enum: ["RAZORPAY", "NONE"],
      default: "NONE",
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED", "REFUNDED", "PARTIALLY_REFUNDED"],
      default: "PENDING",
    },
    paymentDetails: {
      transactionId: String,
      paymentId: String,
      orderId: String,
      signature: String,
      paymentDate: Date,
      refundId: String,
      refundAmount: Number,
      refundDate: Date,
      refundStatus: String,
      paymentMethod: String,
      paymentNotes: String,
    },
    status: {
      type: String,
      enum: [
        "PENDING", // Initial state when order is placed
        "ACCEPTED", // Restaurant accepted the order
        "PREPARING", // Restaurant is preparing food
        "READY_FOR_PICKUP", // Food is ready for pickup by delivery partner
        "ASSIGNED", // Order assigned to delivery partner
        "PICKED_UP", // Delivery partner picked up the order
        "OUT_FOR_DELIVERY", // Delivery partner is on the way
        "DELIVERED", // Order delivered to customer
        "CANCELLED", // Order cancelled
        "REJECTED", // Order rejected by restaurant
      ],
      default: "PENDING",
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            "PENDING",
            "ACCEPTED",
            "PREPARING",
            "READY_FOR_PICKUP",
            "ASSIGNED",
            "PICKED_UP",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "CANCELLED",
            "REJECTED",
          ],
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        notes: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    estimatedDeliveryTime: {
      type: Date,
    },
    actualDeliveryTime: {
      type: Date,
    },

    // Delivery Partner Information
    deliveryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming delivery partners are in User collection with role="delivery"
      default: null,
    },

    // OTP for restaurant verification during pickup
    pickupOTP: {
      type: String,
      default: generateOTP,
    },

    // OTP for customer verification during delivery
    deliveryOTP: {
      type: String,
      default: generateOTP,
    },

    // Pickup verification details
    pickupVerification: {
      verified: {
        type: Boolean,
        default: false,
      },
      verifiedAt: Date,
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },

    // Delivery verification details
    deliveryVerification: {
      verified: {
        type: Boolean,
        default: false,
      },
      verifiedAt: Date,
      signature: String, // In case you want to capture customer signature
    },

    cancellationReason: String,
    cancellationNotes: String,
    customerRating: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      review: String,
      timestamp: Date,
    },
    restaurantNotes: String,
    adminNotes: String,
  },
  { timestamps: true }
);

// Method to update order status
orderSchema.methods.updateStatus = async function (
  newStatus,
  updatedBy,
  notes = ""
) {
  // Add to status history
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    notes: notes,
    updatedBy: updatedBy,
  });

  // Update current status
  this.status = newStatus;

  // If status is DELIVERED, set actual delivery time
  if (newStatus === "DELIVERED") {
    this.actualDeliveryTime = new Date();
  }

  return await this.save();
};

// Method to assign order to delivery partner
orderSchema.methods.assignToDeliveryPartner = async function (
  deliveryPartnerId
) {
  this.deliveryPartner = deliveryPartnerId;
  return await this.updateStatus("PICKED_UP", deliveryPartnerId);
};

// Method to verify pickup with OTP
orderSchema.methods.verifyPickup = async function (otp, deliveryPartnerId) {
  if (this.pickupOTP !== otp) {
    throw new Error("Invalid pickup OTP");
  }

  if (this.deliveryPartner.toString() !== deliveryPartnerId.toString()) {
    throw new Error("This order is not assigned to you");
  }

  this.pickupVerification = {
    verified: true,
    verifiedAt: new Date(),
    verifiedBy: deliveryPartnerId,
  };

  return await this.updateStatus("PICKED_UP", deliveryPartnerId);
};

// Method to mark as out for delivery
orderSchema.methods.markOutForDelivery = async function (deliveryPartnerId) {
  // if (!this.pickupVerification.verified) {
  //   throw new Error("Pickup needs to be verified first");
  // }

  return await this.updateStatus("OUT_FOR_DELIVERY", deliveryPartnerId);
};

// Method to verify delivery with OTP
orderSchema.methods.verifyDelivery = async function (otp, deliveryPartnerId) {
  // if (this.deliveryOTP !== otp) {
  //   throw new Error("Invalid delivery OTP");
  // }

  // if (this.deliveryPartner.toString() !== deliveryPartnerId.toString()) {
  //   throw new Error("This order is not assigned to you");
  // }

  // this.deliveryVerification = {
  //   verified: true,
  //   verifiedAt: new Date(),
  // };

  return await this.updateStatus("DELIVERED", deliveryPartnerId);
};

// Method to calculate refund amount based on cancellation stage
orderSchema.methods.calculateRefundAmount = function (adminOverride = null) {
  // If admin has overridden the refund amount
  if (adminOverride !== null) {
    return adminOverride;
  }

  // Default refund policy based on order status
  switch (this.status) {
    case "PENDING":
    case "ACCEPTED":
      return this.finalTotal; // Full refund
    case "PREPARING":
      return this.finalTotal * 0.8; // 80% refund
    case "READY_FOR_PICKUP":
    case "ASSIGNED":
      return this.finalTotal * 0.5; // 50% refund
    case "PICKED_UP":
    case "OUT_FOR_DELIVERY":
      return this.finalTotal * 0.2; // 20% refund
    default:
      return 0; // No refund for delivered orders
  }
};

// Add indexes for faster queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ restaurant: 1, createdAt: -1 });
orderSchema.index({ deliveryPartner: 1, status: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

// Add mongoose-paginate plugin
orderSchema.plugin(require("mongoose-paginate-v2"));

// Generate a new unique order number (synchronous function)
function generateOrderNumber() {
  const date = new Date();
  const dateString = date.toISOString().slice(0, 10).replace(/-/g, "");
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  const timestamp = Date.now().toString().slice(-4); // Last 4 digits of timestamp for extra uniqueness
  return `ORD-${dateString}-${randomDigits}${timestamp}`;
}

// Method to update order status
orderSchema.methods.updateStatus = function (
  status,
  notes = "",
  updatedBy = null
) {
  this.status = status;
  this.statusHistory.push({
    status,
    timestamp: new Date(),
    notes,
    updatedBy,
  });

  // If delivered, set the actual delivery time
  if (status === "DELIVERED") {
    this.actualDeliveryTime = new Date();
  }

  return this;
};

// Method to calculate refund amount based on cancellation stage
orderSchema.methods.calculateRefundAmount = function (adminOverride = null) {
  // If admin specifies a refund amount, use that
  if (adminOverride !== null) {
    return adminOverride;
  }

  let refundPercentage = 0;

  // Default refund policy based on order status
  switch (this.status) {
    case "PENDING":
      refundPercentage = 100; // Full refund if cancelled before restaurant accepts
      break;
    case "ACCEPTED":
      refundPercentage = 90; // 90% refund if cancelled after acceptance but before preparation
      break;
    case "PREPARING":
      refundPercentage = 50; // 50% refund if cancelled during preparation
      break;
    case "READY_FOR_PICKUP":
    case "OUT_FOR_DELIVERY":
      refundPercentage = 20; // 20% refund if cancelled after food is ready
      break;
    case "DELIVERED":
      refundPercentage = 0; // No refund after delivery
      break;
    default:
      refundPercentage = 0;
  }

  // Calculate refund amount
  return Math.round((this.finalTotal * refundPercentage) / 100);
};

// Helper function to calculate delivery time
function calculateEstimatedDeliveryTime() {
  const now = new Date();
  // Add 45 minutes to current time
  return new Date(now.getTime() + 45 * 60000);
}

// Enhanced static method to create order from cart with proper attribute handling
orderSchema.statics.createFromCart = async function (
  cart,
  paymentMode,
  paymentProvider,
  deliveryAddress
) {
  try {
    // Validate input data
    if (!cart || !cart.user || !cart.items || !cart.items.length) {
      throw new Error("Invalid cart data");
    }

    if (!paymentMode || !["COD", "ONLINE", "WALLET"].includes(paymentMode)) {
      throw new Error("Invalid payment mode");
    }

    if (!deliveryAddress) {
      throw new Error("Delivery address is required");
    }

    // Create order items from cart items with proper conversion for selectedOption
    const items = cart.items.map((item) => {
      // Ensure product data exists
      if (!item.product) {
        throw new Error("Product information missing in cart item");
      }

      return {
        product: item.product._id || item.product,
        name: item.product.name || "Product",
        price: item.product.price || 0,
        quantity: item.quantity || 1,
        selectedAttributes: (item.selectedAttributes || []).map((attr) => ({
          attributeName: attr.attributeName,
          selectedOption: Array.isArray(attr.selectedOption)
            ? JSON.stringify(attr.selectedOption)
            : String(attr.selectedOption || ""),
          additionalPrice: Number(attr.additionalPrice || 0),
        })),
        selectedAddons: item.selectedAddons || [],
        itemTotal: item.itemTotal || item.product.price * (item.quantity || 1),
        specialInstructions: item.specialInstructions || "",
      };
    });

    // Format the delivery address to match schema
    const formattedAddress = {
      fullName: deliveryAddress.fullName || "",
      addressLine1:
        deliveryAddress.addressLine1 || deliveryAddress.street || "",
      addressLine2:
        deliveryAddress.addressLine2 || deliveryAddress.landmark || "",
      city: deliveryAddress.city || "",
      state: deliveryAddress.state || "",
      postalCode: deliveryAddress.postalCode || deliveryAddress.zipCode || "",
      phoneNumber: deliveryAddress.phoneNumber || "",
      alternatePhoneNumber: deliveryAddress.alternatePhoneNumber || "",
      addressType: deliveryAddress.addressType?.toLowerCase() || "home",
      deliveryInstructions: deliveryAddress.deliveryInstructions || "",
    };

    // Calculate or verify totals
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);

    // Generate order number directly here
    const orderNumber = generateOrderNumber();

    // Create the new order with generated orderNumber
    const order = new this({
      orderNumber: orderNumber, // Set order number directly
      user: cart.user,
      restaurant: cart.restaurant._id || cart.restaurant,
      items: items,
      deliveryAddress: formattedAddress,
      totalQuantity: totalQuantity,
      subtotal: subtotal,
      taxRate: cart.taxRate || 0,
      taxAmount: cart.taxAmount || 0,
      packagingCharge: cart.packagingCharge || 0,
      deliveryFee: cart.deliveryFee || 0,
      discounts: cart.discounts || [],
      discountAmount: cart.discountAmount || 0,
      finalTotal:
        cart.finalTotal ||
        subtotal +
          (cart.taxAmount || 0) +
          (cart.packagingCharge || 0) +
          (cart.deliveryFee || 0) -
          (cart.discountAmount || 0),
      paymentMode: paymentMode,
      paymentProvider: paymentProvider || "NONE",
      paymentStatus: "PENDING",
      status: "PENDING",
      estimatedDeliveryTime: calculateEstimatedDeliveryTime(),
      statusHistory: [
        {
          status: "PENDING",
          timestamp: new Date(),
          notes: "Order created",
        },
      ],
    });

    return order;
  } catch (error) {
    throw new Error(`Failed to create order from cart: ${error.message}`);
  }
};

// Add tracking methods
orderSchema.methods.trackOrder = function () {
  // Calculate elapsed time since order creation
  const now = new Date();
  const created = this.createdAt || now;
  const elapsedMinutes = Math.floor((now - created) / (1000 * 60));

  // Calculate delivery progress as a percentage
  let progressPercentage = 0;

  switch (this.status) {
    case "PENDING":
      progressPercentage = 10;
      break;
    case "ACCEPTED":
      progressPercentage = 25;
      break;
    case "PREPARING":
      progressPercentage = 50;
      break;
    case "READY_FOR_PICKUP":
      progressPercentage = 70;
      break;
    case "OUT_FOR_DELIVERY":
      progressPercentage = 85;
      break;
    case "DELIVERED":
      progressPercentage = 100;
      break;
    default:
      progressPercentage = 0;
  }

  // Calculate time remaining
  let remainingTimeMinutes = 0;
  if (this.estimatedDeliveryTime && this.status !== "DELIVERED") {
    remainingTimeMinutes = Math.max(
      0,
      Math.floor((this.estimatedDeliveryTime - now) / (1000 * 60))
    );
  }

  return {
    currentStatus: this.status,
    progressPercentage,
    elapsedTimeMinutes: elapsedMinutes,
    estimatedRemainingMinutes: remainingTimeMinutes,
    statusHistory: this.statusHistory,
  };
};

// Add method to handle payment updates
orderSchema.methods.updatePayment = function (paymentDetails) {
  if (!paymentDetails) return this;

  this.paymentDetails = {
    ...this.paymentDetails,
    ...paymentDetails,
    paymentDate: paymentDetails.paymentDate || new Date(),
  };

  if (paymentDetails.paymentId && paymentDetails.signature) {
    this.paymentStatus = "PAID";
  } else if (paymentDetails.refundId) {
    this.paymentStatus =
      paymentDetails.refundStatus === "PARTIAL"
        ? "PARTIALLY_REFUNDED"
        : "REFUNDED";
  }

  return this;
};

orderSchema.plugin(mongoosePaginate);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
