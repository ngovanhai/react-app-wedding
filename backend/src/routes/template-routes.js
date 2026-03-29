// routes/template-routes.js
const express = require('express')
const templateController = require('../controllers/templateController')

const router = express.Router()

// GET /api/templates
router.get('/', templateController.getTemplates)

// GET /api/templates/:id
router.get('/:id', templateController.getTemplate)

module.exports = router
