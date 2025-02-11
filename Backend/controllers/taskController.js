const tasks = require("../data/task");
const StudentTask = require("../models/StudentTask");
const { sendTaskEmail } = require("../utils/mailer");


const StuTaskController = {
  //submit form
  submitForm: async (req, res) => {
    try {
      const { name, email, whatsappPhoneNumber, yearOfStudy, domain } =
        req.body;

      if (!validatePhoneNumber(whatsappPhoneNumber)) {
        return res.status(400).json({
          success: false,
          error: "Please enter a valid 10-digit Indian whatsapp number",
        });
      }

     

      const existingUser = await StudentTask.findOne({
        $or: [{ email }, { whatsappPhoneNumber }],
      });

      if (existingUser) {
        return res.status(400).json({
          error: "User already registered with this email or WhatsApp number.",
        });
      }

      const domainTasks = tasks[yearOfStudy][domain];
      const assignedTask =
        domainTasks[Math.floor(Math.random() * domainTasks.length)];

      const newUser = new StudentTask({
        name,
        email,
        whatsappPhoneNumber,
        yearOfStudy,
        domain,
        assignedTask,
      });
      await newUser.save();

      await sendTaskEmail(email, name, assignedTask);

      res.status(200).json({
        message: "Form submitted successfully!",
        assignedTask,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to submit form" });
    }
  },
};

module.exports = StuTaskController;
