const Response = require("../../../infrastructure/utils/Response");

const logger = require("../../../infrastructure/config/logger");

/**
 * * Restaura uma conta desativada
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports = async (req, res) => {
  const {
    prisma,
    params: { uuid },
  } = req;

  if (!uuid) {
    Response.json(res, Response.error(400, "ACC112", "Uuid não definido."));
    return;
  }

  //Busca um usuário no banco de dados para verificar se ele existe
  const userData = await prisma.User.findFirst({
    where: {
      uuid,
    },
  });

  if (userData === null) {
    logger.error(`Erro ao tentar buscar usuário com o uuid: ${uuid}`);
    Response.json(
      res,
      Response.error(400, "ACC113", "Este usuário não existe.")
    );
    return;
  }

  if (userData.enabled) {
    Response.json(
      res,
      Response.error(400, "ACC117", "Este usuário já está ativo.")
    );
    return;
  }

  userData.enabled = true;
  userData.updatedAt = new Date();

  //Atualiza o usuário no banco de dados
  await prisma.User.update({ where: { uuid: userData.uuid }, data: userData });

  Response.json(res, Response.result(204));
};
