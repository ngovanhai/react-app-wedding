const { LoveStory, Album } = require('../models');

// Love Story services
const loveStoryService = {
  // Create new love story
  async createLoveStory(data) {
    try {
      // Check if album exists
      const album = await Album.findById(data.albumId);
      if (!album) {
        throw new Error('Album not found');
      }
      
      // Check if love story already exists for this album
      const existingLoveStory = await LoveStory.findOne({ albumId: data.albumId });
      if (existingLoveStory) {
        throw new Error('Love story already exists for this album');
      }
      
      const loveStory = new LoveStory({
        albumId: data.albumId,
        coupleName: data.coupleName,
        storyIntroduction: data.storyIntroduction,
        timeline: data.timeline || []
      });
      
      await loveStory.save();
      return loveStory;
    } catch (error) {
      throw error;
    }
  },

  // Get love story by album ID
  async getLoveStoryByAlbumId(albumId) {
    try {
      const loveStory = await LoveStory.findOne({ albumId }).lean();
      return loveStory;
    } catch (error) {
      throw error;
    }
  },

  // Update love story
  async updateLoveStory(albumId, updateData) {
    try {
      const loveStory = await LoveStory.findOneAndUpdate(
        { albumId },
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!loveStory) {
        throw new Error('Love story not found');
      }
      
      return loveStory;
    } catch (error) {
      throw error;
    }
  },

  // Add timeline event
  async addTimelineEvent(albumId, eventData) {
    try {
      const loveStory = await LoveStory.findOne({ albumId });
      if (!loveStory) {
        throw new Error('Love story not found');
      }
      
      // Set default order if not provided
      const order = eventData.order !== undefined ? eventData.order : loveStory.timeline.length;
      
      const newEvent = {
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        photoUrl: eventData.photoUrl,
        albumId: albumId,
        order: order
      };
      
      loveStory.timeline.push(newEvent);
      await loveStory.save();
      
      // Return the updated love story with the new event
      return loveStory;
    } catch (error) {
      throw error;
    }
  },

  // Update timeline event
  async updateTimelineEvent(albumId, eventId, updateData) {
    try {
      const loveStory = await LoveStory.findOne({ albumId });
      if (!loveStory) {
        throw new Error('Love story not found');
      }
      
      const eventIndex = loveStory.timeline.findIndex(event => event._id.toString() === eventId);
      if (eventIndex === -1) {
        throw new Error('Timeline event not found');
      }
      
      // Update the event properties
      Object.keys(updateData).forEach(key => {
        if (key !== '_id') {
          loveStory.timeline[eventIndex][key] = updateData[key];
        }
      });
      
      await loveStory.save();
      return loveStory;
    } catch (error) {
      throw error;
    }
  },

  // Delete timeline event
  async deleteTimelineEvent(albumId, eventId) {
    try {
      const loveStory = await LoveStory.findOne({ albumId });
      if (!loveStory) {
        throw new Error('Love story not found');
      }
      
      const initialLength = loveStory.timeline.length;
      loveStory.timeline = loveStory.timeline.filter(event => event._id.toString() !== eventId);
      
      if (loveStory.timeline.length === initialLength) {
        throw new Error('Timeline event not found');
      }
      
      await loveStory.save();
      return loveStory;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = {
  loveStoryService
};