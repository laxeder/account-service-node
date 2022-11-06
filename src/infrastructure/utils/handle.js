/**
 * * Retorna o erro ou resultado de uma Promise
 * @param {*} promise 
 * @returns 
 */
const handle = (promise) => {
  return new Promise((resolve, reject) => {
    promise
      .then((data) => {
        resolve([null, data]);
      })
      .catch((err) => {
        resolve([err, null]);
      });
  });
};

module.exports = handle;
