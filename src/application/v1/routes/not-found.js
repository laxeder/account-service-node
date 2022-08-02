const Response = require('../../../infrastructure/utils/Response');

/**
 * * Rota para página não encontrada
 * @param {*} req 
 * @param {*} res 
 */
module.exports = (req, res) => {
  Response.json(res, Response.error(404, "ACC001", "Recurso não encontrado!"));
}; 