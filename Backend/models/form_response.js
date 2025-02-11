const mongoose = require('mongoose');
const responseSchema = new mongoose.Schema({
    formId: mongoose.Schema.Types.ObjectId,
    responses: Object,
  }, { timestamps: true });

  module.exports = mongoose.model('FormResponse', responseSchema);