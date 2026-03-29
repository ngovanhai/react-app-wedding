// controllers/invitationController.js
const prisma = require('../lib/prisma')

/**
 * GET /api/invitations — list user's invitations
 */
const getInvitations = async (req, res) => {
  try {
    const invitations = await prisma.invitation.findMany({
      where: { userId: req.user.id },
      select: {
        id: true, title: true, slug: true, status: true,
        groomName: true, brideName: true, weddingDate: true,
        createdAt: true, updatedAt: true,
        template: { select: { id: true, name: true, thumbnail: true } },
      },
      orderBy: { updatedAt: 'desc' },
    })
    res.json({ data: invitations })
  } catch (error) {
    console.error('[Invitation] getInvitations:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * POST /api/invitations — create new invitation from template
 */
const createInvitation = async (req, res) => {
  try {
    const { templateId, title } = req.body

    // Validate template exists
    const template = await prisma.template.findUnique({
      where: { id: templateId },
      select: { id: true, configJson: true, name: true },
    })
    if (!template) return res.status(404).json({ error: 'Template not found' })

    // Check FREE plan limit (max 2)
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { plan: true },
    })

    if (user.plan === 'FREE') {
      const count = await prisma.invitation.count({ where: { userId: req.user.id } })
      if (count >= 2) {
        return res.status(403).json({
          error: 'Giới hạn FREE plan: tối đa 2 thiệp. Nâng cấp để tạo thêm.',
          code: 'PLAN_LIMIT',
        })
      }
    }


    // Generate unique slug
    const baseSlug = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

    const invitation = await prisma.invitation.create({
      data: {
        userId: req.user.id,
        templateId,
        title: title || `Thiệp từ ${template.name}`,
        slug: baseSlug,
        configJson: template.configJson ?? {},
      },
      select: {
        id: true, title: true, slug: true, status: true,
        configJson: true, weddingDate: true,
        groomName: true, brideName: true, venue: true,
        template: { select: { id: true, name: true, thumbnail: true } },
      },
    })


    res.status(201).json({ data: invitation, message: 'Tạo thiệp thành công' })
  } catch (error) {
    console.error('[Invitation] createInvitation:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * GET /api/invitations/:id — get single invitation
 */
const getInvitation = async (req, res) => {
  try {
    const invitation = await prisma.invitation.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: {
        template: { select: { id: true, name: true, configJson: true } },
      },
    })
    if (!invitation) return res.status(404).json({ error: 'Invitation not found' })
    res.json({ data: invitation })
  } catch (error) {
    console.error('[Invitation] getInvitation:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * PUT /api/invitations/:id — update/save invitation
 */
const updateInvitation = async (req, res) => {
  try {
    const allowed = ['title', 'configJson', 'weddingDate', 'groomName',
      'brideName', 'venue', 'backgroundMusic', 'customCss']
    const data = {}
    allowed.forEach(k => { if (req.body[k] !== undefined) data[k] = req.body[k] })

    const invitation = await prisma.invitation.updateMany({
      where: { id: req.params.id, userId: req.user.id },
      data,
    })
    if (invitation.count === 0) return res.status(404).json({ error: 'Invitation not found' })
    res.json({ message: 'Đã lưu thiệp' })
  } catch (error) {
    console.error('[Invitation] updateInvitation:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * POST /api/invitations/:id/publish — publish invitation
 */
const publishInvitation = async (req, res) => {
  try {
    const invitation = await prisma.invitation.updateMany({
      where: { id: req.params.id, userId: req.user.id },
      data: { status: 'PUBLISHED' },
    })
    if (invitation.count === 0) return res.status(404).json({ error: 'Invitation not found' })
    res.json({ message: 'Đã xuất bản thiệp' })
  } catch (error) {
    console.error('[Invitation] publishInvitation:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * DELETE /api/invitations/:id
 */
const deleteInvitation = async (req, res) => {
  try {
    const result = await prisma.invitation.deleteMany({
      where: { id: req.params.id, userId: req.user.id },
    })
    if (result.count === 0) return res.status(404).json({ error: 'Invitation not found' })
    res.json({ message: 'Đã xóa thiệp' })
  } catch (error) {
    console.error('[Invitation] deleteInvitation:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = {
  getInvitations, createInvitation, getInvitation,
  updateInvitation, publishInvitation, deleteInvitation,
}
