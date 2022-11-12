const readKeys = require("../shared/read-keys-pair");
const logger = require("../config/logger");
const tty = require("../sources/tty");

const routinesRun = () => {
  (async () => {
    try {
      tty("yarn prisma migrate dev");

      readKeys("./keys");
    } catch (err) {
      logger.error("Erro ao fazer rotina:", err?.stack || err);
    }
  })();
  return (req, res, next) => next();
};

module.exports = routinesRun;
