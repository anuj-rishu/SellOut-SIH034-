require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.BREVO_EMAIL, 
    pass: process.env.BREVO_API_KEY 
  },
  secure: false
});

module.exports = transporter;