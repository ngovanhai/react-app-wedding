// middleware/auth.js — JWT Authentication middleware
const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  // Support both cookie and Authorization header
  const token =
    req.cookies?.token ||
    req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized — no token' })
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' })
    }
    return res.status(401).json({ error: 'Invalid token' })
  }
}

module.exports = authMiddleware
