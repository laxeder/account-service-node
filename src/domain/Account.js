const Response = require("../infrastructure/utils/Response");
const User = require("./User");
const cpf = require("@fnando/cpf");
const regex = require("../infrastructure/utils/regex");
const isBase64 = require("is-base64");

class Account extends User {
  constructor(
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    phone,
    birthdate,
    cpf,
    rg,
    nickname,
    picture,
    profession,
    company,
    description
  ) {
    super(firstName, lastName, email, password, confirmPassword, phone);

    this.birthdate = birthdate;
    this.cpf = cpf;
    this.rg = rg;
    this.nickname = nickname;
    this.picture = picture;
    this.profession = profession;
    this.company = company;
    this.description = description;

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

  validBirthdate() {
    if (!!!this.birthdate) {
      return Response.error(400, "ACC019", "O campo data é obrigátorio.");
    }

    const timestamp = Date.parse(this.birthdate);

    if (isNaN(timestamp)) {
      return Response.error(400, "ACC020", "O campo data não é válido.");
    }

    const now = new Date(Date.now()).getFullYear();
    const birthdate = new Date(this.birthdate).getFullYear();

    if (now - birthdate > 120) {
      return Response.error(
        400,
        "ACC043",
        "A data de aniversário precisa ser menor que 120 anos."
      );
    }

    if (now - birthdate < 8) {
      return Response.error(
        400,
        "ACC044",
        "A data de aniversário precisa ser menor que 8 anos."
      );
    }

    return Response.result(200);
  }

  validCPF() {
    if (!!!this.cpf) {
      return Response.error(400, "ACC045", "O campo cpf é obrigátorio.");
    }

    if (!cpf.isValid(this.cpf)) {
      return Response.error(400, "ACC052", "CPF inválido");
    }

    return Response.result(200);
  }

  validRG() {
    if (!!!this.rg) {
      return Response.error(400, "ACC046", "O campo rg é obrigátorio.");
    }

    if (regex.hasLetter.test(this.rg)) {
      return Response.error(
        400,
        "ACC053",
        "O campo rg não pode conter letras."
      );
    }

    if (regex.hasCharSpecialsRG.test(this.rg)) {
      return Response.error(
        400,
        "ACC058",
        "O campo rg não pode conter caracteres especiais."
      );
    }

    return Response.result(200);
  }

  validNickname() {
    if (!!!this.nickname) {
      return Response.error(400, "ACC054", "O campo apelido é obrigatório.");
    }

    if (this.nickname.length < 3) {
      return Response.error(
        400,
        "ACC055",
        "O campo apelido deve ter no mínimo 3 caracteres."
      );
    }

    if (regex.hasNumber.test(this.nickname)) {
      return Response.error(
        400,
        "ACC056",
        "O campo apelido não pode conter números."
      );
    }

    if (regex.hasCharSpecials.test(this.nickname)) {
      return Response.error(
        400,
        "ACC057",
        "O campo apelido não pode conter caracteres especiais."
      );
    }

    return Response.result(200);
  }

  validPicture() {
    if (!!!this.picture.trim()) {
      return Response.error(400, "ACC048", "O campo foto é obrigátorio.");
    }

    if (!isBase64(this.picture, { allowMime: true })) {
      return Response.error(
        400,
        "ACC058",
        "O arquivo esta inválido ou corrompido."
      );
    }

    const buffer = Buffer.from(
      this.picture.substring(this.picture.indexOf(",") + 1)
    );

    if (Math.ceil(buffer.length / 1e3) > 1024) {
      return Response.error(400, "ACC059", "O arquivo deve ser menor que 1MB.");
    }

    return Response.result(200);
  }

  validProfession() {
    if (!!!this.profession) {
      return Response.error(400, "ACC049", "O campo profissão é obrigátorio.");
    }

    if (this.profession.length < 3) {
      return Response.error(
        400,
        "ACC060",
        "O campo profissão deve conter no mínimo 3 caracteres."
      );
    }

    return Response.result(200);
  }

  validCompany() {
    if (!!!this.company) {
      return Response.error(400, "ACC050", "O campo empresa é obrigátorio.");
    }

    if (this.company.length < 3) {
      return Response.error(
        400,
        "ACC061",
        "O campo empresa deve conter no mínimo 3 caracteres."
      );
    }

    return Response.result(200);
  }

  validDescription() {
    if (!!!this.description) {
      return Response.error(400, "ACC051", "O campo descrição é obrigátorio.");
    }

    if (this.description.length < 3) {
      return Response.error(
        400,
        "ACC062",
        "O campo descrição deve conter no mínimo 3 caracteres."
      );
    }

    return Response.result(200);
  }

  validate() {
    const checkValid = this.valid();
    if (!this.hasResult(checkValid)) return checkValid;

    const checkBirthdate = this.validBirthdate();
    if (!this.hasResult(checkBirthdate)) return checkBirthdate;

    const checkCPF = this.validCPF();
    if (!this.hasResult(checkCPF)) return checkCPF;

    const checkRG = this.validRG();
    if (!this.hasResult(checkRG)) return checkRG;

    const checkNickname = this.validNickname();
    if (!this.hasResult(checkNickname)) return checkNickname;

    const checkPicture = this.validPicture();
    if (!this.hasResult(checkPicture)) return checkPicture;

    const checkProfession = this.validProfession();
    if (!this.hasResult(checkProfession)) return checkProfession;

    const checkCompany = this.validCompany();
    if (!this.hasResult(checkCompany)) return checkCompany;

    const checkDescription = this.validDescription();
    if (!this.hasResult(checkDescription)) return checkDescription;

    return Response.result(200);
  }
}

module.exports = Account;
