const { PathWrite } = require("../utils/handle-path");
const handle = require("../utils/handle");

async function writeKeys(path = "", keysBox = {}) {
  try {
    const [errPub] = await handle(PathWrite(`${path}/private-key.pem`, keysBox.private));
    if (errPub) throw new Error(errPub);

    const [errPriv] = await handle(PathWrite(`${path}/siginature.key`, keysBox.signature));
    if (errPriv) throw new Error(errPriv);

    const [errSec] = await handle(PathWrite(`${path}/public-key.pem`, keysBox.public));
    if (errSec) throw new Error(errSec);

    const [errSig] = await handle(PathWrite(`${path}/secret-key.key`, keysBox.secret));
    if (errSig) throw new Error(errSig);

    return keysBox;
  } catch (e) {
    throw e;
  }
}

module.exports = writeKeys;
