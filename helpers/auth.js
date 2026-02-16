const bcrypt = require('bcryptjs');
const crypto = require('crypto');

exports.hashPassword = (password) => bcrypt.hash(password, 12);

exports.comparePasswords = (inputPassword, hashedPassword) => bcrypt.compare(inputPassword, hashedPassword);

exports.generateToken = () =>
  new Promise((resolve, reject) => {
    crypto.randomBytes(32, (err, buffer) => {
      if (err) reject(err);
      else resolve(buffer.toString('hex'));
    });
  });
