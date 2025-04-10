module.exports = {
  apiBaseUrl: "http://localhost:9000/api",
  museumApiUrl: "https://museum-api-indian.vercel.app/api",
  puppeteerOptions: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  }
};