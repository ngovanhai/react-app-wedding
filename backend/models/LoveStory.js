const mongoose = require('mongoose');

// Timeline Event Schema
const timelineEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    required: true
  },
  photoUrl: {
    type: String
  },
  albumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// LoveStory Schema
const loveStorySchema = new mongoose.Schema({
  albumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: true,
    unique: true
  },
  coupleName: {
    type: String
  },
  storyIntroduction: {
    type: String
  },
  timeline: [timelineEventSchema]
}, {
  timestamps: true
});

const LoveStory = mongoose.model('LoveStory', loveStorySchema);
const TimelineEvent = mongoose.model('TimelineEvent', timelineEventSchema);

module.exports = { LoveStory, TimelineEvent };