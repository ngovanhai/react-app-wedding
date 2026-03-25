const mongoose = require('mongoose');

const weddingTemplateSchema = new mongoose.Schema({
  weddingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: true
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    required: true
  },
  customizationSettings: {
    type: Object, // Stores user-specific customizations
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WeddingTemplate', weddingTemplateSchema);