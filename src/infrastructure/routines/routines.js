const readKeys = require("../shared/read-keys-pair");
const logger = require("../config/logger");

const routinesRun = () => {
  (async () => {
    try {
      readKeys("./keys");
    } catch (err) {
      logger.error("Erro ao fazer rotina:", err?.stack || err);
    }
  })();
  return (req, res, next) => next();
};

module.exports = routinesRun;
