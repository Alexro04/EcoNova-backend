const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema(
  {
    minNightsPerBooking: { type: Number, required: true },
    maxNightsPerBooking: { type: Number, required: true },
    bookingWindow: { type: Number, required: true },
    breakfastPrice: { type: Number, required: true },
    bookingLimit: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("settings", SettingsSchema);
