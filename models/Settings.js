const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema({}, { timestamps: true });

module.exports = mongoose.model("settings", SettingsSchema);
