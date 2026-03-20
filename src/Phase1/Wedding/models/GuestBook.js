const mongoose = require('mongoose');

const guestBookSchema = new mongoose.Schema({
  albumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: true
  },
  guestName: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  photoUrl: {
    type: String
  }
}, {
  timestamps: true
});

// Index for albumId for faster lookups
guestBookSchema.index({ albumId: 1 });

module.exports = mongoose.model('GuestBook', guestBookSchema);