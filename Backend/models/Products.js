const mongoose = require("mongoose");
const Restaurant = require("../models/Restaurants");

const productSchema = new mongoose.Schema(
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
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountedPrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    isVeg: {
      type: Boolean,
      required: true,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    preparationTime: {
      type: Number, // in minutes
      default: 15,
    },
    image: {
      type: String,
      required: true,
    },
    attributes: [
      {
        name: { type: String, required: true },
        options: [
          {
            name: { type: String, required: true },
            price: { type: Number, default: 0 },
          },
        ],
      },
    ],
    addons: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        isVeg: { type: Boolean, default: true },
      },
    ],
    tags: [{ type: String }],
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    taxRate: {
      type: Number,
      default: 5, // GST percentage
    },
    packagingCharge: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.pre("save", async function (next) {
  try {
    // Fetch restaurant based on `this.restaurant` (restaurant ID)
    const Restaurant = mongoose.model("Restaurant");
    const restaurant = await Restaurant.findOne({
      owner: this.restaurant,
    }).select("commissionRate");

    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    // Calculate admin commission for new product
    this.discountedPrice = Math.round(
      parseFloat(this.discountedPrice) +
      (parseFloat(this.discountedPrice) * restaurant.commissionRate) / 100
    );

    this.price = Math.round(
      parseFloat(this.price) +
      (parseFloat(this.price) * restaurant.commissionRate) / 100
    );

    if (this.attributes.length > 0) {
      this.attributes.forEach((attribute) => {
        attribute.options.forEach((option) => {
          option.price = Math.round(
            parseFloat(option.price) +
            (parseFloat(option.price) * restaurant.commissionRate) / 100
          );
        });
      });
    }

    next();
  } catch (error) {
    next(error);
  }
});

productSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this.getUpdate();

    if (!update.$set || !update.$set.discountedPrice) {
      return next(); // If there's no discountedPrice update, skip
    }

    const product = await this.model
      .findOne(this.getQuery())
      .select("restaurant discountedPrice");

    if (!product) {
      console.error("Product not found");
      return next();
    }

    // If the price is not changing, skip commission calculation
    if (
      parseFloat(update.$set.discountedPrice) ===
      parseFloat(product.discountedPrice)
    ) {
      return next();
    }

    const Restaurant = mongoose.model("Restaurant");
    const restaurant = await Restaurant.findOne({
      owner: product.restaurant,
    }).select("commissionRate");

    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    // Calculate admin commission if the price has changed
    const newDiscountedPrice = Math.round(
      parseFloat(update.$set.discountedPrice) +
      (parseFloat(update.$set.discountedPrice) * restaurant.commissionRate) /
      100
    );

    const newPrice = Math.round(
      parseFloat(update.$set.price) +
      (parseFloat(update.$set.price) * restaurant.commissionRate) / 100
    );

    // Update the discountedPrice field
    update.$set.discountedPrice = newDiscountedPrice;
    // Update the price field
    update.$set.price = newPrice;

    update.$set.attributes.forEach((attribute) => {
      attribute.options.forEach((option) => {
        option.price = Math.round(
          parseFloat(option.price) +
          (parseFloat(option.price) * restaurant.commissionRate) / 100
        );
      });
    });

    next();
  } catch (error) {
    next(error); // Pass error to Mongoose
  }
});

// ✅ Method to check if the product is orderable
productSchema.methods.isOrderable = function (date = new Date()) {
  if (!this.restaurant || !this.isAvailable) return false;
  return this.restaurant.isOpen(date) && this.restaurant.isOrderingEnabled;
};

// ✅ Middleware to automatically trim all string fields
productSchema.pre("save", function (next) {
  for (const key in this._doc) {
    if (typeof this[key] === "string") {
      this[key] = this[key].trim();
    }
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
