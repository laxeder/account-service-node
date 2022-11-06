const { exec } = require("child_process");

/**
 * * Executa o comando no terminal
 * @param {*} cmd 
 * @returns 
 */
module.exports = (cmd) => {
  return new Promise((resolve, reject) => {
    try {
      exec(cmd, (error, stdout) => {
        if (error) reject(error);
        resolve(stdout);
      });
    } catch (error) {
      reject(error);
    }
  });
};
