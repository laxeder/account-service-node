const { RSA, Crypt } = require("hybrid-crypto-js");

const { parseToJson } = require("../utils/parse");
const handle = require("../utils/handle");

const crypt = new Crypt({ md: "sha512" });
const rsa = new RSA({ keySize: 4096 });

async function generateKeys() {
  try {
    // ! extrai o par de chaves publica/privada RSA
    const [err, { privateKey: private, publicKey: public }] = await handle(rsa.generateKeyPairAsync());

    if (err) {
      throw new Error(err);
    }

    // ! gera uma chave IV de uma string forte de 64 caracteres e define a secret
    const { iv: secret } = parseToJson(crypt.encrypt(public, "De@14@Jxfjm^MiKpQP6tzKSm83xpa*vfXRi2bSjvtSFGVbwU8Yy&9K*&soIT5ft&EIS"));

    // ! gera uma chave de assinatura
    const { signature } = parseToJson(await crypt.signature(private, secret));

    // ? returna o objeto de chaves
    return { public, private, secret, signature };
  } catch (e) {
    throw e;
  }
}

module.exports = generateKeys;
