const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  uniqueId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contact: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  FaName: {
    type: String,
    required: true,
  },
  FaContact: {
    type: String,
    required: true,
  },
  QuestionToSpeaker: { type: String },
  qrCode: {
    type: String,
    required: true,
  },
  barcode: {
    type: String,
    required: true,
  },
  encryptedData: {
    type: String,
    required: true,
  },
  generatedBy: {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
    adminName: {
      type: String,
    },
  },
  registerAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);