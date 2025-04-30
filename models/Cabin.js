const mongoose = require("mongoose");

const CabinSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number },
    maxOccupants: { type: Number, required: true },
    cabinPictures: { type: Array, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("cabins", CabinSchema);
