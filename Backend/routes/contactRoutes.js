const express = require("express");
const conatactrouter = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const contactController = require("../controllers/contactController");


//***routes for the contact us form***

//user contact route
conatactrouter.post("/user-contact", contactController.userContact);

//get all user mesages
conatactrouter.get(
  "/user-messages",
  authMiddleware(),
  contactController.getAllUserMessages
);

//user message reply
conatactrouter.post(
  "/user-messages/reply",
  authMiddleware(),
  contactController.userMessageReply
);

//delete user message
conatactrouter.delete(
  "/user-messages/delete/:id",
  authMiddleware(),
  contactController.deleteUserMessage
);

module.exports = conatactrouter;
