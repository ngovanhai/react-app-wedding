const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  thumbnail: String,
  layout: { type: String, enum: ['grid', 'masonry', 'carousel'], default: 'grid' },
  category: String,
  isPremium: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Template', templateSchema);