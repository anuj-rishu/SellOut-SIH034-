const helmet = require("helmet");
const limiter = require("../config/rateLimit");

const setupSecurity = (router) => {
  router.use(helmet());
  router.use(limiter);
};

module.exports = setupSecurity;