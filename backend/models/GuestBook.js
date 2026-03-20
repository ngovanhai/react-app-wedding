const mongoose = require('mongoose');

const guestBookSchema = new mongoose.Schema({
  weddingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: true
  },
  guestName: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  mediaUrls: [{
    type: String
  }],
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('GuestBook', guestBookSchema);