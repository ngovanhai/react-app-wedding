const Template = require('../models/Template');

// Create a new template
const createTemplate = async (req, res) => {
  try {
    const { name, thumbnailUrl, layoutConfig } = req.body;
    
    const template = new Template({
      templateId: `tmpl_${Date.now()}`,
      name,
      thumbnailUrl,
      layoutConfig
    });

    await template.save();
    res.status(201).json({
      success: true,
      data: template
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all templates
const getTemplates = async (req, res) => {
  try {
    const { isActive } = req.query;
    const filter = {};
    
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const templates = await Template.find(filter).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: templates,
      count: templates.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get template by ID
const getTemplateById = async (req, res) => {
  try {
    const { templateId } = req.params;
    const template = await Template.findOne({ templateId });

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Update template
const updateTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { name, thumbnailUrl, layoutConfig, isActive } = req.body;

    const template = await Template.findOne({ templateId });

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    const updateData = {
      ...(name && { name }),
      ...(thumbnailUrl && { thumbnailUrl }),
      ...(layoutConfig && { layoutConfig }),
      ...(isActive !== undefined && { isActive })
    };

    Object.assign(template, updateData);
    template.updatedAt = new Date();

    await template.save();
    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete template
const deleteTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const template = await Template.findOne({ templateId });

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    await Template.deleteOne({ templateId });
    res.json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate
};