const Ticket = require('../models/ticket');
exports.bookTicket = async (req, res) => {
    try {
        const ticket = await Ticket.create({ userId: req.user.id, date: req.body.date });
        res.json({ message: 'Ticket booked', ticket });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
