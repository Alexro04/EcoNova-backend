const mongoose = require("mongoose");

const BookingScheme = new mongoose.Schema(
  {
    arrivalDate: { type: Date, required: true },
    dapartureDate: { type: Date, required: true },
    bookingCost: { type: Number, required: true },
    extraCosts: { type: Number },
    numberOfOccupants: { type: Number, required: true },
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "guests",
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
