const mongoose = require('mongoose');

const liveWallSchema = new mongoose.Schema({
  wallId: { type: String, required: true, unique: true },
  albumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true },
  messages: [{
    userId: String,
    content: { type: String, required: true },
    type: { type: String, enum: ['text', 'image', 'emoji'], default: 'text' },
    likes: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  settings: {
    autoApprove: { type: Boolean, default: false },
    profanityFilter: { type: Boolean, default: true },
    maxMessages: { type: Number, default: 100 }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('LiveWall', liveWallSchema);