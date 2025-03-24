const mongoose = require("mongoose");

const MuseumSchema = new mongoose.Schema({
  Museum_Name: String,
  Address: String,
  City: String,
  State: String,
  PIN_Code: String,
  Opening_Hours: String,
  Closing_Hours: String,
  Contact_Email: String,
  Phone_Number: String,
  Full_Address: String,
  Latitude: Number,
  Longitude: Number,
});

module.exports = mongoose.model("Museum", MuseumSchema);
