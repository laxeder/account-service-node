const { AES: crypt } = require("crypto-js");
const keypair = require("keypair");

async function generateKeys() {
  try {
    const { public, private } = keypair();

    const secret = crypt
      .encrypt(public, "De@14@Jxfjm^MiKpQP6tzKSm83xpa*vfXRi2bSjvtSFGVbwU8Yy&9K*&soIT5ft&EIS")
      .toString();

    const signature = crypt.encrypt(private, secret).toString();

    // ? returna o objeto de chaves
    return { public, private, secret, signature };
  } catch (e) {
    throw e;
  }
}

module.exports = generateKeys;
