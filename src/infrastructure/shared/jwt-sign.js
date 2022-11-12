const jwt = require("jsonwebtoken");

/**
 * * Criar Token (JWT)
 * @param {any} data
 * @param {string, number} expiresIn
 * @param {any} options
 */
function sign(data = {}, expiresIn = "1h", options = {}) {
  return jwt.sign(data, process.env.SIGNATURE, { ...options, expiresIn });
}

module.exports = sign;
