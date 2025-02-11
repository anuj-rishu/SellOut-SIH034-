const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    whatsappPhoneNumber: { type: String, required: true },
    yearOfStudy: { type: String, required: true, enum: ["1st", "2nd", "3rd"] },
    domain: {
      type: String,
      required: true,
      enum: [
        "Web Development",
        "Public Relations",
        "Sponsorship",
        "Content and Editorial",
        "Creatives",
        "Media",
      ],
    },
    rating: { type: Number, default: 0 },
    status: { type: String, default: "Remaining" },
    assignedTask: { type: String, },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentTask", userSchema);
