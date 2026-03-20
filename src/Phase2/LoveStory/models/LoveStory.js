const mongoose = require('mongoose');

const timelineItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  photoUrl: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    required: true
  }
}, { _id: false });

const loveStorySchema = new mongoose.Schema({
  albumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: true
  },
  timeline: [timelineItemSchema]
}, {
  timestamps: true
});

// Index for albumId lookup
loveStorySchema.index({ albumId: 1 });

module.exports = mongoose.model('LoveStory', loveStorySchema);