const twilio = require("twilio");
const { sendBookingConfirmationEmail } = require("./emailService");

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

/**
 * Format phone number with country code
 * @param {string} phoneNumber - Phone number to format
 * @returns {string} - Formatted phone number with country code
 */
const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return null;

  phoneNumber = phoneNumber.replace(/\s+/g, "");

  if (phoneNumber.startsWith("+")) {
    return phoneNumber;
  }

  phoneNumber = phoneNumber.replace(/^0+/, "");

  return `+91${phoneNumber}`;
};

/**
 * Send SMS notification for booking
 * @param {string} phoneNumber - Recipient's phone number
 * @param {Object} booking - Booking details
 * @returns {Promise<Object>} - Result of the SMS sending operation
 */
const sendBookingSMS = async (phoneNumber, booking) => {
  try {
    const formattedNumber = formatPhoneNumber(phoneNumber);

    if (!formattedNumber) {
      return { success: false, error: "Invalid phone number" };
    }

    const message = await twilioClient.messages.create({
      body: `Booking confirmed: ${booking.museumName}, ${booking.visitDate}, ${
        booking.visitTime
      }, ${booking.numberOfVisitors} visitor(s). Ref: ${booking._id
        .toString()
        .slice(-6)}`,
      from: twilioPhoneNumber,
      to: formattedNumber,
    });

    console.log(`SMS sent successfully. SID: ${message.sid}`);
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error("Error sending SMS:", error);
    return { success: false, error };
  }
};

/**
 * Send notifications (SMS and Email) for a new booking
 * @param {Object} user - User details
 * @param {Object} booking - Booking details
 * @param {string} qrCodeDataURL - QR code data URL
 * @returns {Promise<Object>} - Notification results
 */
const sendBookingNotifications = async (user, booking, qrCodeDataURL) => {
  const notificationPromises = [];
  const results = { sms: null, email: null };

  if (user.mobile) {
    const smsPromise = (async () => {
      const smsResult = await sendBookingSMS(user.mobile, booking);
      results.sms = smsResult;
      if (smsResult.success) {
        booking.smsSent = true;
      }
    })();
    notificationPromises.push(smsPromise);
  }

  if (user.email) {
    const emailPromise = (async () => {
      try {
        const emailResult = await sendBookingConfirmationEmail(
          user.email,
          booking,
          qrCodeDataURL
        );

        results.email = emailResult;
        if (emailResult.success) {
          console.log(`Email sent successfully to ${user.email}`);
          booking.emailSent = true;
        }
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        results.email = { success: false, error: emailError };
      }
    })();
    notificationPromises.push(emailPromise);
  }

  await Promise.all(notificationPromises);

  return results;
};

/**
 * Resend booking notifications
 * @param {Object} user - User details
 * @param {Object} booking - Booking details
 * @param {Object} options - Options for which notifications to send
 * @returns {Promise<Object>} - Notification results
 */
const resendBookingNotifications = async (
  user,
  booking,
  options = { sms: true, email: true }
) => {
  const results = { sms: null, email: null, notifications: [] };

  if (options.email && user.email) {
    try {
      const emailResult = await sendBookingConfirmationEmail(
        user.email,
        booking,
        booking.qrCode
      );

      results.email = emailResult;
      if (emailResult.success) {
        booking.emailSent = true;
        results.notifications.push("Email sent successfully");
      }
    } catch (error) {
      console.error("Error resending email:", error);
      results.notifications.push("Failed to send email");
      results.email = { success: false, error };
    }
  }

  if (options.sms && user.mobile) {
    const smsResult = await sendBookingSMS(user.mobile, booking);
    results.sms = smsResult;

    if (smsResult.success) {
      booking.smsSent = true;
      results.notifications.push("SMS sent successfully");
    } else {
      results.notifications.push("Failed to send SMS");
    }
  }

  return results;
};

module.exports = {
  formatPhoneNumber,
  sendBookingSMS,
  sendBookingNotifications,
  resendBookingNotifications,
};
