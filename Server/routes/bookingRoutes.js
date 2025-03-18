const express = require("express");
const { bookMuseumTicket } = require("../controllers/bookingController");
const protect = require("../middleware/authMiddleware");
const bookingRouter = express.Router();


bookingRouter.post("/book", protect, bookMuseumTicket);
module.exports = bookingRouter;
