const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    nationality: { type: String },
    phoneNumber: { type: Number },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", UserSchema);
