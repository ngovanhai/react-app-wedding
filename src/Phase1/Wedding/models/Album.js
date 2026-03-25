const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  groomName: {
    type: String,
    required: true,
    trim: true
  },
  brideName: {
    type: String,
    required: true,
    trim: true
  },
  weddingDate: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    trim: true
  },
  shareCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  coverPhotoUrl: {
    type: String
  }
}, {
  timestamps: true
});

// Index for shareCode for faster lookups
albumSchema.index({ shareCode: 1 });

module.exports = mongoose.model('Album', albumSchema);