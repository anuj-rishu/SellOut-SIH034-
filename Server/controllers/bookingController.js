const Booking = require("../models/Booking");
const QRCode = require("qrcode");
const User = require("../models/User");
const {
  sendBookingNotifications,
  resendBookingNotifications,
} = require("../utils/messagingService");

exports.bookMuseumTicket = async (req, res) => {
  const {
    museumName,
    museumPincode,
    museumAddress,
    city,
    state,
    openingHours,
    closingHours,
    contactEmail,
    phoneNumber,
    fullAddress,
    visitDate,
    visitTime,
    numberOfVisitors,
  } = req.body;

  try {
    // Get user information
    const user = await User.findById(req.user._id);

    const booking = await Booking.create({
      user: req.user._id,
      username: user.name,
      museumName,
      museumPincode,
      museumAddress,
      city,
      state,
      openingHours,
      closingHours,
      contactEmail,
      phoneNumber,
      fullAddress,
      visitDate,
      visitTime,
      numberOfVisitors: numberOfVisitors || 1,
    });

    const qrData = JSON.stringify({
      bookingId: booking._id.toString(),
      museumName,
      museumPincode,
      userId: req.user._id.toString(),
      username: user.name,
      visitDate,
      visitTime,
      numberOfVisitors: numberOfVisitors || 1,
      timestamp: new Date(),
    });

    const qrCodeDataURL = await QRCode.toDataURL(qrData);

    const base64Data = qrCodeDataURL.split(",")[1];

    booking.qrCode = qrCodeDataURL;
    booking.qrCodeRaw = base64Data;
    await booking.save();

    // Send notifications using our messaging service
    await sendBookingNotifications(user, booking, qrCodeDataURL);

    // Save the notification status
    await booking.save();

    res.status(201).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this booking" });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to cancel this booking" });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.verified = true;
    booking.verifiedAt = Date.now();
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking verified successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resendConfirmation = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({
          message: "You are not authorized to resend this booking confirmation",
        });
    }

    const user = await User.findById(req.user._id);

    const notificationResults = await resendBookingNotifications(
      user,
      booking,
      {
        sms: req.body.sms === true,
        email: req.body.email === true,
      }
    );

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Confirmation resent successfully",
      notifications: notificationResults.notifications,
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
