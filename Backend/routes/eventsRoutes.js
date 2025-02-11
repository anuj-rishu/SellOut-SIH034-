const express = require("express");
const eventrouter = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const eventController = require("../controllers/eventController");
const { HEAD_ROLES } = require("../config/constants");
const upload = require("../middleware/multer");

eventrouter.get(
  "/user-scan-data",
  authMiddleware(),
  eventController.getUserData
);

//user register data route
eventrouter.get(
  "/user-register-data",
  authMiddleware(),
  eventController.getUserRegisterData
);

//update register user data
eventrouter.put(
  "/user-register-data/:id",
  authMiddleware(HEAD_ROLES),
  eventController.updateUserRegisterData
);

//delete register user data
eventrouter.delete(
  "/user-register-data/:id",
  authMiddleware(HEAD_ROLES),
  eventController.deleteUserRegisterData
);

//create event
eventrouter.post(
  "/create-event",
  upload.single("banner"),
  authMiddleware(HEAD_ROLES),
  eventController.createEvent
);

//get all events
eventrouter.get("/all-events", authMiddleware(), eventController.getEvents);

// Update Event
eventrouter.put(
  "/update-event/:id",
  authMiddleware(HEAD_ROLES),
  upload.single("banner"),
  eventController.updateEvent
);

// Delete Event
eventrouter.delete(
  "/delete-event/:id",
  authMiddleware(HEAD_ROLES),
  eventController.deleteEvent
);

//past events
eventrouter.put(
  "/moveToPast/:id",
  authMiddleware(HEAD_ROLES),
  eventController.pastEvents
);

//get past events
eventrouter.get("/past-events", eventController.getPastEvents);

// Get Present Events
eventrouter.get("/present-events", eventController.getPresentEvents);

module.exports = eventrouter;
