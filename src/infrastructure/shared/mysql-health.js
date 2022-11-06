const logger = require("../config/logger");
const handle = require("../utils/handle");

module.exports = (prisma) => {
  try {
    return handle(prisma.$queryRaw`SELECT NOW()`);
  } catch (err) {
    logger.error(`Erro ao verificar se banco de dados está online: ${err.stack}`);
    return [err, null];
  }
};
