const Response = require("../../../infrastructure/utils/Response");
const terminal = require("../../../infrastructure/sources/tty");

module.exports = async (req, res) => {
  if (req.body.hasOwnProperty("command") && !!!req.body.command) {
    return Response.json(
      res,
      Response.result(200, "Envie um comando para ser executado")
    );
  }

  const tty = await terminal(req.body.command);

  Response.json(res, Response.result(200, tty));
};