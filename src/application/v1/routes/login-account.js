const isBase64 = require("is-base64");
const jwt = require("jsonwebtoken");
const logger = require("../../../infrastructure/config/logger");

const Response = require("../../../infrastructure/utils/Response");
const { validHash } = require("../../../infrastructure/utils/password");

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

    const address = user.Address[0];
    const account = user.Account[0];

    const pictureBase64 = Buffer.from(account.picture).toString("base64");

    if (!isBase64(pictureBase64, { allowMime: true })) {
      logger.error(`Erro ao tentar converter a imagem para base64:  ${account.picture}`);
      Response.json(res, Response.error(400, "ACC124", "A imagem está corrompida."));
      return;
    }

    account.picture = pictureBase64;

    const data = {
      ...user,
      ...account,
      ...address,
      publicKey: process.env.public,
    };

    delete data.Address;
    delete data.Account;

    const sign = process.env.signature;

    const token = jwt.sign(data, sign, {
      expiresIn: "1h",
    });

    const refresh = jwt.sign(data, sign, {
      expiresIn: "4h",
    });

    Response.json(res, Response.result(200, { token, refresh }));
  } catch (err) {
    logger.error(`Erro ao fazer login: ${err}`);
    Response.json(res, Response.error(500, "ACC126", "Um erro interno aconteceu. Favor tentar novamente."));
  }
};
