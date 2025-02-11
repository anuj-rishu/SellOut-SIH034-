const recruitmentControl = require("../models/recruitmentControl");

const recruitmentControlller = {
  formconfig: async (req, res) => {
    try {
      const config = await recruitmentControl.findOne();
      res.json(config);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  },

  updateFormConfig: async (req, res) => {
    const { openDate, closeDate } = req.body;
    try {
      const config = await recruitmentControl.findOneAndUpdate(
        {},
        { openDate, closeDate },
        { new: true, upsert: true }
      );
      res.json(config);
    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }
  },
};

module.exports = recruitmentControlller;
