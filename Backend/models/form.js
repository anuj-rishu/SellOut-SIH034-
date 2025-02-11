const mongoose = require('mongoose');
const formSchema = new mongoose.Schema({
    name: { type: String, required: true },
    fields: { type: Array, required: true },
    status: { type: String, default: "active" },
  });

  module.exports = mongoose.model('Form', formSchema);