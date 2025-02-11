const StudentTask = require("../models/StudentTask");
const mailer = require("../utils/mailer");


const requirtingController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await StudentTask.find().sort({ createdAt: -1 }); // Sorted by most recent
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user details" });
    }
  },

  //for giving rating to user
   rateUser: async (req, res) => {
      const { id } = req.params;
      const { rating } = req.body;
  
      try {
        // Validate input
        if (!rating || typeof rating !== 'number') {
          return res.status(400).json({ error: "Rating is required and must be a number" });
        }
  
        // Validate rating range
        if (rating < 0 || rating > 5) {
          return res.status(400).json({ error: "Rating must be between 0 and 5" });
        }
  
        // Check if ID is valid
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
          return res.status(400).json({ error: "Invalid user ID" });
        }
  
        const user = await StudentTask.findById(id);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
  
        // Update rating and status
        user.rating = rating;
        user.status = rating > 0 ? "Interviewed" : "Remaining";
        
        const updatedUser = await user.save();
        if (!updatedUser) {
          throw new Error("Failed to save user data");
        }
  
        return res.status(200).json({ 
          message: "User rating and status updated successfully", 
          user: updatedUser 
        });
  
      } catch (error) {
        console.error("Error in rateUser:", error.message);
        return res.status(500).json({ 
          error: "Failed to update user",
          details: error.message 
        });
      }
    },

  //filter user
  filterUsers: async (req, res) => {
    const { domain, yearOfStudy, rating } = req.query;

    try {
      const filterCriteria = {};

      if (domain) filterCriteria.domain = domain;
      if (yearOfStudy) filterCriteria.yearOfStudy = yearOfStudy;
      if (rating) filterCriteria.rating = { $gte: parseInt(rating) };

      const filteredUsers = await StudentTask.find(filterCriteria);
      res.status(200).json(filteredUsers);
    } catch (error) {
      res.status(500).json({ error: "Failed to filter users." });
    }
  },

  //send email to filter user
  sendBulkEmails: async (req, res) => {
    const { filteredUsers, subject, text } = req.body;

    try {
      await mailer.sendBulkEmails(filteredUsers, subject, text);
      res.status(200).json({ message: "Emails sent successfully!" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to send emails. Please try again." });
    }
  },
};

module.exports = requirtingController;
