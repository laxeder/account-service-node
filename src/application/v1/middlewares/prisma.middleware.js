const { PrismaClient } = require("@prisma/client");
const logger = require("../../../infrastructure/config/logger");

/**
 * * Cria cliente do prisma
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
module.exports = (req, res, next) => {
  try {
    const prisma = new PrismaClient();

    Object.defineProperty(req, "prisma", {
      value: prisma,
      writable: false,
      enumerable: false,
      configurable: true,
    });

    return next();
  } catch (e) {
    logger.error(`Erro ao injectar o prisma na requisicao: ${e.stack}`);
    return next();
  }
};
