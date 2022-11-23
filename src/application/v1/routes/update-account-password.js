const handle = require("../../../infrastructure/utils/handle");

const {
  createHash,
  validHash,
} = require("../../../infrastructure/utils/password");
const Response = require("../../../infrastructure/utils/Response");
const logger = require("../../../infrastructure/config/logger");
const User = require("../../../domain/User");

/**
 * * Atualizar a senha pelo uuid
 * @param {*} req
 * @param {*} res
 * @returns
 */
module.exports = async (req, res) => {
  const { body, prisma } = req;
  const { uuid } = req.params;
  const { password, new_password, confirm_password } = body;

  if (!uuid) {
    Response.json(res, Response.error(400, "ACC118", "Uuid não definido."));
    return;
  }

  if (password == new_password) {
    Response.json(
      res,
      Response.error(
        400,
        "ACC121",
        "As senhas passadas estão iguais. Favor passar uma nova senha diferente."
      )
    );
    return;
  }

  const userData = await prisma.User.findFirst({
    where: {
      uuid,
      enabled: true,
    },
  });

  if (userData === null) {
    logger.error(`Erro ao tentar buscar usuário com o uuid: ${uuid}`);
    Response.json(
      res,
      Response.error(400, "ACC119", "Este usuário não existe.")
    );
    return;
  }

  if (!validHash(userData.password, userData.salt, password)) {
    logger.error(`Erro ao válidar hash`);
    Response.json(
      res,
      Response.error(
        400,
        "ACC120",
        "A senha antiga não combina com a senha desse usuário. Favor colocar uma senha válida."
      )
    );
    return;
  }

  const user = new User(
    userData.first_name,
    userData.last_name,
    userData.email,
    userData.phone,
    new_password,
    confirm_password
  );

  const checkPassword = user.validPassword();
  if (checkPassword.status !== 200) {
    logger.error(`Erro ao válidar senha.`);
    Response.json(res, checkPassword);
    return;
  }

  const checkConfirmPassword = user.validConfirmPassword();
  if (checkConfirmPassword.status !== 200) {
    logger.error(`Erro ao válidar confirmação de senha.`);
    Response.json(res, checkConfirmPassword);
    return;
  }

  user.setUuid(uuid);
  user.setUid(userData.uid);
  user.setCreatedAt(userData.createdAt);
  user.setEnabled(userData.enabled);
  user.setFullName(user.firstName, user.lastName);
  user.setUpdatedAt(new Date());

  const { hash, salt } = createHash(new_password);
  user.setPassword(hash, salt);

  //? O prisma não aceita enviar outros campos, então retiro ele antes de enviá-lo
  delete user.confirmPassword;

  //!Limpando erro do prisma para verificar se usuário já existe
  //TODO: Mapear no futuro quais são os erros @unique do Account
  const [userErr] = await handle(
    prisma.User.update({
      where: { id: userData.id },
      data: user,
    })
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

  Response.json(res, Response.result(204));
};
