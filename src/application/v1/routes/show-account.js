const isBase64 = require("is-base64");

const logger = require("../../../infrastructure/config/logger");
const Response = require("../../../infrastructure/utils/Response");

/**
 * * Mostrar todas as contas pelo uuid
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
module.exports = async (req, res) => {
  const { prisma } = req;
  const { uuid } = req.params;

  if (!uuid) {
    Response.json(res, Response.error(400, "ACC080", "Uuid não definido."));
    return;
  }

  const userData = await prisma.User.findFirst({
    where: {
      uuid: uuid,
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
    logger.error(`Erro ao tentar obter usuário com o uuid: ${uuid}`);
    Response.json(
      res,
      Response.error(400, "ACC081", "Usuário não encontrado.")
    );
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
    Response.json(res, Response.errorDefault("ACC083"));
    return;
  }

  const pictureBase64 = Buffer.from(accountData.picture).toString("base64");

  if (!isBase64(pictureBase64, { allowMime: true })) {
    logger.error(
      `Erro ao tentar converter a imagem para base64:  ${accountData.picture}`
    );
    Response.json(
      res,
      Response.error(400, "ACC094", "A imagem está corrompida.")
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
    Response.json(res, Response.errorDefault("ACC082"));
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
