const Settings = require("../models/Settings");

async function getSettings(req, res) {
  try {
    const settings = await Settings.findOne();
    if (settings)
      return res.status(200).json({
        success: true,
        message: "Settings loaded successfully",
        data: settings,
      });
    else throw new Error("Setting could not be loaded");
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function createSettings(req, res) {
  const {
    minNightsPerBooking,
    maxNightsPerBooking,
    bookingWindow,
    breakfastPrice,
    bookingLimit,
  } = req.body;

  const existingSetting = await Settings.find();
  if (existingSetting.length > 0)
    return res.status(400).json({
      success: false,
      message: "There can only be one enty in this field",
    });

  try {
    const settings = await Settings.create({
      minNightsPerBooking,
      maxNightsPerBooking,
      bookingWindow,
      breakfastPrice,
      bookingLimit,
    });
    if (settings)
      return res.status(201).json({
        success: true,
        message: "Settings created successfully",
      });
    else throw new Error("Setting could noy be created");
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function updateSettings(req, res) {
  try {
    const settings = await Settings.findOne();
    const {
      minNightsPerBooking = null,
      maxNightsPerBooking = null,
      bookingWindow = null,
      bookingLimit = null,
      breakfastPrice = null,
    } = req.body;
    if (!settings)
      return res.status(400).json({
        success: false,
        message: "No setting is stored in the database",
      });

    if (minNightsPerBooking) settings.minNightsPerBooking = minNightsPerBooking;
    if (maxNightsPerBooking) settings.maxNightsPerBooking = maxNightsPerBooking;
    if (bookingWindow) settings.bookingWindow = bookingWindow;
    if (bookingLimit) settings.bookingLimit = bookingLimit;
    if (breakfastPrice) settings.breakfastPrice = breakfastPrice;

    await settings.save();
    return res.status(200).json({
      success: true,
      message: "Settings updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { getSettings, createSettings, updateSettings };
