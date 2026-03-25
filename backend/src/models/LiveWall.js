const mongoose = require('mongoose');

const liveWallSchema = new mongoose.Schema({
  weddingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: true
  },
  isEnabled: {
    type: Boolean,
    default: false
  },
  displaySettings: {
    showImages: {
      type: Boolean,
      default: true
    },
    showMessages: {
      type: Boolean,
      default: true
    },
    transitionEffect: {
      type: String,
      enum: ['fade', 'slide', 'zoom', 'none'],
      default: 'fade'
    },
    displayDuration: {
      type: Number,
      default: 5000 // milliseconds
    },
    theme: {
      type: String,
      default: 'light'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LiveWall', liveWallSchema);