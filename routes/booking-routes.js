const express = require("express");
const {
  createBooking,
  getBookings,
  getBooking,
  deleteBooking,
  updateBooking,
  getBookingsBetweenDates,
  getStaysBetweenDates,
  getTodayActivities,
} = require("../controllers/bookings-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const adminMiddleware = require("../middlewares/admin-middleware");

const router = express.Router();

router.use(authMiddleware);

// routes
router.post("/create", createBooking);
router.post("/update/:bookingId", updateBooking);
router.get("/all-bookings", adminMiddleware, getBookings);
router.get("/bookings-between-dates", adminMiddleware, getBookingsBetweenDates);
router.get("/stays-between-dates", adminMiddleware, getStaysBetweenDates);
router.get("/booking/:bookingId", getBooking);
router.get("/today-activities", adminMiddleware, getTodayActivities);
router.delete("/delete/:bookingId", adminMiddleware, deleteBooking);

module.exports = router;
