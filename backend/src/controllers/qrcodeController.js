const QRCode = require('../models/QRCode');
const Album = require('../models/Album');
const { generateQRCode } = require('../services/qrcodeService');

// Create QR code for an album
exports.createQRCode = async (req, res) => {
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
    
    // Generate unique QR code
    const uniqueCode = `${albumId}_${Date.now()}`;
    const albumUrl = `${process.env.FRONTEND_URL}/album/${albumId}`;
    
    // Create QR code entry
    const qrCode = new QRCode({
      albumId,
      code: uniqueCode,
      url: albumUrl
    });
    
    await qrCode.save();
    
    res.status(201).json({
      success: true,
      data: {
        code: uniqueCode,
        url: albumUrl,
        qrCodeId: qrCode._id
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get QR code details
exports.getQRCode = async (req, res) => {
  try {
    const { code } = req.params;
    
    const qrCode = await QRCode.findOne({ code, isActive: true })
      .populate('albumId', 'title description coverImage privacySettings');
    
    if (!qrCode) {
      return res.status(404).json({ message: 'QR code not found or expired' });
    }
    
    // Check if QR code has expired
    if (qrCode.expiresAt && new Date() > qrCode.expiresAt) {
      qrCode.isActive = false;
      await qrCode.save();
      return res.status(404).json({ message: 'QR code has expired' });
    }
    
    res.status(200).json({
      success: true,
      data: qrCode
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Deactivate QR code
exports.deactivateQRCode = async (req, res) => {
  try {
    const { code } = req.params;
    const userId = req.user.id;
    
    const qrCode = await QRCode.findOne({ code });
    
    if (!qrCode) {
      return res.status(404).json({ message: 'QR code not found' });
    }
    
    // Verify album ownership
    const album = await Album.findById(qrCode.albumId);
    if (album.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    qrCode.isActive = false;
    await qrCode.save();
    
    res.status(200).json({
      success: true,
      message: 'QR code deactivated successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};