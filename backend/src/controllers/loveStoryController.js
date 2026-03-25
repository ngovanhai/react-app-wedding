const { loveStoryService, albumService } = require('../services');
const { verifyJWT } = require('../utils/auth');

// Love Story controllers
const loveStoryController = {
  // Get love story by album ID
  async getLoveStory(req, res) {
    try {
      const { albumId } = req.params;
      
      // Verify album exists
      const album = await albumService.getAlbumByShareCode(albumId);
      if (!album) {
        // Try to find by ID if shareCode fails
        const albumById = await albumService.updateAlbumInfo(albumId, {});
        if (!albumById) {
          return res.status(404).json({ error: 'Album not found' });
        }
      }
      
      const loveStory = await loveStoryService.getLoveStoryByAlbumId(albumId);
      
      res.status(200).json({ loveStory });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create new love story (admin only)
  async createLoveStory(req, res) {
    try {
      const { albumId, coupleName, storyIntroduction, timeline } = req.body;
      
      // Validate required fields
      if (!albumId) {
        return res.status(400).json({
          error: 'Missing required field: albumId'
        });
      }
      
      const loveStoryData = {
        albumId,
        coupleName: coupleName || '',
        storyIntroduction: storyIntroduction || '',
        timeline: timeline || []
      };
      
      const loveStory = await loveStoryService.createLoveStory(loveStoryData);
      
      res.status(201).json({
        message: 'Love story created successfully',
        loveStory
      });
    } catch (error) {
      if (error.message === 'Album not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Love story already exists for this album') {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // Update love story (admin only)
  async updateLoveStory(req, res) {
    try {
      const { albumId } = req.params;
      const updateData = req.body;
      
      // Validate that we're not trying to update albumId
      if (updateData.albumId) {
        return res.status(400).json({
          error: 'Cannot update albumId'
        });
      }
      
      const loveStory = await loveStoryService.updateLoveStory(albumId, updateData);
      
      res.status(200).json({
        message: 'Love story updated successfully',
        loveStory
      });
    } catch (error) {
      if (error.message === 'Love story not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // Add timeline event
  async addTimelineEvent(req, res) {
    try {
      const { albumId } = req.params;
      const eventData = req.body;
      
      // Validate required fields
      if (!eventData.title || !eventData.date) {
        return res.status(400).json({
          error: 'Missing required fields: title and date'
        });
      }
      
      const loveStory = await loveStoryService.addTimelineEvent(albumId, eventData);
      
      res.status(201).json({
        message: 'Timeline event added successfully',
        loveStory
      });
    } catch (error) {
      if (error.message === 'Love story not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // Update timeline event
  async updateTimelineEvent(req, res) {
    try {
      const { albumId, eventId } = req.params;
      const updateData = req.body;
      
      const loveStory = await loveStoryService.updateTimelineEvent(albumId, eventId, updateData);
      
      res.status(200).json({
        message: 'Timeline event updated successfully',
        loveStory
      });
    } catch (error) {
      if (error.message === 'Love story not found' || error.message === 'Timeline event not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // Delete timeline event
  async deleteTimelineEvent(req, res) {
    try {
      const { albumId, eventId } = req.params;
      
      await loveStoryService.deleteTimelineEvent(albumId, eventId);
      
      res.status(200).json({
        message: 'Timeline event deleted successfully'
      });
    } catch (error) {
      if (error.message === 'Love story not found' || error.message === 'Timeline event not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = {
  loveStoryController
};