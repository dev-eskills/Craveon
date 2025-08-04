const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  GST: {
    type: Number,
    required: true,
    default: 5,
  },
});

const Setting = mongoose.model("Setting", settingSchema);

module.exports = Setting;
