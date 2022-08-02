const tty = require("../sources/tty");

const routinesRun = () => {
  (async () => {
    tty("yarn prisma migrate dev");
  })();
  return (req, res, next) => next();
};

module.exports = routinesRun;
