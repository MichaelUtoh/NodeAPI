const crypto = require('crypto');

const createHashedPassword = (password, salt, iterations = 100000, keylen = 24, digest = 'sha512') => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, derivedKey) => {
      if (err) {
        reject(err);
      } else {
        const hashedPassword = (derivedKey.toString('hex'));
        resolve({ hashedPassword, salt, iterations, keylen, digest });
      }
    });
  });
};

const validatePassword = async (password, hashedPassword, salt, iterations, keylen, digest) => {
  try {
    const hashedInputPassword = await createHashedPassword(password, salt, iterations, keylen, digest);
    return hashedInputPassword.hashedPassword === hashedPassword;
  } catch (error) {
    console.error('Error validating password:', error);
    return false;
  }
};

module.exports = { createHashedPassword, validatePassword };