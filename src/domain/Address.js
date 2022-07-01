const Response = require("../infrastructure/utils/response");
const regex = require("../infrastructure/utils/regex");

class Address {
  constructor(street, number, complement, neighborhood, city, state, zipcode) {
    this.street = street;
    this.number = number;
    this.complement = complement;
    this.neighborhood = neighborhood;
    this.city = city;
    this.state = state;
    this.zipcode = zipcode;
  }

  validStreet() {
    if (!!!this.street) {
      return Response.error(400, "ACC022", "O campo rua é obrigatório.");
    }

    if (this.street.length < 3) {
      return Response.error(
        400,
        "ACC023",
        "O campo rua deve ter no mínimo 3 caracteres."
      );
    }

    return Response.result(200);
  }

  validNumber() {
    if (!!!this.number) {
      return Response.error(400, "ACC024", "O campo número é obrigatório.");
    }

    if (this.number.length < 1) {
      return Response.error(
        400,
        "ACC025",
        "O campo número deve ter no mínimo 1 caracteres."
      );
    }

    return Response.result(200);
  }

  validNeighborhood() {
    if (!!!this.neighborhood) {
      return Response.error(400, "ACC026", "O campo bairro é obrigatório.");
    }

    if (this.neighborhood.length < 3) {
      return Response.error(
        400,
        "ACC027",
        "O campo bairro deve ter no mínimo 3 caracteres."
      );
    }

    if (!regex.onlyLetters.test(this.neighborhood)) {
      return Response.error(
        400,
        "ACC028",
        "O campo bairro não pode conter números."
      );
    }

    return Response.result(200);
  }

  validCity() {
    if (!!!this.city) {
      return Response.error(400, "ACC029", "O campo cidade é obrigatório.");
    }

    if (this.city.length < 3) {
      return Response.error(
        400,
        "ACC030",
        "O campo cidade deve ter no mínimo 3 caracteres."
      );
    }

    if (!regex.onlyLetters.test(this.city)) {
      return Response.error(
        400,
        "ACC031",
        "O campo cidade não pode conter números."
      );
    }

    return Response.result(200);
  }

  validState() {
    if (!!!this.state) {
      return Response.error(400, "ACC032", "O campo estado é obrigatório.");
    }

    if (this.state.length < 2) {
      return Response.error(
        400,
        "ACC033",
        "O campo estado deve ter no mínimo 2 caracteres."
      );
    }

    if (!regex.onlyLetters.test(this.state)) {
      return Response.error(
        400,
        "ACC034",
        "O campo estado não pode conter números."
      );
    }

    return Response.result(200);
  }

  validZipcode() {
    if (!!!this.zipcode) {
      return Response.error(400, "ACC035", "O campo CEP é obrigatório.");
    }

    if (this.zipcode.length < 8) {
      return Response.error(
        400,
        "ACC036",
        "O campo CEP deve ter no mínimo 8 caracteres."
      );
    }

    if (!regex.onlyNumbers.test(this.zipcode)) {
      return Response.error(
        400,
        "ACC037",
        "O campo CEP não pode conter letras."
      );
    }

    return Response.result(200);
  }

  valid() {
    const checkStreet = this.validStreet();
    if (!this.hasResult(checkStreet)) return checkStreet;

    const checkNumber = this.validNumber();
    if (!this.hasResult(checkNumber)) return checkNumber;

    const checkNeighborhood = this.validNeighborhood();
    if (!this.hasResult(checkNeighborhood)) return checkNeighborhood;

    const checkCity = this.validCity();
    if (!this.hasResult(checkCity)) return checkCity;

    const checkState = this.validState();
    if (!this.hasResult(checkState)) return checkState;

    const checkZipcode = this.validZipcode();
    if (!this.hasResult(checkZipcode)) return checkZipcode;

    return Response.result(200, "");
  }

  hasResult(result) {
    return result.status === 200;
  }
}

module.exports = Address;