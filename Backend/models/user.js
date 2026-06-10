const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, default: 'India' },
  label: { type: String, default: 'home' },
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
      trim: true,
      lowercase: true,
      sparse: true, // allows multiple users without email
    },
    password: {
      type: String,
      required: [true, 'Please Enter Your Password'],
    },
    number: {
      type: String,
      required: [true, 'Please Enter Your Valid Mobile Number'],
      trim: true,
      // ✅ No unique/index here — defined explicitly below
    },
    addresses: {
      type: [addressSchema],
      default: [],
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'restaurant', 'delivery'],
      default: 'user',
    },
    token: { type: String },
    refreshToken: { type: String },
  },
  {
    timestamps: true,
    autoIndex: process.env.NODE_ENV !== 'production', // ✅ never autoIndex in prod
  }
);

// ✅ Explicit, named, intentional index — full control, no surprises
userSchema.index(
  { number: 1 },
  {
    unique: true,
    sparse: true, // skip docs where number is null/missing
    name: 'idx_users_number_unique', // explicit name = no auto-generated conflicts
  }
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
