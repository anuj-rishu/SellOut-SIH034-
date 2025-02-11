const mongoose = require("mongoose");

const scanSchema = new mongoose.Schema({
  scanId: String,
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
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
  QuestionToSpeaker: {
    type: String,
  },
  scannedData: String,
  scannedAt: {
    type: Date,
    default: Date.now,
  },
  certificateUrl: String,
  deleteToken: String,
});

function generateScanId(name, scannedAt) {
  const year = scannedAt.getFullYear().toString().slice(-2);
  const month = (scannedAt.getMonth() + 1).toString().padStart(2, "0");
  const day = scannedAt.getDate().toString().padStart(2, "0");
  const nameInitial = name.charAt(0).toUpperCase();
  const time = scannedAt.toTimeString().split(" ")[0].replace(/:/g, "");

  return `ECS${year}${day}${month}${nameInitial}${time}`;
}

scanSchema.pre("save", function (next) {
  if (!this.scanId) {
    this.scanId = generateScanId(this.name, this.scannedAt);
  }
  next();
});

module.exports = mongoose.model("Scan", scanSchema);
