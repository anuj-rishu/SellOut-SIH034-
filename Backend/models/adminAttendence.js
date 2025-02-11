const mongoose = require("mongoose");

const adminAttendanceSchema = new mongoose.Schema(
  {
    qrcode: {
      type: String,
      required: true,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
      unique: true,
    },
    adminName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient querying
adminAttendanceSchema.index({ adminId: 1, date: 1 });
adminAttendanceSchema.index({ adminName: 1 });

module.exports = mongoose.model("AdminAttendence", adminAttendanceSchema);