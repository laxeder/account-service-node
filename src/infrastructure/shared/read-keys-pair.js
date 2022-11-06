const { PathRead } = require("../utils/handle-path");
const handle = require("../utils/handle");

async function readKeys(path = "") {
  try {
    const [errPriv, private] = await handle(PathRead(`${path}/private-key.pem`));
    if (errPriv) throw new Error(errPriv);

    const [errPub, public] = await handle(PathRead(`${path}/public-key.pem`));
    if (errPub) throw new Error(errPub);

    const [errSec, secret] = await handle(PathRead(`${path}/secret-key.key`));
    if (errSec) throw new Error(errSec);

    const [errSig, signature] = await handle(PathRead(`${path}/siginature.key`));
    if (errSig) throw new Error(errSig);

    process.env.PRIVATE_KEY = private || "";
    process.env.PUBLIC_KEY = public || "";
    process.env.SECRET_KEY = secret || "";
    process.env.SIGNATURE = signature || "";

    return { public, private, secret, signature };
  } catch (e) {
    return e;
  }
}

module.exports = readKeys;
