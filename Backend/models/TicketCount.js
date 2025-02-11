const mongoose = require("mongoose");

const ticketCountSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    adminName: {
      type: String,
      required: true,
    },
    ticketsGenerated: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TicketCount", ticketCountSchema);
