// routes/public-routes.js
const express = require('express')
const { body } = require('express-validator')
const { rateLimit } = require('express-rate-limit')
const validate = require('../middleware/validate')
const c = require('../controllers/publicController')

const router = express.Router()

// Rate limit RSVP/messages: 20 req/15min per IP
const guestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Quá nhiều yêu cầu, vui lòng thử lại sau' },
})

// GET /api/public/:slug
router.get('/:slug', c.getPublicInvitation)

// GET /api/public/:slug/messages
router.get('/:slug/messages', c.getMessages)

// POST /api/public/:slug/rsvp
router.post('/:slug/rsvp',
  guestLimiter,
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Tên phải từ 2–100 ký tự'),
    body('status').isIn(['ATTENDING', 'DECLINED', 'MAYBE']).withMessage('Trạng thái không hợp lệ'),
  ],
  validate,
  c.submitRSVP
)

// POST /api/public/:slug/messages
router.post('/:slug/messages',
  guestLimiter,
  [
    body('content').trim().isLength({ min: 1, max: 500 }).withMessage('Lời chúc từ 1–500 ký tự'),
    body('guestName').optional().trim().isLength({ max: 100 }),
  ],
  validate,
  c.submitMessage
)

module.exports = router
