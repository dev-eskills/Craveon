const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true, default: "India" },
      coordinates: {
        lng: { type: Number },
        lat: { type: Number },
      },
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: false,
        default: "Point",
      },
      coordinates: { type: [Number], required: false }, // [latitude ,longitude]
      displayName: { type: String, required: false },
    },
    contactInfo: {
      phones: [{ type: String }], // Array for multiple phone numbers
      email: { type: String },
      website: { type: String },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessHours: [
      {
        day: { type: Number, min: 0, max: 6 }, // 0 for Sunday, 6 for Saturday
        open: { type: String },
        close: { type: String },
        isClosed: { type: Boolean, default: false },
        displayFormat: {
          type: String,
          // Example: "11 AM - 7 PM" or "Closed"
        },
      },
    ],

    cuisine: [{ type: String }],

    priceRange: {
      type: String,
      enum: ["$", "$$", "$$$", "$$$$"],
      default: "$$",
    },

    // 🔥 Added foodType for Veg / Non-Veg options
    foodType: {
      type: String,
      enum: ["Veg", "Non-Veg", "Both"], // Only allow these values
      required: true,
      default: "Both",
    },

    deliverySettings: {
      isDeliveryAvailable: { type: Boolean, default: true },
      deliveryRadius: { type: Number, default: 5 }, // in km
      minimumOrderAmount: { type: Number, default: 0 },
      deliveryFee: { type: Number, default: 0 },
      estimatedDeliveryTime: { type: Number }, // in minutes
      freeDeliveryThreshold: { type: Number }, // Order amount for free delivery
    },
    pickupSettings: {
      isPickupAvailable: { type: Boolean, default: true },
      estimatedPickupTime: { type: Number }, // in minutes
    },
    paymentOptions: {
      acceptsCash: { type: Boolean, default: true },
      acceptsOnlinePayment: { type: Boolean, default: true },
      acceptsWalletPayment: { type: Boolean, default: false },
    },
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    images: {
      logo: { type: String },
      cover: { type: String },
      gallery: [{ type: String }],
    },
    tags: [{ type: String }], // For search like "Late night", "Family friendly", etc.
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    taxInfo: {
      gstin: { type: String }, // For India
      vatNumber: { type: String },
      panNumber: { type: String },
    },
    bankDetails: {
      accountName: { type: String },
      accountNumber: { type: String },
      ifscCode: { type: String },
      bankName: { type: String },
    },
    commissionRate: { type: Number, default: 15 }, // Platform commission percentage
    packagingCharge: { type: Number, default: 0 },
    preparationTime: { type: Number }, // Average time in minutes
    isOrderingEnabled: { type: Boolean, default: true },
    supportedLanguages: [{ type: String, default: ["English"] }],
  },
  { timestamps: true }
);

// Virtual for getting full address as a string
restaurantSchema.virtual("fullAddress").get(function () {
  const addr = this.address;
  return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}, ${addr.country}`;
});

// Method to check if restaurant is open at given time
restaurantSchema.methods.isOpen = function (date = new Date()) {
  const day = date.getDay();
  const hours = this.businessHours.find((h) => h.day === day);

  if (!hours || hours.isClosed) return false;

  const currentTime = date.getHours() * 60 + date.getMinutes();
  const [openHour, openMinute] = hours.open.split(":").map(Number);
  const [closeHour, closeMinute] = hours.close.split(":").map(Number);

  const openTime = openHour * 60 + openMinute;
  const closeTime = closeHour * 60 + closeMinute;

  return currentTime >= openTime && currentTime <= closeTime;
};

module.exports = mongoose.model("Restaurant", restaurantSchema);
