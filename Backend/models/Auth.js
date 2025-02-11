const mongoose = require("mongoose");

const { ALLOWED_DOMAINS, ALLOWED_ROLES } = require("../config/constants");

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
    adminId: {
      type: String,
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
    linkedinProfile: {
      type: String,
      default: "",
    },
    githubProfile: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxLength: 500,
      default: "",
    },
    joinedDate: {
      type: Date,
      default: Date.now,
    },
    domain: {
      name: {
        type: String,
        enum: ALLOWED_DOMAINS,
        required: true,
      },
      role: {
        type: String,
        enum: ALLOWED_ROLES,
        default: "Member",
      },
    },
    otp: {
      code: String,
      expiry: {
        type: Date,
        default: function () {
          return new Date(Date.now() + 5 * 60 * 1000);
        },
      },
    },
  },
  { timestamps: true }
);

AuthSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const name = this.name.split(" ");
      const firstLetter = name[0][0]
        .replace(/[^a-zA-Z0-9]/g, "E")
        .toUpperCase();
      const lastLetter = name[name.length - 1][name[name.length - 1].length - 1]
        .replace(/[^a-zA-Z0-9]/g, "E")
        .toUpperCase();
      const year = new Date().getFullYear().toString().slice(-2);
      const domain = this.domain.name
        .replace(/[^a-zA-Z0-9]/g, "E")
        .slice(0, 2)
        .toUpperCase();

      const count = await mongoose.model("Auth").countDocuments({
        "domain.name": this.domain.name,
        joinedDate: {
          $gte: new Date(new Date().getFullYear(), 0, 1),
          $lte: new Date(new Date().getFullYear(), 11, 31),
        },
      });

      const serialNumber = (count + 1).toString().padStart(3, "0");

      this.adminId = `EC${year}${firstLetter}${lastLetter}${domain}${serialNumber}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});
module.exports = mongoose.model("Auth", AuthSchema);
