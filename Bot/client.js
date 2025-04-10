const { Client, LocalAuth } = require("whatsapp-web.js");
const qrHandler = require("./utils/qrHandler");
const config = require("./config/config");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    executablePath: '/usr/bin/google-chrome',  // Use system Chrome
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
  },
});

client.on("qr", (qr) => {
  qrHandler.handleQr(qr);
});

client.on("ready", () => {
  console.log("WhatsApp client is ready!");
  qrHandler.clearQr();
});

module.exports = client;