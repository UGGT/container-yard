// backend/services/authService.js

const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'changeme';
const EXPIRY = '7d';

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    SECRET,
    { expiresIn: EXPIRY }
  );
}

function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = {
  generateToken,
  verifyToken
};
