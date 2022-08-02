const isBase64 = require("is-base64");

const Response = require("../../../infrastructure/utils/Response");
const logger = require("../../../infrastructure/config/logger");

/**
 * * Mostrar todas as contas pelo telefone
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
module.exports = async (req, res) => {
  const { prisma } = req;
  const { phone } = req.params;

  if (!phone) {
    Response.json(res, Response.error(400, "ACC088", "Phone não definido."));
    return;
  }

  const userData = await prisma.User.findFirst({
    where: {
      phone,
      enabled: true
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
    logger.error(`Erro ao tentar obter usuário com o telefone: ${phone}`);
    Response.json(res, Response.error(400, "ACC089", "Usuário não existe."));
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
    Response.json(res, Response.errorDefault("ACC090"));
    return;
  }

  const pictureBase64 = Buffer.from(accountData.picture).toString("base64");

  if (!isBase64(pictureBase64, { allowMime: true })) {
    logger.error(
      `Erro ao tentar converter a imagem para base64:  ${accountData.picture}`
    );
    Response.json(
      res,
      Response.error(400, "ACC093", "A imagem está corrompida.")
    );
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
    logger.error(
      `Erro ao tentar obter endereço:  ${JSON.stringify(addressData)}`
    );
    Response.json(res, Response.errorDefault("ACC091"));
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
