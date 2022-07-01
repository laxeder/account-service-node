const routinesRun = () => {
  (async () => {
    console.log("Routines run");
  })();
  return (req, res, next) => next();
};

module.exports = routinesRun;
