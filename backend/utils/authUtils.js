const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.hashPassword = async (password) => bcrypt.hash(password, 10);

exports.generateToken = (user) => jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWTSECRET,
  { expiresIn: '1d' }
);
