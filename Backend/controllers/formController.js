const Form = require("../models/form");
const Response = require("../models/form_response");

const formController = {

  //create a form
  createForm: async (req, res) => {
    try {
      const form = new Form(req.body);
      await form.save();
      const baseUrl = process.env.BASE_URL;
      res.send({ id: form._id, link: `${baseUrl}/form/${form._id}` });
    } catch (error) {
      res.status(500).send({ error: "Error creating form" });
    }
  },

  //get a form by id after creation
  getFormById: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).send({ error: "Form ID is required" });
      }

      const form = await Form.findById(id);

      if (!form) {
        return res.status(404).send({ error: "Form not found" });
      }

      res.send(form);
    } catch (error) {
      res.status(500).send({ error: "Error retrieving form" });
    }
  },

  //get all the forms
  getAllForms: async (req, res) => {
    try {
      const forms = await Form.find();
      res.send(forms);
    } catch (error) {
      res.status(500).send({ error: "Unable to fetch forms." });
    }
  },

  //delete a form by id
  deleteForm: async (req, res) => {
    const { id } = req.params;

    try {
      await Form.findByIdAndDelete(id);
      res.send({ message: "Form deleted successfully." });
    } catch (error) {
      res.status(500).send({ error: "Unable to delete the form." });
    }
  },
  
  //update a form by id
  updateForm: async (req, res) => {
    const { id } = req.params;
    const { name, fields } = req.body;

    try {
      const updatedForm = await Form.findByIdAndUpdate(
        id,
        { name, fields },
        { new: true }
      );
      res.send(updatedForm);
    } catch (error) {
      res.status(500).send({ error: "Unable to update the form." });
    }
  },

  //update the status of a form
  updateFormStatus: async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // Expected values: "active" or "paused"

    try {
      const updatedForm = await Form.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      res.send(updatedForm);
    } catch (error) {
      res.status(500).send({ error: "Unable to update form status." });
    }
  },

  //save all the responses of a form
  saveResponses: async (req, res) => {
    const response = new Response({
      formId: req.params.id,
      responses: req.body,
    });
    await response.save();
    res.send("Response saved!");
  },

  //get all the responses of a form
  getResponses: async (req, res) => {
    const responses = await Response.find({ formId: req.params.id })
      .select("responses createdAt updatedAt") // Explicitly select fields
      .sort("-createdAt"); // Sort by newest first
    res.send(responses);
  },
};

module.exports = formController;
