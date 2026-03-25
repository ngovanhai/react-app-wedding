const express = require('express');
const router = express.Router();
const livewallController = require('../controllers/livewallController');
const auth = require('../middleware/auth');

// Initialize Live Wall for an album
router.post('/initialize/:albumId', auth, livewallController.initializeLiveWall);

// Add message to Live Wall
router.post('/:albumId/messages', livewallController.addMessage);

// Get messages from Live Wall
router.get('/:albumId/messages', livewallController.getMessages);

// Approve a message (requires auth)
router.put('/:albumId/messages/approve', auth, livewallController.approveMessage);

// Toggle Live Wall activation
router.put('/:albumId/toggle', auth, livewallController.toggleActivation);

module.exports = router;