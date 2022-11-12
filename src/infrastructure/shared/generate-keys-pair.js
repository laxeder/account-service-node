const crypto = require("crypto");

async function generateKeys() {
  try {
    const secret = "De@14@Jxfjm^MiKpQP6tzKSm83xpa*vfXRi2bSjvtSFGVbwU8Yy&9K*&soIT5ft&EIS";

    const { publicKey: publicKeyData, privateKey: privateKeyData } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
    });

    const publicKey = publicKeyData.export({
      type: "pkcs1",
      format: "pem",
    });

    const privateKey = privateKeyData.export({
      type: "pkcs1",
      format: "pem",
    });

    const signature = crypto.sign("sha256", Buffer.from(secret), {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    });

    return { public: publicKey, private: privateKey, secret, signature: signature.toString("base64") };
  } catch (e) {
    throw e;
  }
}

module.exports = generateKeys;
