const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["guest", "user", "admin", "super-admin"],
      required: true,
    },
    nationality: { type: String, required: true },
    nationalId: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    password: { type: String, required: () => this.role === "guest" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", UserSchema);
