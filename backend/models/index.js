// Models for the wedding photo album app

// Album model
const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  brideName: {
    type: String,
    required: true
  },
  groomName: {
    type: String,
    required: true
  },
  weddingDate: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  template: {
    type: String,
    default: 'template1'
  },
  coverImage: {
    type: String // filename of the cover image
  },
  photos: [{
    filename: {
      type: String,
      required: true
    },
    originalname: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    size: {
      type: Number
    },
    mimetype: {
      type: String
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  shareCode: {
    type: String,
    required: true,
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Guest Book Entry model
const guestBookEntrySchema = new mongoose.Schema({
  albumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  email: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Export models
const Album = mongoose.model('Album', albumSchema);
const GuestBookEntry = mongoose.model('GuestBookEntry', guestBookEntrySchema);

module.exports = {
  Album,
  GuestBookEntry
};