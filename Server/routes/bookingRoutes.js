const express = require("express");
const { bookMuseumTicket, getUserBookings, getBookingById,cancelBooking } = require("../controllers/bookingController");
const protect = require("../middleware/authMiddleware");
const bookingRouter = express.Router();

bookingRouter.post("/book", protect, bookMuseumTicket);
bookingRouter.get("/user", protect, getUserBookings);
bookingRouter.get("/:id", protect, getBookingById);
bookingRouter.delete("/:id", protect, cancelBooking);

module.exports = bookingRouter;
