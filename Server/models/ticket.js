const mongoose = require('mongoose');
const ticketSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    date: Date,
});
module.exports = mongoose.model('Ticket', ticketSchema);