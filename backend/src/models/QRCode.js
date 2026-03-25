const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
  albumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  url: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('QRCode', qrCodeSchema);