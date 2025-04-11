const Booking = require("../models/Booking");
const QRCode = require("qrcode");
const User = require("../models/User");
const twilio = require('twilio');
const { sendBookingConfirmationEmail } = require('../utils/emailService');

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

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

    // Send confirmation notifications in parallel
    const notificationPromises = [];

    // Send SMS confirmation via Twilio if mobile is available
    if (user.mobile) {
      const smsPromise = (async () => {
        try {
          // Format mobile number (ensure it has country code)
          let mobileNumber = user.mobile;
          if (!mobileNumber.startsWith('+')) {
            // Assuming Indian numbers, add +91 prefix if not present
            mobileNumber = `+91${mobileNumber.replace(/^0/, '')}`;
          }

          // Shortened message to fit within trial limits
          const message = await twilioClient.messages.create({
            body: `Booking confirmed: ${museumName}, ${visitDate}, ${visitTime}, ${numberOfVisitors} visitor(s). Ref: ${booking._id.toString().slice(-6)}`,
            from: twilioPhoneNumber,
            to: mobileNumber
          });

          console.log(`SMS sent successfully. SID: ${message.sid}`);
          booking.smsSent = true;
        } catch (smsError) {
          console.error('Error sending SMS:', smsError);
          // Don't fail the booking if SMS fails
        }
      })();
      notificationPromises.push(smsPromise);
    }

    // Send email confirmation if email is available
    if (user.email) {
      const emailPromise = (async () => {
        try {
          const emailResult = await sendBookingConfirmationEmail(
            user.email,
            booking,
            qrCodeDataURL
          );
          
          if (emailResult.success) {
            console.log(`Email sent successfully to ${user.email}`);
            booking.emailSent = true;
          }
        } catch (emailError) {
          console.error('Error sending email:', emailError);
          // Don't fail the booking if email fails
        }
      })();
      notificationPromises.push(emailPromise);
    }

    // Wait for all notifications to be processed
    await Promise.all(notificationPromises);
    
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

// Rest of your controller methods remain the same
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    
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
      return res.status(403).json({ message: "You are not authorized to view this booking" });
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
      return res.status(403).json({ message: "You are not authorized to cancel this booking" });
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

// Add a new method for resending confirmations
exports.resendConfirmation = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to resend this booking confirmation" });
    }
    
    const user = await User.findById(req.user._id);
    const notifications = [];
    
    // Resend email if requested
    if (req.body.email && user.email) {
      try {
        const emailResult = await sendBookingConfirmationEmail(
          user.email,
          booking,
          booking.qrCode
        );
        
        if (emailResult.success) {
          booking.emailSent = true;
          notifications.push("Email sent successfully");
        }
      } catch (error) {
        console.error("Error resending email:", error);
        notifications.push("Failed to send email");
      }
    }
    
    // Resend SMS if requested
    if (req.body.sms && user.mobile) {
      try {
        let mobileNumber = user.mobile;
        if (!mobileNumber.startsWith('+')) {
          mobileNumber = `+91${mobileNumber.replace(/^0/, '')}`;
        }
        
        const message = await twilioClient.messages.create({
          body: `Booking confirmed: ${booking.museumName}, ${booking.visitDate}, ${booking.visitTime}, ${booking.numberOfVisitors} visitor(s). Ref: ${booking._id.toString().slice(-6)}`,
          from: twilioPhoneNumber,
          to: mobileNumber
        });
        
        booking.smsSent = true;
        notifications.push("SMS sent successfully");
      } catch (error) {
        console.error("Error resending SMS:", error);
        notifications.push("Failed to send SMS");
      }
    }
    
    await booking.save();
    
    res.status(200).json({
      success: true,
      message: "Confirmation resent successfully",
      notifications,
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};