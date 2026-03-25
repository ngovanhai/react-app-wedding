const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  qrId: { type: String, required: true, unique: true },
  albumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true },
  tableNumber: Number,
  code: { type: String, required: true },
  url: { type: String, required: true },
  scanCount: { type: Number, default: 0 },
  lastScannedAt: Date,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('QRCode', qrCodeSchema);