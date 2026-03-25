const express = require('express');
const router = express.Router();
const { loveStoryController } = require('../controllers');
const { verifyJWT } = require('../utils/auth');

// Get love story by album ID (public route)
router.get('/:albumId', loveStoryController.getLoveStory);

// Create new love story (admin only)
router.post('/', verifyJWT, loveStoryController.createLoveStory);

// Update love story (admin only)
router.put('/:albumId', verifyJWT, loveStoryController.updateLoveStory);

// Add timeline event (admin only)
router.post('/:albumId/events', verifyJWT, loveStoryController.addTimelineEvent);

// Update timeline event (admin only)
router.put('/:albumId/events/:eventId', verifyJWT, loveStoryController.updateTimelineEvent);

// Delete timeline event (admin only)
router.delete('/:albumId/events/:eventId', verifyJWT, loveStoryController.deleteTimelineEvent);

module.exports = router;