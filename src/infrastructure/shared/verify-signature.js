const crypto = require("crypto");

function verify(signature = "") {
  return crypto.verify(
    "sha256",
    Buffer.from(process.env.SECRET_KEY),
    {
      key: process.env.PUBLIC_KEY,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    },
    Buffer.from(signature, "base64")
  );
}

module.exports = verify;
