const express = require("express");
const recruitmentControllRouter = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { HEAD_ROLES } = require("../config/constants");
const recruitmentControlller = require("../controllers/recruitmentController");

recruitmentControllRouter.get("/form-config", recruitmentControlller.formconfig);
recruitmentControllRouter.put(
  "/form-config",
  authMiddleware(HEAD_ROLES),
    recruitmentControlller.updateFormConfig
);

module.exports = recruitmentControllRouter;
