const express = require("express");
const AdminTicketRouter = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminTicketController = require("../controllers/adminTicketController");
const { HEAD_ROLES } = require("../config/constants");

AdminTicketRouter.post(
  "/genrate",
  authMiddleware(HEAD_ROLES),
  adminTicketController.genrateticket
);

AdminTicketRouter.get(
  "/stats",
  authMiddleware(HEAD_ROLES),
  adminTicketController.getStats
);

module.exports = AdminTicketRouter;
