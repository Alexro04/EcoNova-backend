const express = require("express");
const {
  createBooking,
  getAllBookings,
  getBooking,
  deleteBooking,
  updateBooking,
} = require("../controllers/bookings-controller");

const router = express.Router();

// routes
router.post("/create", createBooking);
router.post("/update/:bookingId", updateBooking);
router.get("/all-bookings", getAllBookings);
router.get("/booking/:bookingId", getBooking);
router.delete("/delete/:bookingId", deleteBooking);

module.exports = router;
