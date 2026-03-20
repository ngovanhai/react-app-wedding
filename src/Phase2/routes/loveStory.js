const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const LoveStory = require('../models/LoveStory');
const Album = require('../models/Album');

// Helper: Check if user is album owner (admin)
const checkAlbumOwnership = async (req, res, next) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) {
      return res.status(404).json({ msg: 'Album not found' });
    }
    
    // For admin routes, check ownership
    if (album.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    req.album = album;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// GET /api/albums/:id/story - Get love story (public)
router.get('/:id/story', async (req, res) => {
  try {
    const loveStory = await LoveStory.findOne({ albumId: req.params.id });
    if (!loveStory) {
      return res.status(404).json({ msg: 'Love story not found' });
    }
    res.json(loveStory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST /api/albums/:id/story - Create/Update story (admin)
router.post('/:id/story', auth, checkAlbumOwnership, async (req, res) => {
  const { timeline } = req.body;
  
  try {
    // Validate timeline items
    if (!timeline || !Array.isArray(timeline)) {
      return res.status(400).json({ msg: 'Timeline array is required' });
    }
    
    // Validate each timeline item
    for (let i = 0; i < timeline.length; i++) {
      const item = timeline[i];
      if (!item.title || !item.date) {
        return res.status(400).json({ msg: `Timeline item ${i} missing required fields` });
      }
      // Set order if not provided
      if (item.order === undefined) {
        item.order = i;
      }
    }
    
    let loveStory = await LoveStory.findOne({ albumId: req.params.id });
    
    if (loveStory) {
      // Update existing
      loveStory.timeline = timeline;
      await loveStory.save();
    } else {
      // Create new
      loveStory = new LoveStory({
        albumId: req.params.id,
        timeline
      });
      await loveStory.save();
    }
    
    res.json(loveStory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PUT /api/albums/:id/story - Update story (admin)  
router.put('/:id/story', auth, checkAlbumOwnership, async (req, res) => {
  const { timeline } = req.body;
  
  try {
    if (!timeline || !Array.isArray(timeline)) {
      return res.status(400).json({ msg: 'Timeline array is required' });
    }
    
    for (let i = 0; i < timeline.length; i++) {
      const item = timeline[i];
      if (!item.title || !item.date) {
        return res.status(400).json({ msg: `Timeline item ${i} missing required fields` });
      }
      if (item.order === undefined) {
        item.order = i;
      }
    }
    
    let loveStory = await LoveStory.findOne({ albumId: req.params.id });
    if (!loveStory) {
      return res.status(404).json({ msg: 'Love story not found' });
    }
    
    loveStory.timeline = timeline;
    await loveStory.save();
    res.json(loveStory);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// DELETE /api/albums/:id/story - Delete story (admin)
router.delete('/:id/story', auth, checkAlbumOwnership, async (req, res) => {
  try {
    const loveStory = await LoveStory.findOneAndDelete({ albumId: req.params.id });
    if (!loveStory) {
      return res.status(404).json({ msg: 'Love story not found' });
    }
    res.json({ msg: 'Love story deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// GET /api/albums/:id/story/timeline - Get timeline only (public)
router.get('/:id/story/timeline', async (req, res) => {
  try {
    const loveStory = await LoveStory.findOne({ albumId: req.params.id });
    if (!loveStory) {
      return res.status(404).json({ msg: 'Love story not found' });
    }
    // Return only timeline array, sorted by order
    const sortedTimeline = [...loveStory.timeline].sort((a, b) => a.order - b.order);
    res.json(sortedTimeline);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST /api/albums/:id/story/timeline - Add timeline item (admin)
router.post('/:id/story/timeline', auth, checkAlbumOwnership, async (req, res) => {
  const { title, date, description, photoUrl } = req.body;
  
  try {
    if (!title || !date) {
      return res.status(400).json({ msg: 'Title and date are required' });
    }
    
    let loveStory = await LoveStory.findOne({ albumId: req.params.id });
    
    if (!loveStory) {
      // Create new love story if doesn't exist
      loveStory = new LoveStory({
        albumId: req.params.id,
        timeline: []
      });
    }
    
    // Calculate next order number
    const maxOrder = loveStory.timeline.length > 0 
      ? Math.max(...loveStory.timeline.map(item => item.order)) 
      : -1;
    
    const newItem = {
      title,
      date: new Date(date),
      description: description || '',
      photoUrl: photoUrl || '',
      order: maxOrder + 1
    };
    
    loveStory.timeline.push(newItem);
    await loveStory.save();
    
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// PUT /api/albums/:id/story/timeline/:tid - Update item (admin)
router.put('/:id/story/timeline/:tid', auth, checkAlbumOwnership, async (req, res) => {
  const { title, date, description, photoUrl, order } = req.body;
  
  try {
    const loveStory = await LoveStory.findOne({ albumId: req.params.id });
    if (!loveStory) {
      return res.status(404).json({ msg: 'Love story not found' });
    }
    
    const itemIndex = loveStory.timeline.findIndex(item => item._id.toString() === req.params.tid);
    if (itemIndex === -1) {
      return res.status(404).json({ msg: 'Timeline item not found' });
    }
    
    // Update fields
    if (title !== undefined) loveStory.timeline[itemIndex].title = title;
    if (date !== undefined) loveStory.timeline[itemIndex].date = new Date(date);
    if (description !== undefined) loveStory.timeline[itemIndex].description = description;
    if (photoUrl !== undefined) loveStory.timeline[itemIndex].photoUrl = photoUrl;
    if (order !== undefined) loveStory.timeline[itemIndex].order = order;
    
    await loveStory.save();
    res.json(loveStory.timeline[itemIndex]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// DELETE /api/albums/:id/story/timeline/:tid - Delete item (admin)
router.delete('/:id/story/timeline/:tid', auth, checkAlbumOwnership, async (req, res) => {
  try {
    const loveStory = await LoveStory.findOne({ albumId: req.params.id });
    if (!loveStory) {
      return res.status(404).json({ msg: 'Love story not found' });
    }
    
    const initialLength = loveStory.timeline.length;
    loveStory.timeline = loveStory.timeline.filter(item => item._id.toString() !== req.params.tid);
    
    if (loveStory.timeline.length === initialLength) {
      return res.status(404).json({ msg: 'Timeline item not found' });
    }
    
    await loveStory.save();
    res.json({ msg: 'Timeline item deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;