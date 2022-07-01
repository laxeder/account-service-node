const Response = require('../../../infrastructure/utils/Response');

module.exports = (req, res) => {
  Response.json(res, Response.error(404, "ACC001", "Recurso não encontrado!"));
}; 