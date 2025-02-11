const express = require('express');
const router = express.Router();

router.post('/chat', (req, res) => {
    const { message } = req.body;
    let response;
    if (message.toLowerCase().includes('book ticket')) {
        response = 'Please provide the date for booking your ticket.';
    } else {
        response = 'I am here to assist you. You can ask about ticket booking.';
    }
    res.json({ response });
});

module.exports = router;