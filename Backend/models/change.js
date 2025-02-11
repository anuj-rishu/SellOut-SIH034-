const mongoose = require("mongoose");
const Auth = require("../models/Auth");
require("dotenv").config();

async function updateAdminIds() {
  try {
    await mongoose.connect("");
    console.log("Connected to MongoDB");

    const domains = await Auth.distinct("domain.name");
    
    for (const domainName of domains) {
      // Get all users in the domain and sort by joinedDate
      const users = await Auth.find({ "domain.name": domainName })
        .sort("joinedDate");
      
      // Create counter map for each year and domain combination
      const yearCounters = {};

      for (const user of users) {
        const name = user.name.split(" ");
        const firstLetter = name[0][0]
          .replace(/[^a-zA-Z0-9]/g, "E")
          .toUpperCase();
        const lastLetter = name[name.length - 1][
          name[name.length - 1].length - 1
        ]
          .replace(/[^a-zA-Z0-9]/g, "E")
          .toUpperCase();
        const year = user.joinedDate.getFullYear().toString().slice(-2);
        const domain = user.domain.name
          .replace(/[^a-zA-Z0-9]/g, "E")
          .slice(0, 2)
          .toUpperCase();

        // Initialize or increment counter for this year-domain combination
        const yearDomainKey = `${year}-${domain}`;
        if (!yearCounters[yearDomainKey]) {
          yearCounters[yearDomainKey] = 1;
        }
        const serialNumber = yearCounters[yearDomainKey].toString().padStart(3, "0");
        yearCounters[yearDomainKey]++;

        const newAdminId = `EC${year}${firstLetter}${lastLetter}${domain}${serialNumber}`;

        await Auth.findByIdAndUpdate(user._id, { adminId: newAdminId });
        console.log(
          `Updated user ${user.name}: ${user.adminId} -> ${newAdminId}`
        );
      }
    }

    console.log("Admin ID update completed successfully");
  } catch (error) {
    console.error("Error updating admin IDs:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
}

updateAdminIds();