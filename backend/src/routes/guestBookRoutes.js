const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../utils/auth');
const guestBookController = require('../controllers/guestBookController');

// Public routes
router.get('/:id/guests', guestBookController.getGuestsByAlbumId);
router.post('/:id/guests', guestBookController.addGuestMessage);

// Admin routes (require authentication)
router.delete('/:id/guests/:gid', verifyJWT, guestBookController.deleteGuestMessage);

module.exports = router;