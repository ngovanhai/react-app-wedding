const express = require('express');
const router = express.Router();
const qrcodeController = require('../controllers/qrcodeController');
const auth = require('../middleware/auth');

// Create QR code for an album
router.post('/:albumId', auth, qrcodeController.createQRCode);

// Get QR code details by code
router.get('/:code', qrcodeController.getQRCode);

// Deactivate QR code
router.delete('/:code', auth, qrcodeController.deactivateQRCode);

module.exports = router;