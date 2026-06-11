const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      enum: ["info", "warn", "error"],
      default: "info",
    },
    message: {
      type: String,
      required: true,
    },
    meta: {
      method: String,
      endpoint: String,
      requestBody: mongoose.Schema.Types.Mixed,
      query: mongoose.Schema.Types.Mixed,
      params: mongoose.Schema.Types.Mixed,
      user: mongoose.Schema.Types.Mixed,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24 * 7, // Auto delete after 7 days
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Log", LogSchema);