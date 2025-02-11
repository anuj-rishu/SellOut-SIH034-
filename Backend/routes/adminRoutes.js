const express = require("express");
const adminrouter = express.Router();
const upload = require("../middleware/multer");
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const { HEAD_ROLES } = require("../config/constants");

//***routes for admin profile***

// admin  register
adminrouter.post("/register", adminController.AdmiRegistration);

// admin login
adminrouter.post("/login", adminController.AdminLogin);

adminrouter.post("/forgot-password", adminController.forgotPassword);
adminrouter.post("/reset-password", adminController.verifyOTPAndResetPassword);

// update admin name
adminrouter.put(
  "/profile/update-name",
  authMiddleware(),
  adminController.updateAdminName
);

//update admin prfile photo
adminrouter.post(
  "/updateProfilePhoto",
  authMiddleware(),
  upload.single("profilePhoto"),
  adminController.updateProfilePhoto
);

//update social
adminrouter.put(
  "/update-social-profiles",
  authMiddleware(),
  adminController.updateSocialProfiles
);

//update bio
adminrouter.patch("/update-bio",  authMiddleware(),  adminController.updateAdminBio);


//update admin passwordOtp
adminrouter.post(
  "/profile/request-password-change",
  authMiddleware(),
  adminController.updateAdminPasswordOtp
);

//update admin password
adminrouter.post(
  "/profile/change-password",
  authMiddleware(),
  adminController.updateAdminPassword
);

//update admin email otp
adminrouter.post(
  "/profile/request-email-change",
  authMiddleware(),
  adminController.updateAdminEmailOtp
);

//update admin email
adminrouter.post(
  "/profile/change-email",
  authMiddleware(),
  adminController.updateAdminEmail
);

//update admin domain
adminrouter.put(
  "/profile/update-domain",
  authMiddleware(HEAD_ROLES),
  adminController.updateAdminDomain
);

//get admin profile
adminrouter.get("/profile", authMiddleware(), adminController.getAdminProfile);

adminrouter.put(
  "/update-user/:id",
  authMiddleware(HEAD_ROLES),
  adminController.updateAdminDomain
);

// Add new member
adminrouter.post(
  "/add-new-member",
  authMiddleware(HEAD_ROLES),
  adminController.addNewMember
);

// Get all members
adminrouter.get(
  "/get-all-member",
  authMiddleware(),
  adminController.getAllMember
);

//delete admin
adminrouter.delete(
  "/delete-member/:id",
  authMiddleware(HEAD_ROLES),
  adminController.deleteMember
);

//admin profile by admin ID
adminrouter.get("/getAdminID/:adminId", adminController.getAdminProfileById);

//admin attendance route
adminrouter.post(
  "/attendance",
  authMiddleware(HEAD_ROLES),
  adminController.adminAttendence
);

//admin attendance route
adminrouter.get(
  "/attendance/records",
  authMiddleware(),
  adminController.getAttendanceRecords
);
module.exports = adminrouter;
