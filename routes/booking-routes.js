const express = require("express");
const {
  createBooking,
  getBookings,
  getBooking,
  deleteBooking,
  updateBooking,
  getBookingsBetweenDates,
  getStaysBetweenDates,
} = require("../controllers/bookings-controller");

const router = express.Router();

// routes
router.post("/create", createBooking);
router.post("/update/:bookingId", updateBooking);
router.get("/all-bookings", getBookings);
router.get("/bookings-between-dates", getBookingsBetweenDates);
router.get("/stays-between-dates", getStaysBetweenDates);
router.get("/booking/:bookingId", getBooking);
router.delete("/delete/:bookingId", deleteBooking);

module.exports = router;
