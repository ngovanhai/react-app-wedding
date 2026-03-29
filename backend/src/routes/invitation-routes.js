// routes/invitation-routes.js
const express = require('express')
const { body } = require('express-validator')
const auth = require('../middleware/auth')
const validate = require('../middleware/validate')
const c = require('../controllers/invitationController')

const router = express.Router()

// All invitation routes require auth
router.use(auth)

// GET /api/invitations
router.get('/', c.getInvitations)

// POST /api/invitations
router.post('/',
  [
    body('templateId').notEmpty().withMessage('Template ID là bắt buộc'),
    body('title').optional().isLength({ max: 200 }).withMessage('Tiêu đề tối đa 200 ký tự'),
  ],
  validate,
  c.createInvitation
)

// GET /api/invitations/:id
router.get('/:id', c.getInvitation)

// PUT /api/invitations/:id
router.put('/:id', c.updateInvitation)

// POST /api/invitations/:id/publish
router.post('/:id/publish', c.publishInvitation)

// DELETE /api/invitations/:id
router.delete('/:id', c.deleteInvitation)

// Phase 6: Guest management sub-routes
router.use('/:id/guests', require('./guest-routes'))

module.exports = router

