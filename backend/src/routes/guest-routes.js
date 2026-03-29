// routes/guest-routes.js
const express = require('express')
const { body, query } = require('express-validator')
const auth = require('../middleware/auth')
const validate = require('../middleware/validate')
const c = require('../controllers/guestController')

const router = express.Router({ mergeParams: true }) // inherit :id from parent

router.use(auth)

// GET /api/invitations/:id/guests?rsvpStatus=ATTENDING&page=1
router.get('/', [
  query('rsvpStatus').optional().isIn(['ATTENDING', 'DECLINED', 'PENDING']),
  query('page').optional().isInt({ min: 1 }),
], validate, c.getGuests)

// GET /api/invitations/:id/guests/stats
router.get('/stats', c.getGuestStats)

// GET /api/invitations/:id/guests/export
router.get('/export', c.exportGuests)

// POST /api/invitations/:id/guests
router.post('/', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Tên phải từ 2–100 ký tự'),
  body('rsvpStatus').optional().isIn(['ATTENDING', 'DECLINED', 'PENDING']),
  body('side').optional().isIn(['GROOM', 'BRIDE', 'BOTH']),
  body('partySize').optional().isInt({ min: 1, max: 20 }),
], validate, c.addGuest)

// PUT /api/invitations/:id/guests/:guestId
router.put('/:guestId', [
  body('rsvpStatus').optional().isIn(['ATTENDING', 'DECLINED', 'PENDING']),
  body('partySize').optional().isInt({ min: 1, max: 20 }),
], validate, c.updateGuest)

// DELETE /api/invitations/:id/guests/:guestId
router.delete('/:guestId', c.deleteGuest)

module.exports = router
