const Response = require("../../../infrastructure/utils/Response");
const logger = require("../../../infrastructure/config/logger");

/**
 * * Desativa uma conta
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports = async (req, res) => {
  const { prisma, params } = req;
  const { uuid } = params;

  if (!uuid) {
    Response.json(res, Response.error(400, "ACC102", "Uuid não definido."));
    return;
  }

  // Verifica se usuário existe e se já está desativado
  const userData = await prisma.User.findFirst({
    where: {
      uuid,
    },
  });

  if (userData === null) {
    logger.error(`Erro ao tentar buscar usuário com o uuid: ${uuid}`);
    Response.json(res, Response.error(400, "ACC103", "Usuário não existe."));
    return;
  }

  if (!userData.enabled) {
    logger.error(`Erro ao tentar buscar usuário com o uuid: ${uuid}`);
    Response.json(
      res,
      Response.error(400, "ACC104", "Esse usuário não está ativado.")
    );
    return;
  }

  userData.enabled = false;
  userData.updatedAt = new Date();

  await prisma.User.update({ where: { id: userData.id }, data: userData });

  Response.json(res, Response.result(204));
};
