require("dotenv").config();

module.exports = {
  apiBaseUrl: process.env.API_BASE_URL,
  museumApiUrl: process.env.MUSEUM_API_URL,
  puppeteerOptions: {
    headless: process.env.PUPPETEER_HEADLESS === "false" ? false : true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  qrServerPort: parseInt(process.env.QR_SERVER_PORT || "8080"),
};
