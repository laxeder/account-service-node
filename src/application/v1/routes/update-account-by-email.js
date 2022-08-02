const handle = require("../../../infrastructure/utils/handle");

const Response = require("../../../infrastructure/utils/Response");
const Account = require("../../../domain/Account");
const Address = require("../../../domain/Address");
const User = require("../../../domain/User");
const logger = require("../../../infrastructure/config/logger");

/**
 * * Atualizar conta pelo email
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports = async (req, res) => {
  try {
    const { body, prisma } = req;
    const { email } = req.params;

    if (!email) {
      Response.json(res, Response.error(400, "ACC072", "Email não definido."));
      return;
    }

    const userData = await prisma.User.findFirst({
      where: {
        email,
        enabled: true,
      },
    });

    if (userData === null) {
      logger.error(`Erro ao tentar buscar usuário com o email: ${email}`);
      Response.json(res, Response.error(400, "ACC073", "Usuário não existe."));
      return;
    }

    const { first_name, last_name, phone } = body;

    const user = new User(
      first_name || userData.first_name,
      last_name || userData.last_name,
      body.email || userData.email,
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

    const addressData = await prisma.Address.findFirst({
      where: {
        uuid: userData.uuid,
      },
    });
    if (addressData === null) {
      logger.error(
        `Erro ao tentar atualizar endereço:  ${JSON.stringify(addressData)}`
      );
      Response.json(res, Response.errorDefault("ACC074"));
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
      logger.error(
        `Erro ao validar o endereço: ${JSON.stringify(checkAddress)}`
      );

      Response.json(res, checkAddress);
      return;
    }

    const accountData = await prisma.Account.findFirst({
      where: {
        uuid: userData.uuid,
      },
    });

    if (accountData === null) {
      logger.error(
        `Erro ao tentar atualizar conta:  ${JSON.stringify(accountData)}`
      );
      Response.json(res, Response.errorDefault("ACC075"));
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

    const uuid = userData.uuid;

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

    //!Limpando erro do prisma para verificr se usuário já existe
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
          Response.error(400, "ACC106", `O apelido já está em uso.`)
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
          Response.error(400, "ACC107", `O email já está em uso.`)
        );
        return;
      }
    }

    await prisma.Address.update({
      where: { id: addressData.id },
      data: address,
    });

    Response.json(res, Response.result(204));
  } catch (e) {
    logger.error(`Erro ao atualizar conta pelo email. ${e.stack}`);
    Response.json(res, Response.errorDefault("ACC105"));
  }
};
