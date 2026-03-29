// controllers/guestController.js
const prisma = require('../lib/prisma')

/**
 * GET /api/invitations/:id/guests — list guests with RSVP filter
 */
const getGuests = async (req, res) => {
  try {
    const { rsvpStatus, page = 1, limit = 50 } = req.query

    // Verify user owns the invitation
    const inv = await prisma.invitation.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      select: { id: true },
    })
    if (!inv) return res.status(404).json({ error: 'Invitation not found' })

    const where = { invitationId: req.params.id }
    if (rsvpStatus) where.rsvpStatus = rsvpStatus

    const [guests, total] = await Promise.all([
      prisma.guest.findMany({
        where,
        select: {
          id: true, name: true, phone: true, email: true,
          rsvpStatus: true, partySize: true, side: true,
          note: true, rsvpAt: true, createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.guest.count({ where }),
    ])

    res.json({ data: guests, total, page: Number(page), limit: Number(limit) })
  } catch (error) {
    console.error('[Guest] getGuests:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * POST /api/invitations/:id/guests — manual guest add
 */
const addGuest = async (req, res) => {
  try {
    const { name, phone, email, side = 'BOTH', rsvpStatus = 'PENDING', partySize = 1, note } = req.body

    const inv = await prisma.invitation.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      select: { id: true },
    })
    if (!inv) return res.status(404).json({ error: 'Invitation not found' })

    const guest = await prisma.guest.create({
      data: { invitationId: req.params.id, name, phone, email, side, rsvpStatus, partySize, note },
      select: { id: true, name: true, phone: true, rsvpStatus: true, partySize: true, side: true },
    })
    res.status(201).json({ data: guest, message: 'Đã thêm khách mời' })
  } catch (error) {
    console.error('[Guest] addGuest:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * PUT /api/invitations/:id/guests/:guestId — update guest
 */
const updateGuest = async (req, res) => {
  try {
    const allowed = ['name', 'phone', 'email', 'rsvpStatus', 'partySize', 'side', 'note']
    const data = {}
    allowed.forEach(k => { if (req.body[k] !== undefined) data[k] = req.body[k] })

    // Verify ownership via invitation
    const inv = await prisma.invitation.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      select: { id: true },
    })
    if (!inv) return res.status(403).json({ error: 'Access denied' })

    const result = await prisma.guest.updateMany({
      where: { id: req.params.guestId, invitationId: req.params.id },
      data,
    })
    if (result.count === 0) return res.status(404).json({ error: 'Guest not found' })
    res.json({ message: 'Đã cập nhật khách mời' })
  } catch (error) {
    console.error('[Guest] updateGuest:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * DELETE /api/invitations/:id/guests/:guestId
 */
const deleteGuest = async (req, res) => {
  try {
    const inv = await prisma.invitation.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      select: { id: true },
    })
    if (!inv) return res.status(403).json({ error: 'Access denied' })

    const result = await prisma.guest.deleteMany({
      where: { id: req.params.guestId, invitationId: req.params.id },
    })
    if (result.count === 0) return res.status(404).json({ error: 'Guest not found' })
    res.json({ message: 'Đã xóa khách mời' })
  } catch (error) {
    console.error('[Guest] deleteGuest:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * GET /api/invitations/:id/guests/export — CSV export
 */
const exportGuests = async (req, res) => {
  try {
    const inv = await prisma.invitation.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      select: { id: true, title: true },
    })
    if (!inv) return res.status(404).json({ error: 'Invitation not found' })

    const guests = await prisma.guest.findMany({
      where: { invitationId: req.params.id },
      select: { name: true, phone: true, email: true, rsvpStatus: true, partySize: true, side: true, note: true, rsvpAt: true },
      orderBy: { rsvpStatus: 'asc' },
    })

    const CSV_HEADERS = 'Tên,Điện thoại,Email,Trạng thái,Số người,Bên,Ghi chú,RSVP lúc'
    const rows = guests.map(g =>
      [g.name, g.phone || '', g.email || '', g.rsvpStatus, g.partySize, g.side, g.note || '', g.rsvpAt?.toISOString() || '']
        .map(v => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    )
    const csv = [CSV_HEADERS, ...rows].join('\n')

    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="guests-${req.params.id}.csv"`)
    res.send('\uFEFF' + csv) // BOM for UTF-8 Excel compatibility
  } catch (error) {
    console.error('[Guest] exportGuests:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

/**
 * GET /api/invitations/:id/guests/stats — RSVP counts grouped
 */
const getGuestStats = async (req, res) => {
  try {
    const inv = await prisma.invitation.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      select: { id: true },
    })
    if (!inv) return res.status(404).json({ error: 'Invitation not found' })

    const [total, attending, declined, pending, totalPartySize] = await Promise.all([
      prisma.guest.count({ where: { invitationId: req.params.id } }),
      prisma.guest.count({ where: { invitationId: req.params.id, rsvpStatus: 'ATTENDING' } }),
      prisma.guest.count({ where: { invitationId: req.params.id, rsvpStatus: 'DECLINED' } }),
      prisma.guest.count({ where: { invitationId: req.params.id, rsvpStatus: 'PENDING' } }),
      prisma.guest.aggregate({ where: { invitationId: req.params.id, rsvpStatus: 'ATTENDING' }, _sum: { partySize: true } }),
    ])

    res.json({
      data: {
        total, attending, declined, pending,
        totalAttendees: totalPartySize._sum.partySize || 0,
      }
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}

module.exports = { getGuests, addGuest, updateGuest, deleteGuest, exportGuests, getGuestStats }
