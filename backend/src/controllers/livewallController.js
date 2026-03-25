const LiveWall = require('../models/LiveWall');
const Album = require('../models/Album');

// Initialize Live Wall for an album
exports.initializeLiveWall = async (req, res) => {
  try {
    const { albumId } = req.params;
    
    // Verify album exists and belongs to user
    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }
    
    if (album.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    // Check if Live Wall already exists for this album
    let liveWall = await LiveWall.findOne({ albumId });
    
    if (liveWall) {
      return res.status(200).json({
        success: true,
        data: liveWall
      });
    }
    
    // Create new Live Wall
    liveWall = new LiveWall({ albumId });
    await liveWall.save();
    
    res.status(201).json({
      success: true,
      data: liveWall
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add message to Live Wall
exports.addMessage = async (req, res) => {
  try {
    const { albumId } = req.params;
    const { user, message } = req.body;
    
    // Verify album exists
    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }
    
    // Find the Live Wall for this album
    let liveWall = await LiveWall.findOne({ albumId });
    if (!liveWall) {
      // Create Live Wall if it doesn't exist
      liveWall = new LiveWall({ albumId });
      await liveWall.save();
    }
    
    if (!liveWall.settings.allowMessages) {
      return res.status(403).json({ message: 'Messages are currently disabled for this album' });
    }
    
    // Check if user has reached the message limit
    if (liveWall.settings.maxMessagesPerUser > 0) {
      const userMessages = liveWall.messages.filter(msg => msg.user === user);
      if (userMessages.length >= liveWall.settings.maxMessagesPerUser) {
        return res.status(403).json({ message: 'You have reached the maximum number of messages allowed' });
      }
    }
    
    const newMessage = {
      user: user || 'Anonymous',
      message,
      approved: !liveWall.settings.requireApproval // Auto-approve if approval not required
    };
    
    liveWall.messages.push(newMessage);
    await liveWall.save();
    
    res.status(201).json({
      success: true,
      data: newMessage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all messages for Live Wall
exports.getMessages = async (req, res) => {
  try {
    const { albumId } = req.params;
    
    const liveWall = await LiveWall.findOne({ albumId });
    if (!liveWall) {
      return res.status(404).json({ message: 'Live Wall not found for this album' });
    }
    
    // Return only approved messages
    const approvedMessages = liveWall.messages.filter(msg => msg.approved);
    
    res.status(200).json({
      success: true,
      data: {
        messages: approvedMessages,
        settings: liveWall.settings
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve a message
exports.approveMessage = async (req, res) => {
  try {
    const { albumId } = req.params;
    const { messageId } = req.body;
    
    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }
    
    if (album.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const liveWall = await LiveWall.findOne({ albumId });
    if (!liveWall) {
      return res.status(404).json({ message: 'Live Wall not found' });
    }
    
    const message = liveWall.messages.id(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    message.approved = true;
    await liveWall.save();
    
    res.status(200).json({
      success: true,
      message: 'Message approved successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle Live Wall activation
exports.toggleActivation = async (req, res) => {
  try {
    const { albumId } = req.params;
    
    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }
    
    if (album.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const liveWall = await LiveWall.findOne({ albumId });
    if (!liveWall) {
      return res.status(404).json({ message: 'Live Wall not found' });
    }
    
    liveWall.isActive = !liveWall.isActive;
    await liveWall.save();
    
    res.status(200).json({
      success: true,
      data: { isActive: liveWall.isActive }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};