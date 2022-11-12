const jwtVerify = require("../../../infrastructure/shared/jwt-verify");
const Response = require("../../../infrastructure/utils/Response");
const jwtSign = require("../../../infrastructure/shared/jwt-sign");
const logger = require("../../../infrastructure/config/logger");

module.exports = async (req, res, next) => {
  try {
    let { bearer: token, "api-x-token": refresh } = req.headers;

    const verify = jwtVerify(token, refresh);

    if (verify.refresh) {
      const { prisma } = req;

      const users = await prisma.User.findMany({
        take: 100,
        orderBy: {
          id: "asc",
        },
        where: {
          email: {
            contains: verify.payload.email,
          },
          enabled: true,
        },
        select: {
          firstName: true,
          createdAt: true,
          updatedAt: true,
          fullName: true,
          lastName: true,
          enabled: true,
          email: true,
          phone: true,
          uuid: true,
          uid: true,
        },
      });

      if (users.length <= 0) {
        Response.json(res, Response.error(404, "ACC132", "Usuário não encontrado."));
        return;
      }

      const user = users[0];

      user.uid = user.uid.toString();

      token = jwtSign(user, "1h");
      refresh = jwtSign(user, "4h");

      res.append("Bearer", token);
      res.append("Api-X-Token", refresh);
    }

    return next();
  } catch (e) {
    logger.error("Erro ao verificar token:", e?.stack | e);
    Response.json(res, Response.error(403, "ACC130", "Token expirado ou inválido."));
  }
};
