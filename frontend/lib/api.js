// lib/api.js — Centralized API client for all frontend requests
// ❌ NEVER use fetch() directly in components — always use api.xxx()

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || `HTTP ${res.status}`)
  }

  // Handle empty responses (204 No Content)
  const contentType = res.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return res.json()
  }
  return null
}

export const api = {
  // ─────────────────────────────────────────────
  // Auth
  // ─────────────────────────────────────────────
  register: (data) =>
    apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data) =>
    apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  logout: () =>
    apiFetch('/api/auth/logout', { method: 'POST' }),

  getMe: () =>
    apiFetch('/api/auth/me'),

  // ─────────────────────────────────────────────
  // Invitations
  // ─────────────────────────────────────────────
  getInvitations: () =>
    apiFetch('/api/invitations'),

  getInvitation: (id) =>
    apiFetch(`/api/invitations/${id}`),

  createInvitation: (data) =>
    apiFetch('/api/invitations', { method: 'POST', body: JSON.stringify(data) }),

  saveInvitation: (id, data) =>
    apiFetch(`/api/invitations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  publishInvitation: (id) =>
    apiFetch(`/api/invitations/${id}/publish`, { method: 'POST' }),

  deleteInvitation: (id) =>
    apiFetch(`/api/invitations/${id}`, { method: 'DELETE' }),

  // ─────────────────────────────────────────────
  // Templates
  // ─────────────────────────────────────────────
  getTemplates: (params = {}) =>
    apiFetch(`/api/templates?${new URLSearchParams(params)}`),

  getTemplate: (id) =>
    apiFetch(`/api/templates/${id}`),

  // ─────────────────────────────────────────────
  // Public (Guest View — no auth)
  // ─────────────────────────────────────────────
  getPublicInvitation: (slug) =>
    apiFetch(`/api/public/${slug}`),

  submitRSVP: (slug, data) =>
    apiFetch(`/api/public/${slug}/rsvp`, { method: 'POST', body: JSON.stringify(data) }),

  submitMessage: (slug, data) =>
    apiFetch(`/api/public/${slug}/messages`, { method: 'POST', body: JSON.stringify(data) }),

  // ─────────────────────────────────────────────
  // Guests (Dashboard)
  // ─────────────────────────────────────────────
  getGuests: (invitationId, params = {}) =>
    apiFetch(`/api/invitations/${invitationId}/guests?${new URLSearchParams(params)}`),

  addGuest: (invitationId, data) =>
    apiFetch(`/api/invitations/${invitationId}/guests`, { method: 'POST', body: JSON.stringify(data) }),

  updateGuest: (invitationId, guestId, data) =>
    apiFetch(`/api/invitations/${invitationId}/guests/${guestId}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteGuest: (invitationId, guestId) =>
    apiFetch(`/api/invitations/${invitationId}/guests/${guestId}`, { method: 'DELETE' }),

  // ─────────────────────────────────────────────
  // Analytics
  // ─────────────────────────────────────────────
  getAnalytics: (invitationId) =>
    apiFetch(`/api/invitations/${invitationId}/analytics`),

  // ─────────────────────────────────────────────
  // Media
  // ─────────────────────────────────────────────
  uploadMedia: (formData) =>
    apiFetch('/api/media/upload', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set multipart boundary
      body: formData,
    }),

  deleteMedia: (publicId) =>
    apiFetch(`/api/media/${publicId}`, { method: 'DELETE' }),

  // ─────────────────────────────────────────────
  // Health Check
  // ─────────────────────────────────────────────
  health: () =>
    apiFetch('/api/health'),
}
