const Response = require("../../../infrastructure/utils/Response");
const logger = require("../../../infrastructure/config/logger");
const isBase64 = require("is-base64");

/**
 * * Mostrar todas as contas pelo email
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports = async (req, res) => {
  const { prisma } = req;
  const { email } = req.params;

  if (!email) {
    Response.json(res, Response.error(400, "ACC084", "Email não definido."));
    return;
  }

  const userData = await prisma.User.findFirst({
    where: {
      email,
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
    },
  });

  if (userData === null) {
    logger.error(`Erro ao tentar obter usuário com o email: ${email}`);
    Response.json(res, Response.error(400, "ACC085", "Usuário não existe."));
    return;
  }

  userData.uid = userData.uid.toString();

  const accountData = await prisma.Account.findFirst({
    where: {
      uuid: userData.uuid,
    },
    select: {
      uuid: true,
      birthdate: true,
      cpf: true,
      rg: true,
      nickname: true,
      picture: true,
      profession: true,
      company: true,
      description: true,
    },
  });

  if (accountData === null) {
    logger.error(`Erro ao tentar obter conta:  ${JSON.stringify(accountData)}`);
    Response.json(res, Response.errorDefault("ACC086"));
    return;
  }

  const pictureBase64 = Buffer.from(accountData.picture, "base64").toString();

  if (!isBase64(pictureBase64, { allowMime: true })) {
    logger.error(`Erro ao tentar converter a imagem para base64:  ${accountData.picture}`);
    Response.json(res, Response.error(400, "ACC092", "A imagem está corrompida."));
    return;
  }

  accountData.picture = pictureBase64;

  const addressData = await prisma.Address.findFirst({
    where: {
      uuid: userData.uuid,
    },
    select: {
      uuid: true,
      street: true,
      number: true,
      complement: true,
      neighborhood: true,
      city: true,
      state: true,
      zipcode: true,
    },
  });
  if (addressData === null) {
    logger.error(`Erro ao tentar obter endereço:  ${JSON.stringify(addressData)}`);
    Response.json(res, Response.errorDefault("ACC087"));
    return;
  }

  Response.json(
    res,
    Response.result(200, {
      ...userData,
      ...accountData,
      ...addressData,
    })
  );
};
