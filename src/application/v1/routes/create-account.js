const uuidLib = require("uuid");
const nonce = require("nonce")();

const { createHash } = require("../../../infrastructure/utils/password");
const Response = require("../../../infrastructure/utils/Response");
const logger = require("../../../infrastructure/config/logger");
const Address = require("../../../domain/Address");
const Account = require("../../../domain/Account");
const User = require("../../../domain/User");
const mysqlHealth = require("../../../infrastructure/shared/mysql-health");

/**
 * * Cria uma conta
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports = async (req, res) => {
  try {
    const { body, prisma } = req;

    const { street, number, complement, neighborhood, city, state, zipcode } =
      body;
    const address = new Address(
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      zipcode
    );

    // Cria e válida endereço
    const checkAddress = address.valid();
    if (checkAddress.status !== 200) {
      logger.error(
        `Erro ao validar o endereço: ${JSON.stringify(checkAddress)}`
      );

      Response.json(res, checkAddress);
      return;
    }

    const {
      first_name,
      last_name,
      email,
      phone,
      password,
      confirm_password,
      birthdate,
      cpf,
      rg,
      nickname,
      picture,
      profession,
      company,
      description,
    } = body;

    const user = new User(
      first_name,
      last_name,
      email,
      phone,
      password,
      confirm_password
    );

    // Cria e válida usuário
    const checkUser = user.valid();
    if (checkUser.status !== 200) {
      logger.error(`Erro ao validar o usuario: ${JSON.stringify(checkUser)}`);
      Response.json(res, checkUser);
      return;
    }

    const account = new Account(
      birthdate,
      cpf,
      rg,
      nickname,
      picture,
      profession,
      company,
      description
    );

    // Cria e válida conta
    const checkAccount = account.valid();
    if (checkAccount.status !== 200) {
      logger.error(`Erro ao validar a conta: ${JSON.stringify(checkAccount)}`);

      Response.json(res, checkAccount);
      return;
    }

    const [err] = await mysqlHealth(prisma);
    if (err) {
      logger.error(`Erro ao tentar acessar o banco de dados: ${err.stack}`);
      Response.json(res, Response.errorDefault("ACC116"));
      return;
    }

    // Verifica se email já está em uso
    const checkEmail = await prisma.User.findUnique({
      where: {
        email: user.email,
      },
      select: {
        email: true,
      },
    });

    if (checkEmail !== null) {
      logger.error(`Erro ao tentar criar conta com o email: ${user.email}`);
      Response.json(
        res,
        Response.error(
          400,
          "ACC064",
          "Esse email já existe. Favor tentar com outro email."
        )
      );
      return;
    }

    // Verifica se cpf já está em uso
    const checkCPF = await prisma.Account.findUnique({
      where: {
        cpf: account.cpf,
      },
      select: {
        cpf: true,
      },
    });

    if (checkCPF !== null) {
      logger.error(`Erro ao tentar criar conta com o cpf: ${account.cpf}`);
      Response.json(
        res,
        Response.error(
          400,
          "ACC065",
          "Esse cpf já existe. Favor tentar com outro cpf."
        )
      );
      return;
    }

    // Verifica se rg já está em uso
    const checkRG = await prisma.Account.findUnique({
      where: {
        rg: account.rg,
      },
      select: {
        rg: true,
      },
    });

    if (checkRG !== null) {
      logger.error(`Erro ao tentar criar conta com o rg: ${account.rg}`);

      Response.json(
        res,
        Response.error(
          400,
          "ACC066",
          "Esse rg já existe. Favor tentar com outro rg."
        )
      );
      return;
    }

    // Verifica se apelido já está em uso
    const checkNickname = await prisma.Account.findUnique({
      where: {
        nickname: account.nickname,
      },
      select: {
        nickname: true,
      },
    });

    if (checkNickname !== null) {
      logger.error(
        `Erro ao tentar criar conta com o nickname: ${account.nickname}`
      );

      Response.json(
        res,
        Response.error(
          400,
          "ACC067",
          "Esse apelido já existe. Favor tentar com outro apelido."
        )
      );
      return;
    }

    // Cria um uuid e uid aleatório
    const uuid = uuidLib.v4();
    const uid = BigInt(nonce());

    // Define ids
    address.setUuid(uuid);
    account.setUuid(uuid);
    user.setUuid(uuid);
    user.setUid(uid);
    user.setCreatedAt(new Date());
    user.setUpdatedAt(new Date());
    user.setEnabled(true);

    // Cria e define senha
    const { hash, salt } = createHash(user.password);
    user.setPassword(hash, salt);
    user.setFullName(user.firstName, user.lastName);

    //? O prisma não aceita enviar outros campos, então retiro ele antes de enviá-lo
    delete user.confirmPassword;

    // Cria conta no banco de dados
    await prisma.User.create({ data: user });
    await prisma.Account.create({ data: account });
    await prisma.Address.create({ data: address });

    Response.json(res, Response.result(201));
  } catch (e) {
    logger.error(`Erro ao tentar criar um usuario. ${e.stack}`);
    Response.json(res, Response.errorDefault("ACC063"));
  }
};
