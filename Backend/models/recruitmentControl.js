const mongoose = require("mongoose");

const recruitmentControl = new mongoose.Schema({
  openDate: {
    type: Date,
    required: true,
  },
  closeDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("recruitmentControl", recruitmentControl);
