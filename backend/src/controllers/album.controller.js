const Album = require('../models/Album');
const GuestBook = require('../models/GuestBook');
const { generateShareCode } = require('../utils/helpers');

// @desc    Create new album
// @route   POST /api/albums
// @access  Private (admin)
const createAlbum = async (req, res) => {
  try {
    const { title, groomName, brideName, weddingDate, venue, coverPhotoUrl } = req.body;

    // Validation
    if (!title || !groomName || !brideName || !weddingDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, groom name, bride name, and wedding date are required' 
      });
    }

    // Generate unique share code
    let shareCode;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      shareCode = generateShareCode();
      const existingAlbum = await Album.findOne({ shareCode });
      if (!existingAlbum) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to generate unique share code. Please try again.' 
      });
    }

    const album = new Album({
      title,
      groomName,
      brideName,
      weddingDate,
      venue,
      coverPhotoUrl,
      shareCode
    });

    await album.save();

    res.status(201).json({
      success: true,
      message: 'Album created successfully',
      data: album
    });
  } catch (error) {
    console.error('Error creating album:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating album'
    });
  }
};

// @desc    Get album by ID
// @route   GET /api/albums/:id
// @access  Private (admin)
const getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    
    if (!album) {
      return res.status(404).json({
        success: false,
        message: 'Album not found'
      });
    }

    res.status(200).json({
      success: true,
      data: album
    });
  } catch (error) {
    console.error('Error fetching album:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching album'
    });
  }
};

// @desc    Get album by share code
// @route   GET /api/albums/share/:code
// @access  Public
const getAlbumByShareCode = async (req, res) => {
  try {
    const album = await Album.findOne({ shareCode: req.params.code });
    
    if (!album) {
      return res.status(404).json({
        success: false,
        message: 'Album not found'
      });
    }

    res.status(200).json({
      success: true,
      data: album
    });
  } catch (error) {
    console.error('Error fetching album by share code:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching album'
    });
  }
};

// @desc    Update album
// @route   PUT /api/albums/:id
// @access  Private (admin)
const updateAlbum = async (req, res) => {
  try {
    const { title, groomName, brideName, weddingDate, venue, coverPhotoUrl } = req.body;
    
    // Validation
    if (!title || !groomName || !brideName || !weddingDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, groom name, bride name, and wedding date are required' 
      });
    }

    const album = await Album.findByIdAndUpdate(
      req.params.id,
      { title, groomName, brideName, weddingDate, venue, coverPhotoUrl },
      { new: true, runValidators: true }
    );

    if (!album) {
      return res.status(404).json({
        success: false,
        message: 'Album not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Album updated successfully',
      data: album
    });
  } catch (error) {
    console.error('Error updating album:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating album'
    });
  }
};

// @desc    Delete album
// @route   DELETE /api/albums/:id
// @access  Private (admin)
const deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findByIdAndDelete(req.params.id);
    
    if (!album) {
      return res.status(404).json({
        success: false,
        message: 'Album not found'
      });
    }

    // Also delete associated guest book entries
    await GuestBook.deleteMany({ albumId: album._id });

    res.status(200).json({
      success: true,
      message: 'Album deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting album:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting album'
    });
  }
};

module.exports = {
  createAlbum,
  getAlbumById,
  getAlbumByShareCode,
  updateAlbum,
  deleteAlbum
};