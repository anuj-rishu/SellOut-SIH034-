const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    name: String,
    description: String,
    date: Date,
    time: String,
    speakers: [String],
    banner: String,
    venue: String,
    isPast: { type: Boolean, default: false }
});

module.exports = mongoose.model('Event', EventSchema);