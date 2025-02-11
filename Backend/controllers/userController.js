const User = require("../models/User");
const Scan = require("../models/Scan");
const QRCode = require("qrcode");
const bwipjs = require("bwip-js");
const { encrypt, decrypt } = require("../utils/encryption");
const { v4: uuidv4 } = require("uuid");
const mailer = require("../utils/mailer");

const userController = {
  //register
  register: async (req, res) => {
    try {
      const { name, email, contact, department, section, FaName, FaContact, QuestionToSpeaker } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already registered with this email",
        });
      }

      const userData = JSON.stringify({ name, email, contact, department, section, FaName, FaContact, QuestionToSpeaker });
      const encryptedData = encrypt(userData);
      
      // Generate a unique identifier
      const uniqueId = uuidv4();
      
      // Generate QR Code
      const qrCode = await QRCode.toDataURL(uniqueId);
      
      // Generate Barcode
      const barcode = await new Promise((resolve, reject) => {
        bwipjs.toBuffer({
          bcid: 'code128',
          text: uniqueId,
          scale: 3,
          height: 10,
          includetext: true,
          textxalign: 'center',
        }, (err, png) => {
          if (err) reject(err);
          else resolve('data:image/png;base64,' + png.toString('base64'));
        });
      });

      const user = new User({
        name,
        email,
        contact,
        department,
        section,
        FaName,
        FaContact,
        QuestionToSpeaker,
        qrCode,
        barcode,
        encryptedData,
        uniqueId,
      });

      await user.save();

      // Send registration confirmation email
      await mailer.sendRegistrationConfirmation(user, qrCode, barcode);

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        qrCode,
        barcode,
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({
        success: false,
        message: "Error registering user",
      });
    }
  },

  //scan
  scan: async (req, res) => {
    const { data } = req.body;
    console.log("Received Data:", data);

    try {
      const user = await User.findOne({ uniqueId: data });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const decryptedData = decrypt(user.encryptedData);
      console.log("Decrypted Data:", decryptedData);
      const userData = JSON.parse(decryptedData);

      const existingScan = await Scan.findOne({ scannedData: decryptedData });
      if (existingScan) {
        console.log("QR code has already been scanned:", decryptedData);
        return res
          .status(400)
          .json({ message: "QR code has already been scanned" });
      }

      const scan = new Scan({
        name: userData.name,
        email: userData.email,
        contact: userData.contact,
        department: userData.department,
        section: userData.section,
        FaName: userData.FaName,
        FaContact: userData.FaContact,
        QuestionToSpeaker: userData.QuestionToSpeaker,
        scannedData: decryptedData,
      });
      await scan.save();

      res.json(userData);
    } catch (error) {
      console.error("Error during scan:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = userController;