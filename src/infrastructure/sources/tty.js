const { exec } = require("child_process");

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
