const mongoose = require('mongoose');

const liveWallSchema = new mongoose.Schema({
  albumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: true
  },
  messages: [{
    user: {
      type: String,
      default: 'Anonymous'
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    approved: {
      type: Boolean,
      default: false
    },
    likes: {
      type: Number,
      default: 0
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    allowMessages: {
      type: Boolean,
      default: true
    },
    requireApproval: {
      type: Boolean,
      default: true
    },
    maxMessagesPerUser: {
      type: Number,
      default: 10
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LiveWall', liveWallSchema);