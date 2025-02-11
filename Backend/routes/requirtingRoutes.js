const express = require("express");
const requirtingrouter = express.Router();
const requirtingController = require("../controllers/requirtingController");

//get all user of requiting website who are register
requirtingrouter.get("/getAllUsers", requirtingController.getAllUsers);

//for giving rating to user
requirtingrouter.put("/rateUser/:id", requirtingController.rateUser);

// fliter user
requirtingrouter.get("/filterUsers", requirtingController.filterUsers);

//send email to filter user
requirtingrouter.post("/sendBulkEmails", requirtingController.sendBulkEmails);

module.exports = requirtingrouter
