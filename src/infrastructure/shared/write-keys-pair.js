const { PathWrite } = require("../utils/handle-path");
const handle = require("../utils/handle");

async function writeKeys(path = "", keysBox = {}) {
  try {
    const [errPub, respPub] = await handle(PathWrite(`${path}/private-key.pem`, keysBox.public));
    if (errPub) throw new Error(errPub);

    const [errPriv, respPriv] = await handle(PathWrite(`${path}/siginature.key`, keysBox.private));
    if (errPriv) throw new Error(errPriv);

    const [errSec, respSec] = await handle(PathWrite(`${path}/public-key.pem`, keysBox.secret));
    if (errSec) throw new Error(errSec);

    const [errSig, respSig] = await handle(PathWrite(`${path}/secret-key.key`, keysBox.signature));
    if (errSig) throw new Error(errSig);

    return keysBox;
  } catch (e) {
    throw e;
  }
}

module.exports = writeKeys;
