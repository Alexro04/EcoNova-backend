const Booking = require("../models/Booking");

async function createBooking(req, res) {
  const {
    checkInDate,
    checkOutDate,
    numGuests,
    bookingCost,
    extraCost = 0,
    guestId,
    cabinId,
    status,
    hasPaid,
  } = req.body;

  try {
    const newBooking = await Booking.create({
      checkInDate,
      checkOutDate,
      numGuests,
      bookingCost,
      extraCost,
      guestId,
      cabinId,
      status,
      hasPaid,
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

async function getBookings(req, res) {
  // filtering by status
  const status = req.query.status;

  //sorting
  const sortBy = req.query.sortBy || "bookingCost";
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
  const sortObj = {};
  sortObj[sortBy] = sortOrder;

  //pagination
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;
  const count = await Booking.countDocuments(status ? { status } : {});

  try {
    const bookings = await Booking.find(status ? { status } : {})
      .populate({
        path: "guestId",
        select: "fullname email",
      })
      .populate({ path: "cabinId", select: "name" })
      .sort(sortObj)
      .limit(limit)
      .skip(skip);

    if (bookings.length > 0)
      return res.status(200).json({
        success: true,
        message: "All bookings retrived successfully",
        data: bookings,
        count,
      });
    else
      return res.status(204).json({
        success: true,
        message: "No data",
        data: [],
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function getBookingsBetweenDates(req, res) {
  const { beforeDate, afterDate } = req.query;

  const bookings = await Booking.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(afterDate),
          $lt: new Date(beforeDate),
        },
      },
    },
  ]);

  if (bookings)
    return res.status(200).json({
      success: true,
      message: "Booking retrived successfully",
      data: bookings,
    });
  else
    return res.status(204).json({
      success: true,
      message: "No booking with that Id was found in the database.",
    });
}

async function getStaysBetweenDates(req, res) {
  const { beforeDate, afterDate } = req.query;

  const bookings = await Booking.aggregate([
    {
      $match: {
        checkInDate: {
          $gte: new Date(afterDate),
          $lt: new Date(beforeDate),
        },
      },
    },
  ]);
  if (bookings)
    return res.status(200).json({
      success: true,
      message: "Booking retrived successfully",
      data: bookings,
    });
  else
    return res.status(204).json({
      success: true,
      message: "No booking with that Id was found in the database.",
    });
}

async function getBooking(req, res) {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId)
      .populate({ path: "guestId", select: "fullname email" })
      .populate({ path: "cabinId", select: "name" });
    if (booking)
      return res.status(200).json({
        success: true,
        message: "Booking retrived successfully",
        data: booking,
      });
    else
      return res.status(204).json({
        success: true,
        message: "No booking with that Id was found in the database.",
        data: [],
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
        message: "Booking deleted successfully",
      });
    else
      return res.status(400).json({
        success: false,
        message: "No booking with that Id was found in the database.",
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function updateBooking(req, res) {
  try {
    const { bookingId } = req.params;
    const {
      checkInDate,
      checkOutDate,
      numGuests,
      bookingCost,
      extraCost,
      status,
      hasPaid,
    } = req.body;

    //check if cabin exists
    const booking = await Booking.findById(bookingId);
    if (!booking)
      return res.status(204).json({
        success: true,
        message: `Cabin with the id-${cabinId} does not exist.`,
      });

    // if booking exists, update the values
    if (status) booking.status = status;
    if (checkInDate) booking.checkInDate = checkInDate;
    if (checkOutDate) booking.checkOutDate = checkOutDate;
    if (bookingCost) booking.bookingCost = bookingCost;
    if (numGuests) booking.numGuests = numGuests;
    if (extraCost) booking.extraCost = extraCost;
    if (hasPaid) booking.hasPaid = hasPaid;

    await booking.save();
    return res.status(200).json({
      success: true,
      message: `Cabin with id-${bookingId} updated successfully`,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message}`,
    });
  }
}

module.exports = {
  createBooking,
  getBookings,
  getBooking,
  getBookingsBetweenDates,
  getStaysBetweenDates,
  deleteBooking,
  updateBooking,
};
