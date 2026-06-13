const mongoose = require("mongoose");

const disputeSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true, // One dispute per order
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    disputeReason: {
      type: String,
      enum: ["MISSING_ITEMS", "PARTIAL_DELIVERY", "WRONG_ITEMS", "POOR_QUALITY", "OTHER"],
      required: true,
    },
    disputeItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "UNDER_REVIEW", "RESOLVED_REFUNDED", "RESOLVED_REPLACED", "REJECTED"],
      default: "PENDING",
    },
    resolutionDetails: {
      type: String,
      default: "",
    },
    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Dispute || mongoose.model("Dispute", disputeSchema);
