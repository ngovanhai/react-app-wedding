const QRCode = require('../models/QRCode');
const { v4: uuidv4 } = require('uuid');

exports.generate = async (req, res) => {
  try {
    const { albumId, tableNumber } = req.body;
    const qrId = uuidv4();
    const code = Buffer.from(qrId).toString('base64');
    const url = `${process.env.FRONTEND_URL}/album/${albumId}?qr=${qrId}`;
    
    const qrCode = await QRCode.create({ qrId, albumId, tableNumber, code, url });
    res.status(201).json({ success: true, data: qrCode });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getByAlbum = async (req, res) => {
  try {
    const qrCodes = await QRCode.find({ albumId: req.params.albumId });
    res.json({ success: true, data: qrCodes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.scan = async (req, res) => {
  try {
    const qrCode = await QRCode.findOneAndUpdate(
      { qrId: req.params.qrId },
      { $inc: { scanCount: 1 }, lastScannedAt: new Date() },
      { new: true }
    );
    if (!qrCode) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: qrCode });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deactivate = async (req, res) => {
  try {
    const qrCode = await QRCode.findByIdAndUpdate(
      req.params.qrId,
      { isActive: false },
      { new: true }
    );
    if (!qrCode) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: qrCode });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};