const LiveWall = require('../models/LiveWall');
const { v4: uuidv4 } = require('uuid');

exports.initialize = async (req, res) => {
  try {
    const { albumId } = req.body;
    const wallId = uuidv4();
    
    let liveWall = await LiveWall.findOne({ albumId });
    if (liveWall) {
      return res.json({ success: true, data: liveWall, message: 'Already exists' });
    }
    
    liveWall = await LiveWall.create({ wallId, albumId });
    res.status(201).json({ success: true, data: liveWall });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.addMessage = async (req, res) => {
  try {
    const { albumId, userId, content, type } = req.body;
    const liveWall = await LiveWall.findOne({ albumId });
    if (!liveWall) return res.status(404).json({ success: false, error: 'LiveWall not found' });
    
    const message = {
      userId,
      content,
      type,
      isApproved: liveWall.settings.autoApprove
    };
    
    liveWall.messages.push(message);
    await liveWall.save();
    
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const liveWall = await LiveWall.findOne({ albumId: req.params.albumId });
    if (!liveWall) return res.status(404).json({ success: false, error: 'Not found' });
    
    const approvedMessages = liveWall.messages.filter(m => m.isApproved);
    res.json({ success: true, data: approvedMessages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.approveMessage = async (req, res) => {
  try {
    const liveWall = await LiveWall.findOne({ albumId: req.params.albumId });
    if (!liveWall) return res.status(404).json({ success: false, error: 'Not found' });
    
    const message = liveWall.messages.id(req.params.messageId);
    if (!message) return res.status(404).json({ success: false, error: 'Message not found' });
    
    message.isApproved = true;
    await liveWall.save();
    
    res.json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.toggleActivation = async (req, res) => {
  try {
    const liveWall = await LiveWall.findOneAndUpdate(
      { albumId: req.params.albumId },
      { isActive: !req.body.isActive },
      { new: true }
    );
    if (!liveWall) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: liveWall });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};