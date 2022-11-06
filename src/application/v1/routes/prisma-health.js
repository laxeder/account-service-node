const logger = require("../../../infrastructure/config/logger");
const Response = require("../../../infrastructure/utils/Response");
const mysqlHealth = require("../../../infrastructure/shared/mysql-health");

/**
 * * Retorna se banco de dados está ativado
 * @param {*} req
 * @param {*} res
 */
module.exports = async (req, res) => {
  try {
    const { prisma } = req;

    const [err, result] = await mysqlHealth(prisma);

    if (err) {
      logger.error(`Erro ao tentar acessar o banco de dados: ${err.stack}`);

      Response.json(
        res,
        Response.error(500, "ACC115", `MySQL DOWN: ${new Date().toISOString()}`)
      );
      return;
    }

    const nowResult = result[0]["NOW()"];

    Response.json(
      res,
      Response.result(200, `MySQL UP: ${new Date(nowResult).toISOString()}`)
    );
    return;
  } catch (err) {
    logger.error(`Erro ao verificar se banco de dados está online: ${err.stack}`);
    Response.json(res, Response.errorDefault("ACC114"));
    return;
  }
};
