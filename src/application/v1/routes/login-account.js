const { validHash } = require("../../../infrastructure/utils/password");
const Response = require("../../../infrastructure/utils/Response");
const jwtSign = require("../../../infrastructure/shared/jwt-sign");
const logger = require("../../../infrastructure/config/logger");

/**
 * * Lista contas pelo email
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports = async (req, res) => {
  try {
    const { prisma, body } = req;
    const { password, email } = body;

    if (!!!email) {
      Response.json(res, Response.error(400, "ACC0125", "Email não definido."));
      return;
    }

    const users = await prisma.User.findMany({
      take: 100,
      orderBy: {
        id: "asc",
      },
      where: {
        email: {
          contains: email,
        },
        enabled: true,
      },
      select: {
        uid: true,
        uuid: true,
        firstName: true,
        lastName: true,
        fullName: true,
        email: true,
        phone: true,
        password: true,
        salt: true,
        enabled: true,
        createdAt: true,
        updatedAt: true,
        Address: true,
        Account: true,
      },
    });

    if (users.length <= 0) {
      Response.json(res, Response.error(404, "ACC122", "Usuário não encontrado."));
      return;
    }

    const user = users[0];

    if (!validHash(user.password, user.salt, password)) {
      logger.error(`Erro ao válidar hash`);
      Response.json(res, Response.error(400, "ACC123", "Senha incorreta."));
      return;
    }

    user.uid = user.uid.toString();

    delete user.password;
    delete user.Address;
    delete user.Account;
    delete user.salt;

    const token = jwtSign(user, 30);

    const refresh = jwtSign(user, "4h");

    Response.json(res, Response.result(200, { token, refresh }));
  } catch (err) {
    logger.error(`Erro ao fazer login: ${err}`);
    Response.json(res, Response.error(500, "ACC126", "Um erro interno aconteceu. Favor tentar novamente."));
  }
};
