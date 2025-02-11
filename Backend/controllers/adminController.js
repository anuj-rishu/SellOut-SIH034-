require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AuthSchema = require("../models/Auth");
const adminAttendence = require("../models/adminAttendence");
const generateOTP = require("../utils/otpGenerator");
const { ALLOWED_DOMAINS, ALLOWED_ROLES } = require("../config/constants");
const mongoose = require("mongoose");
const mailer = require("../utils/mailer");
const useragent = require("express-useragent");
const { emailValidator } = require("../helper/emailValidator");
const cloudinary = require("../config/cloudinary");
const { json } = require("body-parser");

const adminController = {
  //admin register
  AdmiRegistration: async (req, res) => {
    const {
      name,
      email,
      password,
      domainName,
      domainRole = "Member",
    } = req.body;

    try {
      // Check if the user already exists
      if (!emailValidator(email)) {
        return res.status(400).json({
          success: false,
          message: "Please use your SRM email address (@srmist.edu.in)",
        });
      }

      const existingUser = await AuthSchema.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      if (!ALLOWED_DOMAINS.includes(domainName)) {
        return res.status(400).json({ message: "Invalid domain name" });
      }

      if (!ALLOWED_ROLES.includes(domainRole)) {
        return res.status(400).json({ message: "Invalid domain role" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new AuthSchema({
        name,
        email,
        password: hashedPassword,
        domain: {
          name: domainName,
          role: domainRole,
        },
      });

      // Save the user to the database
      await newUser.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error", error: err.message });
    }
  },

  //admin login
  AdminLogin: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await AuthSchema.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        const ip = req.ip || req.connection.remoteAddress;
        const userAgent = useragent.parse(req.headers["user-agent"]);
        const deviceInfo = `${userAgent.browser} on ${userAgent.os}`;

        try {
          await mailer.invaildCredentialsMail(email, ip, deviceInfo);
          return res.status(400).json({ message: "Invalid credentials" });
        } catch (mailError) {
          console.error("Failed to send invalid credentials email:", mailError);
          return res.status(400).json({ message: "Invalid credentials" });
        }
      }

      // On successful login, send welcome email
      const ip = req.ip || req.connection.remoteAddress;
      const userAgent = useragent.parse(req.headers["user-agent"]);
      const deviceInfo = `${userAgent.browser} on ${userAgent.os}`;

      try {
        await mailer.loginSuccessMail(email, ip, deviceInfo);
      } catch (mailError) {
        console.error("Failed to send login success email:", mailError);
      }

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || "secretkey",
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          email: user.email,
        },
      });
    } catch (err) {
      console.error("Server error:", err);
      res.status(500).json({ message: "Server Error", error: err.message });
    }
  },

  //admin forget password
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      // Find user
      const user = await AuthSchema.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate OTP
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Save OTP to user document
      user.otp = {
        code: otp,
        expiry: otpExpiry,
      };
      await user.save();

      // Send OTP via email
      await mailer.sendPasswordResetOTP(email, otp);

      res.json({
        message: "Password reset OTP has been sent to your email",
        email: email,
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },

  //admin verify and reset password
  verifyOTPAndResetPassword: async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;

      // Validate input
      if (!email || !otp || !newPassword) {
        return res.status(400).json({
          message: "Email, OTP and new password are required",
        });
      }

      // Find user
      const user = await AuthSchema.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify OTP
      if (!user.otp || user.otp.code !== otp || user.otp.expiry < new Date()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password and clear OTP
      user.password = hashedPassword;
      user.otp = undefined;
      await user.save();

      res.json({ message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },

  //admin name update
  updateAdminName: async (req, res) => {
    try {
      const { name } = req.body;
      await AuthSchema.findByIdAndUpdate(req.user._id, { name });
      res.json({ message: "Name updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //admin profile photo update
  updateProfilePhoto: async (req, res) => {
    try {
      const { file } = req;
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const result = await cloudinary.uploader.upload(file.path, {
        folder: "profile_photos",
      });

      const user = await AuthSchema.findByIdAndUpdate(
        req.user._id,
        { profilePhoto: result.secure_url },
        { new: true }
      ).select("-password -otp");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "Profile photo updated successfully",
        user,
      });
    } catch (error) {
      console.error("Error updating profile photo:", error);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  },

  //admin social url
  updateSocialProfiles: async (req, res) => {
    try {
      const { linkedinProfile, githubProfile } = req.body;

      const updateFields = {};
      if (linkedinProfile) updateFields.linkedinProfile = linkedinProfile;
      if (githubProfile) updateFields.githubProfile = githubProfile;

      const updatedUser = await AuthSchema.findByIdAndUpdate(
        req.user._id,
        updateFields,
        { new: true }
      ).select("-password -otp");

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Social profiles updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

//update bio
  
  updateAdminBio: async (req, res) => {
    try {
      const { bio } = req.body;
      const userId = req.user?._id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      if (!bio || typeof bio !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Bio must be a valid string'
        });
      }

      if (bio.length > 500) {
        return res.status(400).json({
          success: false,
          message: 'Bio cannot exceed 500 characters'
        });
      }
      
      const updatedUser = await AuthSchema.findByIdAndUpdate(
        userId,
        { bio },
        { new: true }
      ).select('-password -otp');

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Bio updated successfully',
        data: updatedUser
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },




  //admin passwordchnage otp update
  updateAdminPasswordOtp: async (req, res) => {
    try {
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await AuthSchema.findByIdAndUpdate(req.user._id, {
        otp: { code: otp, expiry: otpExpiry },
      });

      await mailer.sendPasswordChangeOTP(req.user.email, otp);
      res.json({ message: "OTP sent successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //admin password change
  updateAdminPassword: async (req, res) => {
    try {
      const { currentPassword, newPassword, otp } = req.body;
      const user = await AuthSchema.findById(req.user._id);

      if (!user.otp || user.otp.code !== otp || user.otp.expiry < new Date()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.otp = undefined;
      await user.save();
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //admin email otp update
  updateAdminEmailOtp: async (req, res) => {
    try {
      const { newEmail } = req.body;
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

      await AuthSchema.findByIdAndUpdate(req.user._id, {
        otp: { code: otp, expiry: otpExpiry },
      });

      await mailer.sendEmailChangeOTP(newEmail, otp);

      res.json({ message: "OTP sent successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //admin email update
  updateAdminEmail: async (req, res) => {
    try {
      const { newEmail, otp } = req.body;
      const user = await AuthSchema.findById(req.user._id);

      if (!user.otp || user.otp.code !== otp || user.otp.expiry < new Date()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      user.email = newEmail;
      user.otp = undefined;
      await user.save();

      res.json({ message: "Email updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //admin domain update
  updateAdminDomain: async (req, res) => {
    try {
      const { domain } = req.body;

      // Validate domain object structure
      if (!domain || typeof domain !== "object") {
        return res.status(400).json({ message: "Invalid domain data format" });
      }

      // Validate required fields
      if (!domain.name || !domain.role) {
        return res
          .status(400)
          .json({ message: "Domain name and role are required" });
      }

      // Validate domain name and role
      if (!ALLOWED_DOMAINS.includes(domain.name)) {
        return res.status(400).json({ message: "Invalid domain name" });
      }
      if (!ALLOWED_ROLES.includes(domain.role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      // Update user's domain information
      const updatedUser = await AuthSchema.findByIdAndUpdate(
        req.user._id,
        { domain },
        { new: true, runValidators: true }
      ).select("-password -otp");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "Domain details updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error updating domain:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  //admin profile
  getAdminProfile: async (req, res) => {
    try {
      const user = await AuthSchema.findById(req.user._id).select(
        "-password -otp"
      ); // Exclude sensitive data

      if (!user) {
        return res.status(404).json({ message: "Admin not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update user domain and role
  updateAdminDomain: async (req, res) => {
    try {
      const { id } = req.params;
      const { domain, role } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }

      const updatedUser = await AuthSchema.findByIdAndUpdate(
        id,
        {
          $set: {
            "domain.name": domain,
            "domain.role": role,
          },
        },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        success: true,
        user: updatedUser,
      });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },

  addNewMember: async (req, res) => {
    try {
      const { name, email, domain, role } = req.body;

      // Validate domain and role
      if (
        !ALLOWED_DOMAINS.includes(domain) ||
        (role && !ALLOWED_ROLES.includes(role))
      ) {
        return res.status(400).json({ message: "Invalid domain or role" });
      }

      // Check if user already exists
      const existingUser = await AuthSchema.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Generate a temporary password
      const tempPassword = Math.random().toString(36).slice(-8);

      // Hash the temporary password
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      // Create a new user
      const newUser = new AuthSchema({
        name,
        email,
        password: hashedPassword,
        domain: {
          name: domain,
          role: role || "Member", // Default to "Member" if no role is provided
        },
      });

      await newUser.save();

      // Send welcome email
      try {
        await mailer.sendNewMemberWelcome(
          name,
          email,
          domain,
          role || "Member",
          tempPassword
        );

        res.status(201).json({
          message: "New member added successfully and welcome email sent",
          user: { name, email, domain, role: role || "Member" },
          tempPassword,
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        res.status(201).json({
          message: "New member added successfully but welcome email failed",
          user: { name, email, domain, role: role || "Member" },
          tempPassword,
          emailError: "Failed to send welcome email",
        });
      }
    } catch (error) {
      console.error("Member creation failed:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },
  //get all member
  getAllMember: async (req, res) => {
    try {
      const users = await AuthSchema.find({}, "-password");
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // DELETE route to remove members
  deleteMember: async (req, res) => {
    try {
      const { id } = req.params;

      // Check if member exists
      const member = await AuthSchema.findById(id);
      if (!member) {
        return res.status(404).json({
          success: false,
          message: "Member not found",
        });
      }

      // Delete the member
      await AuthSchema.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: "Member deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  },

  //to get the profile usinf admin id
  getAdminProfileById: async (req, res) => {
    try {
      const { adminId } = req.params;
      const admin = await AuthSchema.findOne({ adminId }).select(
        "-password -otp"
      );
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }
      res.status(200).json({
        success: true,
        data: admin,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.massage,
      });
    }
  },

  //admin attendance
  adminAttendence: async (req, res) => {
    try {
      const { qrcode } = req.body;
      const cooldownPeriod = 5000;

      // Check if admin exists and get name
      const adminExists = await AuthSchema.findOne({ adminId: qrcode }).select(
        "_id adminId name"
      );
      if (!adminExists) {
        return res.status(404).json({
          success: false,
          message: "Admin ID not found in database",
        });
      }

      // Check for recent scans
      const recentScan = await adminAttendence.findOne({
        adminId: adminExists._id,
        timestamp: {
          $gte: new Date(Date.now() - cooldownPeriod),
        },
      });

      if (recentScan) {
        return res.status(429).json({
          success: false,
          message: "Please wait before scanning again",
        });
      }

      // Check for today's attendance
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const existingAttendance = await adminAttendence.findOne({
        adminId: adminExists._id,
        timestamp: {
          $gte: today,
          $lt: tomorrow,
        },
      });

      if (existingAttendance) {
        return res.status(400).json({
          success: false,
          message: "Attendance already marked for today",
        });
      }

      // Create new attendance with admin name
      const newAttendance = new adminAttendence({
        qrcode,
        adminId: adminExists._id,
        adminName: adminExists.name,
        timestamp: new Date(),
      });

      await newAttendance.save();

      return res.status(200).json({
        success: true,
        message: "Attendance recorded successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error recording attendance",
        error: error.message,
      });
    }
  },

  // get admin attendance
  getAttendanceRecords: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      let query = {};

      if (startDate && endDate) {
        query.timestamp = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      const attendanceRecords = await adminAttendence
        .find(query)
        .populate("adminId", "name adminId")
        .sort({ timestamp: -1 });

      return res.status(200).json({
        success: true,
        data: attendanceRecords,
        count: attendanceRecords.length,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error fetching attendance records",
        error: error.message,
      });
    }
  },
};

module.exports = adminController;
