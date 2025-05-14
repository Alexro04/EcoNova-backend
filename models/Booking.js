const mongoose = require("mongoose");

const BookingScheme = new mongoose.Schema(
  {
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    bookingCost: { type: Number, required: true },
    status: { type: String, required: true },
    extraCosts: { type: Number },
    numGuests: { type: Number, required: true },
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    cabinId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cabins",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("bookings", BookingScheme);
