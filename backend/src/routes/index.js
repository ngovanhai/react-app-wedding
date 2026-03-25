// Routes for the wedding photo album app

const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const loveStoryRoutes = require('./loveStoryRoutes');
const albumRoutes = require('./albumRoutes');
const guestBookRoutes = require('./guestBookRoutes');

// Auth routes
router.use('/auth', authRoutes);

// Album routes
router.use('/albums', albumRoutes);

// Guest book routes  
router.use('/albums', guestBookRoutes);

// Love story routes
router.use('/love-story', loveStoryRoutes);

module.exports = router;