const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// router.post("/create-order", createRazorpayOrder);
router.post("/register", userController.register);

// Route for scanning QR/barcode
router.post("/scan", userController.scan);

module.exports = router;
