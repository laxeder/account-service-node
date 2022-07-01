const uuidLib = require("uuid");
const Response = require("../../../infrastructure/utils/response");
const Account = require("../../../domain/Account");
const Address = require("../../../domain/Address");

module.exports = (req, res) => {
  const { body } = req;
  
  const { street, number, complement, neighborhood, city, state, zipcode } = body;
  const address = new Address(street, number, complement, neighborhood, city, state, zipcode);

  const checkAddress = address.valid();
  if (checkAddress.status !== 200) {
    Response.json(res, checkAddress);
    return;
  }

  const { first_name, last_name, email, phone, password, confirm_password, birthdate, cpf, rg, nickname, picture, profession, company, description } = body;
  const account = new Account(first_name, last_name, email, phone, password, confirm_password, birthdate, cpf, rg, nickname, picture, profession, company, description);

  const checkAccount = account.validate();
  if (checkAccount.status !== 200) {
    Response.json(res, checkAccount);
    return;
  }

  const uuid = uuidLib.v4();
  account.setUuid(uuid);
  account.setCreatedAt(new Date());
  account.setUpdatedAt(new Date());
  account.setEnabled(true);

  Response.json(res, Response.result(201));
};