const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String }, 
  museumName: { type: String, required: true },
  museumPincode: { type: String, required: true },
  museumAddress: { type: String, required: true },
  city: { type: String },
  state: { type: String },
  openingHours: { type: String },
  closingHours: { type: String },
  contactEmail: { type: String },
  phoneNumber: { type: String },
  fullAddress: { type: String },
  qrCode: { type: String },
  qrCodeRaw: { type: String },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Booking", bookingSchema);