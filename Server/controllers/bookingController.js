const Booking = require("../models/Booking");
const QRCode = require("qrcode");
const User = require("../models/User");

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

    res.status(201).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};