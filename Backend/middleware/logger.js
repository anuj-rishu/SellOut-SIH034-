const morgan = require("morgan");

const setupLogger = (router) => {
  router.use(morgan("combined"));
};

module.exports = setupLogger;