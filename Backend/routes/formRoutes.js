require("dotenv").config();
const express = require("express");
const formrouter = express.Router();
const formController = require("../controllers/formController");
const authMiddleware = require("../middleware/authMiddleware");

//to create a new form
formrouter.post("/", authMiddleware(), formController.createForm);

//get a form by id after creation
formrouter.get("/:id", formController.getFormById);

//get all the forms
formrouter.get("/", authMiddleware(), formController.getAllForms);

//delete a form by id
formrouter.delete("/:id", authMiddleware(), formController.deleteForm);

//update a form by id
formrouter.put("/:id", authMiddleware(), formController.updateForm);

//update the status of a form
formrouter.put(
  "/:id/status",
  authMiddleware(),
  formController.updateFormStatus
);

//save all the responses of a form
formrouter.post("/:id/responses", formController.saveResponses);

//get all the responses of a form
formrouter.get("/:id/responses", formController.getResponses);

module.exports = formrouter;
