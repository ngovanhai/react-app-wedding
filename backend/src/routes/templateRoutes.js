const express = require('express');
const router = express.Router();
const {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate
} = require('../controllers/templateController');

// POST /api/templates - Create a new template
router.post('/', createTemplate);

// GET /api/templates - Get all templates
router.get('/', getTemplates);

// GET /api/templates/:templateId - Get template by ID
router.get('/:templateId', getTemplateById);

// PUT /api/templates/:templateId - Update template
router.put('/:templateId', updateTemplate);

// DELETE /api/templates/:templateId - Delete template
router.delete('/:templateId', deleteTemplate);

module.exports = router;