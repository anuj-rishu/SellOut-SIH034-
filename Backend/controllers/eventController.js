const User = require("../models/User");
const Scan = require("../models/Scan");
const Event = require("../models/Event");

const eventController = {
  // Get scan user data
  getUserData: async (req, res) => {
    try {
      const data = await Scan.find();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //user register data
  getUserRegisterData: async (req, res) => {
    try {
      const data = await User.find();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //update user register data
  updateUserRegisterData: async (req, res) => {
    try {
      const updatedData = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      if (!updatedData) {
        res.status(404).json({ message: "Data not found" });
      } else {
        res.json(updatedData);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //delete user register data
  deleteUserRegisterData: async (req, res) => {
      try {
    const event = new Event({
      ...req.body,
      banner: req.file.path
    });
    await event.save();
    res.status(201).send(event);
  } catch (error) {
    res.status(400).send(error);
  }
  },

  // create event
  createEvent: async (req, res) => {
    try {
      const event = new Event({
        ...req.body,
        banner: req.file.path
      });
      await event.save();
      res.status(201).send(event);
    } catch (error) {
      res.status(400).send(error);
    }
  },

  // Get Events
  getEvents: async (req, res) => {
    try {
      const events = await Event.find();
      res.status(200).send(events);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  // Update Event
  updateEvent: async (req, res) => {
    try {
      const eventData = { ...req.body };
      if (req.file) eventData.banner = req.file.path;
      const event = await Event.findByIdAndUpdate(req.params.id, eventData, { new: true });
      res.status(200).send(event);
    } catch (error) {
      res.status(400).send(error);
    }
  },

  // Delete Event
  deleteEvent: async (req, res) => {
    try {
      await Event.findByIdAndDelete(req.params.id);
      res.status(200).send({ message: "Event deleted" });
    } catch (error) {
      res.status(500).send(error);
    }
  },

  //past events
   pastEvents: async (req, res) => {
    try {
      const event = await Event.findByIdAndUpdate(req.params.id, { isPast: true }, { new: true });
      res.status(200).send(event);
    } catch (error) {
      res.status(500).send(error);
    }
   },

   //get past events
    getPastEvents: async (req, res) => {
      try {
        const pastEvents = await Event.find({ isPast: true });
        res.status(200).send(pastEvents);
      } catch (error) {
        res.status(500).send(error);
      }
    },

    // Get Present Events
     getPresentEvents: async (req, res) => {
      try {
        const presentEvents = await Event.find({ isPast: false });
        res.status(200).send(presentEvents);
      } catch (error) {
        res.status(500).send(error);
      }
     }
};

module.exports = eventController;
