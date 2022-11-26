const Response = require("../../../infrastructure/utils/Response");

/**
 * * Retorna se servidor está ativado
 * @param {*} req
 * @param {*} res
 */
module.exports = (req, res) => {
  Response.json(res, Response.result(200, `UP: ${new Date().toISOString()}`));
};
