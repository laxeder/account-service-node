const Response = require("../../../infrastructure/utils/response");

module.exports = (req, res) => {
  Response.json(
    res,
    Response.result(200, `UP: ${new Date().toISOString()}`)
  );
};
