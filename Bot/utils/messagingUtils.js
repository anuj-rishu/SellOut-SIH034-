const { MessageMedia } = require("whatsapp-web.js");
const client = require("../client");

class MessagingUtils {
  async sendBookingConfirmation(message, booking) {
    let responseMessage =
      `*Booking Confirmed!* ✅\n\n` +
      `*Museum:* ${booking.museumName}\n` +
      `*Address:* ${booking.museumAddress || booking.fullAddress}\n` +
      `*City:* ${booking.city}, ${booking.state}\n` +
      `*Pincode:* ${booking.museumPincode}\n` +
      `*Hours:* ${booking.openingHours} - ${booking.closingHours}\n` +
      `*Contact:* ${booking.phoneNumber}\n` +
      `*Booking ID:* ${booking._id}\n` +
      `*Date:* ${new Date(booking.createdAt).toLocaleString()}\n\n` +
      `Please show the QR code below at the museum entrance:`;

    await message.reply(responseMessage);

    if (booking.qrCode) {
      const media = new MessageMedia(
        "image/png",
        booking.qrCode.split(",")[1],
        "museum_ticket_qr.png"
      );

      await client.sendMessage(message.from, media, {
        caption: "Your ticket QR code"
      });
    }
  }
}

module.exports = new MessagingUtils();