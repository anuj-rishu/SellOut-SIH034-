const Booking = require("../models/Booking");
const QRCode = require("qrcode");

exports.bookMuseumTicket = async (req, res) => {
  const { museumName, museumPincode, museumAddress } = req.body;
  try {
    const booking = await Booking.create({
      user: req.user._id,
      museumName,
      museumPincode,
      museumAddress,
    });

    const qrData = JSON.stringify({
      bookingId: booking._id.toString(),
      museumName,
      museumPincode,
      userId: req.user._id.toString(),
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
