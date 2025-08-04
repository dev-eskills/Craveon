const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, default: "India" },
  label: { type: String, default: "home" }, // home, office, etc.
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please Enter Your Password"],
    },
    number: {
      type: String,
      unique: true,
      index: true,
      required: [true, "Please Enter Your Valid Mobile Number"],
    },
    addresses: {
      type: [addressSchema],
      required: false,
      default: [],
    },
    role: {
      type: String,
      enum: ["user", "admin", "restaurant", "delivery"],
      default: "user",
    },
    token: {
      type: String,
    },
    refreshToken: String,
  },
  {
    timestamps: true,
  }
);

// module.exports = mongoose.model("User", userSchema);
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
