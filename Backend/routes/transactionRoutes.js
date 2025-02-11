const express = require("express");
const transactionRouter = express.Router();
const transactionController = require("../controllers/transactionController");
const authMiddleware = require("../middleware/authMiddleware");

// Get transaction logs
transactionRouter.get(
  "/get-transactions",
  authMiddleware(),
  transactionController.getTransactionLogs
);
transactionRouter.get(
  "/get-balance",
  authMiddleware(),
  transactionController.getBalance
);
module.exports = transactionRouter;
