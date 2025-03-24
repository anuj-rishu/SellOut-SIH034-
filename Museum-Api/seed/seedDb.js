const fs = require("fs");
const csvParser = require("csv-parser");
const mongoose = require("mongoose");
const Museum = require("../models/Museum");
const connectDB = require("../config/db");

const seedDatabase = async () => {
  try {
    await connectDB();

    const existingData = await Museum.countDocuments();
    if (existingData > 0) {
      console.log("Database already seeded. Skipping...");
      return;
    }

    const museums = [];
    fs.createReadStream("seed.csv")
      .pipe(csvParser())
      .on("data", (row) => {
        museums.push({
          Museum_Name: row.Museum_Name,
          Address: row.Address,
          City: row.City,
          State: row.State,
          PIN_Code: row.PIN_Code,
          Opening_Hours: row.Opening_Hours,
          Closing_Hours: row.Closing_Hours,
          Contact_Email: row.Contact_Email,
          Phone_Number: row.Phone_Number,
          Full_Address: row.Full_Address,
          Latitude: parseFloat(row.Latitude),
          Longitude: parseFloat(row.Longitude),
        });
      })
      .on("end", async () => {
        await Museum.insertMany(museums);
        console.log("Database seeded successfully");
        mongoose.connection.close();
      });
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

module.exports = seedDatabase;
