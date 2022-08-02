const Response = require("../../../infrastructure/utils/Response");

// Rota para erro interno
module.exports = (req, res) => {
  Response.json(res, Response.errorDefault("ACC002"));
};
