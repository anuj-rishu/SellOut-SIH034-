const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String,
      default: "",
    },

    joinedDate: {
      type: Date,
      default: Date.now,
    },

    otp: {
      code: String,
      expiry: {
        type: Date,
        default: function () {
          return new Date(Date.now() + 5 * 60 * 1000); // 5 minutes in milliseconds
        },
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Auth", AuthSchema);
