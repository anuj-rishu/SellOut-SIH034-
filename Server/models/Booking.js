const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  museumName: { type: String, required: true },
  museumPincode: { type: String, required: true },
  museumAddress: { type: String, required: true },
  qrCode: { type: String },
  qrCodeRaw: { type: String },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Booking", bookingSchema);
