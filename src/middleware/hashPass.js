const crypto = require('crypto');

const createHashedPassword = (password, salt, iterations = 100000, keylen = 24, digest = 'sha512') => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, derivedKey) => {
      if (err) {
        reject(err);
      } else {
        resolve(derivedKey.toString('hex'));
      }
    });
  });
};

module.exports = createHashedPassword;