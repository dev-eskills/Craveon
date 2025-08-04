const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true }, // Store image path
  },
  { timestamps: true }
);

const Banner = mongoose.model("Banner", bannerSchema);
module.exports = Banner;
