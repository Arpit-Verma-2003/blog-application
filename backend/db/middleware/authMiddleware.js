// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, 'your_jwt_secret_key', (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden
    req.user = user; // Save user info to request
    next();
  });
};

module.exports = { authenticateToken };
