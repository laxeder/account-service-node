const Hashes = require("jshashes");

function createHash(password) {
  const salt = shuffle(password);
  const hash = new Hashes.SHA1().hex(assemblerPass(password, salt));

  return { hash, salt };
}

function shuffle(password) {
  let salt = password;

  for (let i = 0; i < 10; i++) {
    const ura = String(
      Math.floor(Math.random() * (Date.now() - 1) + 1)
    ).padStart(8, "0");
    const replaceSalt = salt.substring(0, password.length + 8);
    const passLength = replaceSalt.length;
    const passMid = passLength / 2;
    const sup = replaceSalt.substring(0, passMid);
    const sub = replaceSalt.substring(passMid, passLength);

    salt = `${sup}${ura}${sub}${ura.split("").reverse().join("")}`;
    salt = salt.substring(0, 16);
  }

  return String(Buffer.from(salt, "base64")).substring(0, 16);
}

function assemblerPass(password, salt) {
  return `${password}${salt}`;
}

module.exports = {
  createHash,
  assemblerPass,
  shuffle,
};
