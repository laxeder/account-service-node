const isBase64 = require("is-base64");

const Response = require("../../../infrastructure/utils/Response");

/**
 * * Lista todas as contas
 * @param {*} req 
 * @param {*} res 
 */
module.exports = async (req, res) => {
  const { prisma } = req;

  const users = await prisma.User.findMany({
    take: 100,
    orderBy: {
      id: "asc",
    },
    where: {
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

  // Le todos os usuários e verifica se a imagem está corrompida
  users.forEach((user, index) => {
    user.uid = user.uid.toString();

    const address = user.Address[0];
    const account = user.Account[0];

    const pictureBase64 = Buffer.from(account.picture).toString("base64");

    if (!isBase64(pictureBase64, { allowMime: true })) {
      logger.error(
        `Erro ao tentar converter a imagem para base64:  ${account.picture}`
      );
      Response.json(
        res,
        Response.error(400, "ACC095", "A imagem está corrompida.")
      );
      return;
    }

    account.picture = pictureBase64;

    const data = {
      ...user,
      ...account,
      ...address,
    };

    delete data.Address;
    delete data.Account;

    users[index] = data;
  });

  Response.json(res, Response.result(200, users));
};
