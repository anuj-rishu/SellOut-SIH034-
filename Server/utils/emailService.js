const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const generateBookingEmailHTML = (booking, qrCodeDataURL) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #3498db; text-align: center;">Museum Ticket Booking Confirmation</h2>
      <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
        <p><strong>Booking Reference:</strong> ${booking._id
          .toString()
          .slice(-6)}</p>
        <p><strong>Museum:</strong> ${booking.museumName}</p>
        <p><strong>Date:</strong> ${new Date(
          booking.visitDate
        ).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${booking.visitTime}</p>
        <p><strong>Number of Visitors:</strong> ${booking.numberOfVisitors}</p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <p><strong>Your QR Code:</strong></p>
        <img src="${qrCodeDataURL}" alt="Booking QR Code" style="max-width: 200px; height: auto;"/>
      </div>
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; color: #777; font-size: 12px;">
        <p>Please arrive 15 minutes before your scheduled time.</p>
        <p>For any queries, please contact: <a href="mailto:support@sellout.com">support@sellout.com</a></p>
      </div>
    </div>
  `;
};

const sendBookingConfirmationEmail = async (
  userEmail,
  booking,
  qrCodeDataURL
) => {
  try {
    const mailOptions = {
      from: `"SellOut Bookings" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Booking Confirmation: ${booking.museumName}`,
      html: generateBookingEmailHTML(booking, qrCodeDataURL),
      attachments: [
        {
          filename: "booking-qr.png",
          content: booking.qrCodeRaw,
          encoding: "base64",
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
};

module.exports = {
  sendBookingConfirmationEmail,
};
