const TicketCount = require("../models/TicketCount");
const { encrypt } = require("../utils/encryption");
const User = require("../models/User");
const QRCode = require("qrcode");
const mailer = require("../utils/mailer");
const { emailValidator } = require("../helper/emailValidator");

const adminTicketController = {
  genrateticket: async (req, res) => {
    try {
      const { name, email } = req.body;
      const adminId = req.user._id;
      const adminName = req.user.name;


        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "User already registered with this email",
          });
        }

      const userData = JSON.stringify({ name, email });
      const encryptedData = encrypt(userData);

      const qrCode = await QRCode.toDataURL(encryptedData);

      const user = new User({
        name,
        email,
        qrCode,
        encryptedData,
        generatedBy: {
          adminId,
          adminName,
        },
      });
      await user.save();

      // Update or create ticket count
      await TicketCount.findOneAndUpdate(
        { adminId },
        {
          $inc: { ticketsGenerated: 1 },
          $setOnInsert: { adminName },
        },
        { upsert: true, new: true }
      );

      await mailer.sendTicketEmail(name, email, qrCode);

      res.json({
        message: "Ticket generated and sent successfully",
        success: true,
        generatedBy: adminName,
      });
    } catch (error) {
      console.error("Error:", error);
      res
        .status(500)
        .json({ message: "Error generating ticket", success: false });
    }
  },

  getStats: async (req, res) => {
    try {
      const adminId = req.user._id;
      const stats = await TicketCount.findOne({ adminId }).select(
        "adminName ticketsGenerated"
      );
      res.json(stats || { adminName: req.user.name, ticketsGenerated: 0 });
    } catch (error) {
      res.status(500).json({ message: "Error fetching stats" });
    }
  },
};

module.exports = adminTicketController;
