const express = require('express');
const router = express.Router();
const livewallController = require('../controllers/livewallController');

router.post('/', livewallController.initialize);
router.post('/:albumId/message', livewallController.addMessage);
router.get('/:albumId', livewallController.getMessages);
router.put('/:albumId/message/:messageId/approve', livewallController.approveMessage);
router.put('/:albumId/activate', livewallController.toggleActivation);

module.exports = router;