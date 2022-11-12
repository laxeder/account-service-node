const generateKeys = require("../../../infrastructure/shared/generate-keys-pair");
const writeKeys = require("../../../infrastructure/shared/write-keys-pair");
const readKeys = require("../../../infrastructure/shared/read-keys-pair");

const Response = require("../../../infrastructure/utils/Response");
const logger = require("../../../infrastructure/config/logger");
const handle = require("../../../infrastructure/utils/handle");

/**
 * * Gera novas chaves
 * @param {*} req
 * @param {*} res
 */
module.exports = async (req, res) => {
  try {
    const [err, keysBox] = await handle(generateKeys());

    if (err) {
      logger.error("Erro ao gerar novas chaves:", err);
      Response.json(res, Response.error(500, "ACC127", "Erro interno. Favor tentar novamente."));
      return;
    }

    const [er] = await handle(writeKeys("./keys", keysBox));

    if (er) {
      logger.error("Erro ao salvar chaves:", er);
      Response.json(res, Response.error(500, "ACC128", "Erro interno. Favor tentar novamente."));
      return;
    }

    const [e] = await handle(readKeys("./keys"));

    if (e) {
      logger.error("Erro ao ler chaves:", e);
      Response.json(res, Response.error(500, "ACC129", "Erro interno. Favor tentar novamente."));
      return;
    }

    Response.json(res, Response.result(201));
  } catch (err) {
    console.log("erro ao gerar par de chaves:", err?.stack || err);
    Response.json(res, Response.error(500, "ACC131", "Erro interno. Favor tentar novamente."));
  }
};
