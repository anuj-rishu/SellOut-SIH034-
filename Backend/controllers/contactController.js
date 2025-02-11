const Message = require("../models/UserMessage");
require("dotenv").config();
const mailer = require("../utils/mailer");


const contactController = {
  userContact: async (req, res) => {
    const { name, email, message } = req.body;

    try {
    

      // Save the message in the database
      const newMessage = new Message({ name, email, message });
      await newMessage.save();

      await mailer.sendContactConfirmation(name, email);

      res.status(200).json({ message: "Message sent successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error sending message" });
    }
  },

  //get all messages
  getAllUserMessages: async (req, res) => {
    try {
      const messages = await Message.find();
      res.status(200).json(messages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching messages" });
    }
  },

  //user message reply
  userMessageReply: async (req, res) => {
    const { id, replyMessage } = req.body;

    try {
      const message = await Message.findById(id);

      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }

      await mailer.sendContactReply(message.name, message.email, replyMessage);

      // Update message as replied
      message.isReplied = true;
      await message.save();

      res.status(200).json({ message: "Reply sent successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error sending reply" });
    }
  },

  //delete user message
  deleteUserMessage: async (req, res) => {
    const { id } = req.params;

    try {
      const message = await Message.findById(id);

      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }

      await Message.findByIdAndDelete(id);

      res.status(200).json({ message: "Message deleted successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting message." });
    }
  },
};

module.exports = contactController;
