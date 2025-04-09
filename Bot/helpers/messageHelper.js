function formatBookingConfirmation(booking, username) {
    return `*Booking Confirmed!* ✅\n\n` +
        `*Museum:* ${booking.museumName}\n` +
        `*Address:* ${booking.museumAddress || booking.fullAddress}\n` +
        `*City:* ${booking.city}, ${booking.state}\n` +
        `*Pincode:* ${booking.museumPincode}\n` +
        `*Hours:* ${booking.openingHours} - ${booking.closingHours}\n` +
        `*Contact:* ${booking.phoneNumber}\n` +
        `*Booking ID:* ${booking._id}\n` +
        `*Booked by:* ${username}\n` +
        `*Date:* ${new Date(booking.createdAt).toLocaleString()}\n\n` +
        `Please show the QR code below at the museum entrance:`;
}

module.exports = {
    formatBookingConfirmation,
};