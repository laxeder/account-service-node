require("dotenv/config");

const graceful = require("graceful");

const server = require("./src/server");
const logger = require("./src/infrastructure/config/logger");

const PORT =
  process.env.NODE_ENV === "production"
    ? process.env.PORT
    : process.env.DEV_PORT;

// Sobe o servidor e registra suas informações
const srv = server.listen(PORT, () => {
  logger.info(`port: ${PORT}`);
  logger.info(`author: ${process.env.AUTHOR}`);
  logger.info(`hostname: ${process.env.HOSTNAME}`);
  logger.info(`NODE_ENV: ${process.env.NODE_ENV}`);
});

const SHUTDOWN =
  process.env.NODE_ENV === "production"
    ? process.env.SHUTDOWN
    : process.env.DEV_SHUTDOWN;

graceful({
  servers: [srv],
  killTimeout: SHUTDOWN,
});
