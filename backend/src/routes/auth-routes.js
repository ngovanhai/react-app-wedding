// routes/auth-routes.js
const express = require('express')
const { body } = require('express-validator')
const { rateLimit } = require('express-rate-limit')
const authController = require('../controllers/authController')
const authMiddleware = require('../middleware/auth')
const validate = require('../middleware/validate')

const router = express.Router()

// Rate limit: 10 requests per 15 minutes for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Quá nhiều yêu cầu, vui lòng thử lại sau 15 phút' },
  standardHeaders: true,
  legacyHeaders: false,
})

// POST /api/auth/register
router.post(
  '/register',
  authLimiter,
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Tên phải từ 2–100 ký tự'),
    body('email').isEmail().normalizeEmail().withMessage('Email không hợp lệ'),
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải ít nhất 6 ký tự'),
  ],
  validate,
  authController.register
)

// POST /api/auth/login
router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('Email không hợp lệ'),
    body('password').notEmpty().withMessage('Mật khẩu không được để trống'),
  ],
  validate,
  authController.login
)

// GET /api/auth/me — Protected
router.get('/me', authMiddleware, authController.getMe)

// POST /api/auth/logout
router.post('/logout', authController.logout)

module.exports = router
