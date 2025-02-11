const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const options = {
      retryWrites: true,
      w: "majority",
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    console.log("MongoDB connected successfully ✅");

    // Verify connection status
    const state = mongoose.connection.readyState;
    if (state === 1) {
      console.log("Database connection state: Connected");

      // Check replica set status
      const admin = mongoose.connection.db.admin();
      const replicaStatus = await admin.command({ replSetGetStatus: 1 });

      console.log("\nReplica Set Information:");
      console.log("Set Name:", replicaStatus.set);
      console.log("Total Members:", replicaStatus.members.length);

      replicaStatus.members.forEach((member) => {
        console.log(`\nMember: ${member.name}`);
        console.log(`State: ${member.stateStr}`);
        console.log(`Health: ${member.health}`);
      });
    }
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
