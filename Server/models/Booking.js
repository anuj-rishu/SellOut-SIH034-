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
  visitDate: { type: Date, required: true },
  visitTime: { type: String, required: true },
  numberOfVisitors: { type: Number, required: true, default: 1 },
  qrCode: { type: String },
  qrCodeRaw: { type: String },
  createdAt: { type: Date, default: Date.now },
  smsSent: {
    type: Boolean,
    default: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verifiedAt: {
    type: Date,
    default: null,
  },
  
});
module.exports = mongoose.model("Booking", bookingSchema);
