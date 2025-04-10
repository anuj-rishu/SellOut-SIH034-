const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const config = require("./config/config");

// Initialize WhatsApp client
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  }
});

// QR code handler
client.on("qr", (qr) => {
  console.log("QR RECEIVED. Scan this QR code with your WhatsApp:");
  qrcode.generate(qr, { small: true });
});

// Client ready event handler
client.on("ready", () => {
  console.log("WhatsApp client is ready!");
});

module.exports = client;