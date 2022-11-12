const jwt = require("jsonwebtoken");

/**
 * * Verifica se é um token válido
 * @param {string} token 
 * @param {string} refresh 
 * @returns 
 */
function jwtVerify(token = "", refresh = "") {
  try {
    const payload = jwt.verify(token, process.env.SIGNATURE);

    return { isValid: true, payload };
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      try {
        const payload = jwt.verify(refresh, process.env.SIGNATURE);

        return { isValid: true, refresh: true, payload };
      } catch (err) {
        throw err;
      }
    }

    throw err;
  }
}

module.exports = jwtVerify;
