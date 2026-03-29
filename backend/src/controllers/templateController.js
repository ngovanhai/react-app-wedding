// controllers/templateController.js
const prisma = require('../lib/prisma')

/**
 * GET /api/templates
 * Query: ?category=hien-dai&tier=FREE&page=1&limit=12
 */
const getTemplates = async (req, res) => {
  try {
    const { category, tier, page = 1, limit = 12 } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const where = { isActive: true }
    if (category) where.category = category
    if (tier) where.tier = tier

    const [templates, total] = await Promise.all([
      prisma.template.findMany({
        where,
        select: {
          id: true, name: true, slug: true, tier: true,
          category: true, thumbnail: true, sortOrder: true,
        },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: Number(limit),
      }),
      prisma.template.count({ where }),
    ])

    res.json({
      data: templates,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    })
  } catch (error) {
    console.error('[Template] getTemplates error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * GET /api/templates/:id
 */
const getTemplate = async (req, res) => {
  try {
    const template = await prisma.template.findUnique({
      where: { id: req.params.id },
    })
    if (!template) return res.status(404).json({ error: 'Template not found' })
    res.json({ data: template })
  } catch (error) {
    console.error('[Template] getTemplate error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { getTemplates, getTemplate }
