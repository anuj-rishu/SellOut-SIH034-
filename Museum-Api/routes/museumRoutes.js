const express = require("express");
const museumController = require("../controllers/museumController");
const router = express.Router();

// Get all museums
router.get("/", museumController.getAllMuseums);

// Search museums by city
router.get("/city/:city", museumController.getMuseumsByCity);

// Find nearby museums by PIN code
router.get("/nearby/pincode/:pincode", museumController.getNearbyMuseumsByPinCode);

module.exports = router;