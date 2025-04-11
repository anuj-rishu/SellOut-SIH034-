const express = require("express");
const { bookMuseumTicket } = require("../controllers/bookingController");
const protect = require("../middleware/authMiddleware");
const bookingRouter = express.Router();

bookingRouter.post("/book", protect, bookMuseumTicket);
router.get("/user", protect, getUserBookings);
router.get("/:id", protect, getBookingById);
router.delete("/:id", protect, cancelBooking);

module.exports = bookingRouter;
