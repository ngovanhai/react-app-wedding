// controllers/publicController.js
const prisma = require('../lib/prisma')

/**
 * GET /api/public/:slug — public invitation view (no auth)
 * Records a view analytics event
 */
const getPublicInvitation = async (req, res) => {
  try {
    const invitation = await prisma.invitation.findFirst({
      where: { slug: req.params.slug, status: 'PUBLISHED' },
      select: {
        id: true, title: true, slug: true,
        groomName: true, brideName: true, venue: true,
        weddingDate: true, configJson: true, backgroundMusic: true,
        template: { select: { id: true, name: true, configJson: true } },
      },
    })

    if (!invitation) {
      return res.status(404).json({ error: 'Thiệp không tồn tại hoặc chưa xuất bản' })
    }

    // Record view analytics (fire-and-forget)
    prisma.analyticsEvent.create({
      data: {
        invitationId: invitation.id,
        type: 'VIEW',
        metadata: {
          userAgent: req.headers['user-agent'],
          ip: req.ip,
        },
      },
    }).catch(() => {}) // don't let analytics failure break the response

    res.json({ data: invitation })
  } catch (error) {
    console.error('[Public] getPublicInvitation:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * POST /api/public/:slug/rsvp — guest RSVP
 */
const submitRSVP = async (req, res) => {
  try {
    const { name, status, phone, partySize = 1 } = req.body

    const invitation = await prisma.invitation.findFirst({
      where: { slug: req.params.slug, status: 'PUBLISHED' },
      select: { id: true },
    })
    if (!invitation) return res.status(404).json({ error: 'Thiệp không tồn tại' })

    const guest = await prisma.guest.create({
      data: {
        invitationId: invitation.id,
        name,
        phone: phone || null,
        rsvpStatus: status,
        partySize,
        rsvpAt: new Date(),
      },
      select: { id: true, name: true, rsvpStatus: true, partySize: true },
    })

    res.json({ data: guest, message: 'Đã xác nhận tham dự!' })
  } catch (error) {
    console.error('[Public] submitRSVP:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * POST /api/public/:slug/messages — guest message/wish
 */
const submitMessage = async (req, res) => {
  try {
    const { guestName, content } = req.body
    if (!content?.trim()) return res.status(400).json({ error: 'Nội dung không được để trống' })

    const invitation = await prisma.invitation.findFirst({
      where: { slug: req.params.slug, status: 'PUBLISHED' },
      select: { id: true },
    })
    if (!invitation) return res.status(404).json({ error: 'Thiệp không tồn tại' })

    const message = await prisma.message.create({
      data: { invitationId: invitation.id, guestName: guestName || 'Khách ẩn danh', content },
      select: { id: true, guestName: true, content: true, createdAt: true },
    })

    res.status(201).json({ data: message, message: 'Đã gửi lời chúc!' })
  } catch (error) {
    console.error('[Public] submitMessage:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * GET /api/public/:slug/messages — get all messages
 */
const getMessages = async (req, res) => {
  try {
    const invitation = await prisma.invitation.findFirst({
      where: { slug: req.params.slug, status: 'PUBLISHED' },
      select: { id: true },
    })
    if (!invitation) return res.status(404).json({ error: 'Not found' })

    const messages = await prisma.message.findMany({
      where: { invitationId: invitation.id },
      select: { id: true, guestName: true, content: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    res.json({ data: messages })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { getPublicInvitation, submitRSVP, submitMessage, getMessages }
