const handle = require("../../../infrastructure/utils/handle");

const Response = require("../../../infrastructure/utils/Response");
const Account = require("../../../domain/Account");
const Address = require("../../../domain/Address");
const User = require("../../../domain/User");
const logger = require("../../../infrastructure/config/logger");

/**
 * * Atualizar conta pelo uuid
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports = async (req, res) => {
  const { body, prisma } = req;
  const { uuid } = req.params;

  if (!uuid) {
    Response.json(res, Response.error(400, "ACC071", "Uuid não definido."));
    return;
  }

  const findUuid = {
    where: {
      uuid,
      enabled: true,
    },
  };

  const userData = await prisma.User.findFirst(findUuid);

  if (userData === null) {
    logger.error(`Erro ao tentar buscar usuário com o uuid: ${uuid}`);
    Response.json(res, Response.error(400, "ACC068", "Usuário não existe."));
    return;
  }

  const { first_name, last_name, email, phone } = body;

  const user = new User(
    first_name || userData.first_name,
    last_name || userData.last_name,
    email || userData.email,
    phone || userData.phone
  );

  const checkFirstName = user.validFirstName();
  if (!user.hasResult(checkFirstName)) {
    return Response.json(res, checkFirstName);
  }

  const checkLastName = user.validLastName();
  if (!user.hasResult(checkLastName)) {
    return Response.json(res, checkLastName);
  }

  const checkEmail = user.validEmail();
  if (!user.hasResult(checkEmail)) {
    return Response.json(res, checkEmail);
  }

  const checkPhone = user.validPhone();
  if (!user.hasResult(checkPhone)) {
    return Response.json(res, checkPhone);
  }

  const addressData = await prisma.Address.findFirst(findUuid);
  if (addressData === null) {
    logger.error(
      `Erro ao tentar atualizar endereço:  ${JSON.stringify(addressData)}`
    );
    Response.json(res, Response.errorDefault("ACC069"));
    return;
  }

  const { street, number, complement, neighborhood, city, state, zipcode } =
    body;

  const address = new Address(
    street || addressData.street,
    number || addressData.number,
    complement || addressData.complement,
    neighborhood || addressData.neighborhood,
    city || addressData.city,
    state || addressData.state,
    zipcode || addressData.zipcod
  );

  const checkAddress = address.valid();
  if (checkAddress.status !== 200) {
    logger.error(`Erro ao validar o endereço: ${JSON.stringify(checkAddress)}`);

    Response.json(res, checkAddress);
    return;
  }

  const accountData = await prisma.Account.findFirst(findUuid);

  if (accountData === null) {
    logger.error(
      `Erro ao tentar atualizar conta:  ${JSON.stringify(accountData)}`
    );
    Response.json(res, Response.errorDefault("ACC070"));
    return;
  }

  const {
    birthdate,
    cpf,
    rg,
    nickname,
    picture,
    profession,
    company,
    description,
  } = body;

  const account = new Account(
    birthdate || accountData.birthdate,
    cpf || accountData.cpf,
    rg || accountData.rg,
    nickname || accountData.nickname,
    picture || accountData.picture,
    profession || accountData.profession,
    company || accountData.company,
    description || accountData.description
  );

  const checkAccount = account.valid();
  if (checkAccount.status !== 200) {
    logger.error(`Erro ao validar a conta: ${JSON.stringify(checkAccount)}`);

    Response.json(res, checkAccount);
    return;
  }

  address.setUuid(uuid);
  account.setUuid(uuid);
  user.setUuid(uuid);
  user.setUid(userData.uid);
  user.setCreatedAt(userData.createdAt);
  user.setUpdatedAt(new Date());
  user.setEnabled(userData.enabled);

  user.setPassword(userData.password, userData.salt);
  user.setFullName(user.firstName, user.lastName);

  //? O prisma não aceita enviar outros campos, então retiro ele antes de enviá-lo
  delete user.confirmPassword;

  //!Limpando erro do prisma para verificar se usuário já existe
  //TODO: Mapear no futuro quais são os erros @unique do Account
  const [accountErr] = await handle(
    prisma.Account.update({
      where: { id: accountData.id },
      data: account,
    })
  );

  if (accountErr) {
    const {
      meta: { target },
    } = accountErr;

    if (target === "Accounts_nickname_key") {
      Response.json(
        res,
        Response.error(400, "ACC108", `O apelido já está em uso.`)
      );
      return;
    }
  }

  const [userErr] = await handle(
    prisma.User.update({ where: { id: userData.id }, data: user })
  );

  if (userErr) {
    const {
      meta: { target },
    } = userErr;

    if (target === "Users_email_key") {
      Response.json(
        res,
        Response.error(400, "ACC109", `O email já está em uso.`)
      );
      return;
    }
  }

  await prisma.Address.update({ where: { id: addressData.id }, data: address });

  Response.json(res, Response.result(204));
};
