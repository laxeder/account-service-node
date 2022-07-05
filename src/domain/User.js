const Response = require("../infrastructure/utils/Response");
const regex = require("../infrastructure/utils/regex");

/*
alexSandro - camelCase
AlexSandro - PascalCase
alex_sandro - snakeCase
alex-sandro - kebabCase
*/
class User {
  constructor(firstName, lastName, email, phone, password, confirmPassword) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.fullName = `${firstName} ${lastName}`;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.confirmPassword = confirmPassword;

    this.uuid = "";
    this.createdAt = "";
    this.updatedAt = "";
    this.enabled = false;
  }

  setUuid(uuid) {
    return (this.uuid = uuid);
  }

  setCreatedAt(createdAt) {
    return (this.createdAt = createdAt);
  }

  setUpdatedAt(updatedAt) {
    return (this.updatedAt = updatedAt);
  }

  setEnabled(enabled) {
    return (this.enabled = enabled);
  }

  setFullName(firstName = "", lastName = "") {
    if (!!firstName) {
      this.firstName = firstName;
    }

    if (!!lastName) {
      this.lastName = lastName;
    }

    this.fullName = `${this.firstName} ${this.lastName}`;
  }

  validFirstName() {
    if (!!!this.firstName) {
      return Response.error(400, "ACC003", "O campo nome é obrigatório.");
    }

    if (this.firstName.length < 3) {
      return Response.error(
        400,
        "ACC004",
        "O campo nome deve ter no mínimo 3 caracteres."
      );
    }

    if (regex.hasNumber.test(this.firstName)) {
      return Response.error(
        400,
        "ACC005",
        "O campo nome não pode conter números."
      );
    }

    if (regex.hasCharSpecials.test(this.firstName)) {
      return Response.error(
        400,
        "ACC006",
        "O campo nome não pode conter caracteres especiais."
      );
    }

    return Response.result(200);
  }

  validLastName() {
    if (!!!this.lastName) {
      return Response.error(400, "ACC007", "O campo sobrenome é obrigatório.");
    }

    if (this.lastName.length < 3) {
      return Response.error(
        400,
        "ACC008",
        "O campo sobrenome deve ter no mínimo 3 caracteres."
      );
    }

    if (regex.hasNumber.test(this.lastName)) {
      return Response.error(
        400,
        "ACC009",
        "O campo sobrenome não pode conter números."
      );
    }

    if (regex.hasCharSpecials.test(this.lastName)) {
      return Response.error(
        400,
        "ACC010",
        "O campo sobrenome não pode conter caracteres especiais."
      );
    }

    return Response.result(200);
  }

  validEmail() {
    if (!!!this.email) {
      return Response.error(400, "ACC011", "O campo email é obrigatório.");
    }

    if (this.email.length < 3) {
      return Response.error(
        400,
        "ACC012",
        "O campo email deve ter no mínimo 3 caracteres."
      );
    }

    if (regex.hasCharSpecialsEmail.test(this.email)) {
      return Response.error(
        400,
        "ACC013",
        "Email ínvalido. Não pode conter caracteres especiais."
      );
    }

    if (!regex.isEmail.test(this.email)) {
      return Response.error(400, "ACC014", "Email ínvalido");
    }

    return Response.result(200);
  }

  validPhone() {
    if (!!!this.phone) {
      return Response.error(400, "ACC015", "O campo número é obrigatório.");
    }

    if (this.phone.length < 11 || this.phone.length > 15) {
      return Response.error(
        400,
        "ACC038",
        "O campo telefone deve conter o seguinte formato (xx) xxxxx-xxxx."
      );
    }

    if (regex.hasLetterPhone.test(this.phone)) {
      return Response.error(
        400,
        "ACC016",
        "O campo telefone não pode conter letras ou caracteres especiais."
      );
    }

    return Response.result(200);
  }

  validPassword() {
    if (!!!this.password) {
      return Response.error(400, "ACC017", "O campo senha é obrigatório.");
    }

    if (this.password.length < 8) {
      return Response.error(
        400,
        "ACC018",
        "O campo senha deve ter no mínimo 8 caracteres."
      );
    }

    if (!regex.hasCharSpecials.test(this.password)) {
      return Response.error(
        400,
        "ACC039",
        "O campo senha deve conter pelo menos um caractere especial."
      );
    }

    if (!regex.hasLetterLowerCase.test(this.password)) {
      return Response.error(
        400,
        "ACC040",
        "O campo senha deve conter pelo menos uma letra minúscula."
      );
    }

    if (!regex.hasLetterUpperCase.test(this.password)) {
      return Response.error(
        400,
        "ACC041",
        "O campo senha deve conter pelo menos uma letra maiúscula."
      );
    }

    if (!regex.hasNumber.test(this.password)) {
      return Response.error(
        400,
        "ACC042",
        "O campo senha deve conter pelo menos um número."
      );
    }

    return Response.result(200);
  }

  validConfirmPassword() {
    if (this.confirmPassword !== this.password) {
      return Response.error(
        400,
        "ACC021",
        "O campo confirmar senha não combina com a senha passada."
      );
    }

    return Response.result(200);
  }

  valid() {
    const checkFirstName = this.validFirstName();
    if (!this.hasResult(checkFirstName)) return checkFirstName;

    const checkLastName = this.validLastName();
    if (!this.hasResult(checkLastName)) return checkLastName;

    const checkEmail = this.validEmail();
    if (!this.hasResult(checkEmail)) return checkEmail;

    const checkPhone = this.validPhone();
    if (!this.hasResult(checkPhone)) return checkPhone;

    const checkPassword = this.validPassword();
    if (!this.hasResult(checkPassword)) return checkPassword;

    const checkConfirmPassword = this.validConfirmPassword();
    if (!this.hasResult(checkConfirmPassword)) return checkConfirmPassword;

    return Response.result(200, "");
  }

  hasResult(result) {
    return result.status === 200;
  }
}

module.exports = User;
