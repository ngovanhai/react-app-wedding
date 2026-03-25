const Album = require('../models/Album');
const GuestBook = require('../models/GuestBook');

// @desc    Get all guests for an album
// @route   GET /api/albums/:id/guests
// @access  Public
const getGuestsByAlbumId = async (req, res) => {
  try {
    // Verify album exists
    const album = await Album.findById(req.params.id);
    if (!album) {
      return res.status(404).json({
        success: false,
        message: 'Album not found'
      });
    }

    const guests = await GuestBook.find({ albumId: req.params.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: guests
    });
  } catch (error) {
    console.error('Error fetching guests:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching guests'
    });
  }
};

// @desc    Add guest message to album
// @route   POST /api/albums/:id/guests
// @access  Public
const addGuestMessage = async (req, res) => {
  try {
    const { guestName, message, photoUrl } = req.body;
    
    // Validation
    if (!guestName || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Guest name and message are required' 
      });
    }

    // Verify album exists
    const album = await Album.findById(req.params.id);
    if (!album) {
      return res.status(404).json({
        success: false,
        message: 'Album not found'
      });
    }

    const guestEntry = new GuestBook({
      albumId: req.params.id,
      guestName,
      message,
      photoUrl
    });

    await guestEntry.save();

    res.status(201).json({
      success: true,
      message: 'Guest message added successfully',
      data: guestEntry
    });
  } catch (error) {
    console.error('Error adding guest message:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding guest message'
    });
  }
};

// @desc    Delete guest message
// @route   DELETE /api/albums/:id/guests/:gid
// @access  Private (admin)
const deleteGuestMessage = async (req, res) => {
  try {
    const guest = await GuestBook.findByIdAndDelete(req.params.gid);
    
    if (!guest) {
      return res.status(404).json({
        success: false,
        message: 'Guest message not found'
      });
    }

    // Verify the guest message belongs to the specified album
    if (guest.albumId.toString() !== req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'Guest message does not belong to this album'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Guest message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting guest message:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting guest message'
    });
  }
};

module.exports = {
  getGuestsByAlbumId,
  addGuestMessage,
  deleteGuestMessage
};