const mongoose = require("mongoose");

const MuseumSchema = new mongoose.Schema(
  {
    MuseumName: {
      type: String,
      required: true,
    },
    MuseumDes: {
      type: String,
      required: true,
    },
    MuseumLocation: {
      type: String,
      required: true,
    },

    MuseumPhone: {
      type: String,
      required: true,
    },
    MuseumWebsite: {
      type: String,
      required: true,
    },
    MuseumTicketPrice: {
      type: String,
      required: true,
    },

    MuseumThumbnail: {
      type: String,
      default: "",
    },

    MuseumThumbnail2: {
      type: String,
      default: "",
    },

    MuseumOpenDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Museum", MuseumSchema);
