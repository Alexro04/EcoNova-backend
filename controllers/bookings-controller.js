const Booking = require("../models/Booking");

async function createBooking(req, res) {
  const {
    checkInDate,
    checkOutDate,
    numberOfOccupants,
    bookingCost,
    extraCost,
    guestId,
    cabinId,
  } = req.body;

  try {
    const newBooking = Booking.create({
      checkInDate,
      checkOutDate,
      numberOfOccupants,
      bookingCost,
      extraCost,
      guestId,
      cabinId,
    });

    if (newBooking)
      return res
        .status(201)
        .json({ success: true, message: "Cabin booked successfully" });
    else throw new Error("Error occured while booking cabin");
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function getAllBookings(req, res) {
  try {
    const bookings = await Booking.find();
    if (bookings.length > 0)
      return res.status(200).json({
        success: true,
        message: "All bookings retrived successfully",
        data: bookings,
      });
    else
      return res.status(400).json({
        success: true,
        message: "No Cabin has been booked yet.",
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function getBooking(req, res) {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findOne(bookingId);
    if (booking)
      return res.status(200).json({
        success: true,
        message: "Booking retrived successfully",
        data: booking,
      });
    else
      return res.status(400).json({
        success: true,
        message: "No booking with that Id was found in the database.",
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function deleteBooking(req, res) {
  try {
    const { bookingId } = req.params;
    const deletedBooking = await Booking.findByIdAndDelete(bookingId);
    if (deletedBooking)
      return res.status(200).json({
        success: true,
        message: "No booking with that Id was found in the database.",
      });
    else
      return res.status(400).json({
        success: true,
        message: "No ",
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function updateBooking(req, res) {}

module.exports = {
  createBooking,
  getAllBookings,
  getBooking,
  deleteBooking,
  updateBooking,
};
