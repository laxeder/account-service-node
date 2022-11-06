const Hashes = require("jshashes");

/**
 * * Cria uma hash
 * @param {*} password
 * @returns
 */
function createHash(password) {
  const salt = shuffle(password);
  const hash = sha1(assemblerPass(password, salt));

  return { hash, salt };
}

/**
 * * Válida se as hash combinam
 * @param {*} hash 
 * @param {*} salt 
 * @param {*} password 
 * @returns 
 */
function validHash(hash, salt, password) {
  const newHash = sha1(assemblerPass(password, salt));
  return newHash === hash;
}

/**
 * * Gera uma salt para uma hash
 * @param {*} password
 * @returns
 */
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

/**
 * * Monta uma senha
 * @param {*} password
 * @param {*} salt
 * @returns
 */
function assemblerPass(password, salt) {
  return `${password}${salt}`;
}

/**
 * * Gera uma hash em sha1
 * @param {*} password
 * @param {*} salt
 * @returns
 */
function sha1(password) {
  return new Hashes.SHA1().hex(password);
}

module.exports = {
  createHash,
  assemblerPass,
  shuffle,
  sha1,
  validHash,
};
