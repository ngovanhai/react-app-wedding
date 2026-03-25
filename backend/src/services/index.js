// Services for the wedding photo album app

const { Album, GuestBookEntry } = require('../models');
const path = require('path');
const fs = require('fs');
const { loveStoryService } = require('./loveStoryService');

// Album services
const albumService = {
  // Create new album
  async createAlbum(data) {
    try {
      // Generate unique share code
      const shareCode = Math.random().toString(36).substring(2, 10);
      
      const album = new Album({
        title: data.title,
        brideName: data.brideName,
        groomName: data.groomName,
        weddingDate: data.weddingDate,
        venue: data.venue,
        template: data.template || 'template1',
        coverImage: data.coverImage,
        photos: data.photos || [],
        shareCode
      });
      
      await album.save();
      return album;
    } catch (error) {
      throw error;
    }
  },

  // Get album by share code
  async getAlbumByShareCode(shareCode) {
    try {
      const album = await Album.findOne({ shareCode, isActive: true }).lean();
      return album;
    } catch (error) {
      throw error;
    }
  },

  // Add photos to album
  async addPhotosToAlbum(albumId, photos) {
    try {
      const album = await Album.findById(albumId);
      if (!album) {
        throw new Error('Album not found');
      }
      
      // Add new photos to existing photos array
      album.photos = album.photos.concat(photos);
      await album.save();
      
      return album;
    } catch (error) {
      throw error;
    }
  },

  // Update album info
  async updateAlbumInfo(albumId, updateData) {
    try {
      const album = await Album.findByIdAndUpdate(
        albumId,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!album) {
        throw new Error('Album not found');
      }
      
      return album;
    } catch (error) {
      throw error;
    }
  }
};

// Guest book services
const guestBookService = {
  // Add guest book entry
  async addEntry(albumId, entryData) {
    try {
      const entry = new GuestBookEntry({
        albumId,
        name: entryData.name,
        message: entryData.message,
        email: entryData.email
      });
      
      await entry.save();
      return entry;
    } catch (error) {
      throw error;
    }
  },

  // Get guest book entries for an album
  async getEntries(albumId) {
    try {
      const entries = await GuestBookEntry.find({ albumId })
        .sort({ createdAt: -1 }) // Sort by newest first
        .lean();
        
      return entries;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = {
  albumService,
  guestBookService,
  loveStoryService
};