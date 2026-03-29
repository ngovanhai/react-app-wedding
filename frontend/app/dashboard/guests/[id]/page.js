'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import DashboardSidebar from '@/components/layout/DashboardSidebar'

const RSVP_FILTERS = [
  { value: '',           label: 'Tất cả trạng thái' },
  { value: 'ATTENDING',  label: '✅ Đồng ý' },
  { value: 'DECLINED',   label: '❌ Từ chối' },
  { value: 'PENDING',    label: '⏳ Chờ phản hồi' },
]

const RSVP_BADGE = {
  ATTENDING: { label: 'Đồng ý',        cls: 'bg-green-100 text-green-700' },
  DECLINED:  { label: 'Từ chối',       cls: 'bg-red-100 text-red-600' },
  PENDING:   { label: 'Chờ phản hồi', cls: 'bg-gray-100 text-gray-600' },
}

function StatCard({ value, label, color }) {
  return (
    <div className={cn('rounded-2xl p-4', color)}>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  )
}

function AddGuestModal({ invitationId, onClose, onAdded }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', rsvpStatus: 'ATTENDING', partySize: 1, side: 'BOTH' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.addGuest(invitationId, form)
      onAdded(res.data)
      onClose()
    } catch (err) {
      setError(err.message || 'Lỗi khi thêm khách')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-gray-900">Thêm khách mời</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400" placeholder="Tên khách mời *" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required minLength={2} />
          <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400" placeholder="Số điện thoại" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} />
          <input className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400" placeholder="Email" type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
          <div className="grid grid-cols-2 gap-3">
            <select className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-rose-400" value={form.rsvpStatus} onChange={e => setForm(f => ({...f, rsvpStatus: e.target.value}))}>
              <option value="ATTENDING">Đồng ý</option>
              <option value="DECLINED">Từ chối</option>
              <option value="PENDING">Chờ phản hồi</option>
            </select>
            <select className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-rose-400" value={form.side} onChange={e => setForm(f => ({...f, side: e.target.value}))}>
              <option value="BOTH">Hai bên</option>
              <option value="GROOM">Nhà trai</option>
              <option value="BRIDE">Nhà gái</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Số người tham dự</label>
            <input type="number" min={1} max={20} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-400" value={form.partySize} onChange={e => setForm(f => ({...f, partySize: Number(e.target.value)}))} />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Hủy</button>
            <button type="submit" disabled={loading} className="flex-1 bg-rose-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-rose-600 disabled:opacity-50">
              {loading ? 'Đang thêm...' : 'Thêm khách'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function GuestManagementPage() {
  const { id } = useParams()
  const router = useRouter()
  const [user, setUser]       = useState(null)
  const [guests, setGuests]   = useState([])
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('')
  const [search, setSearch]   = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [invTitle, setInvTitle] = useState('')

  const loadData = useCallback(async () => {
    try {
      const [meRes, gsRes, stRes, invRes] = await Promise.all([
        api.getMe(),
        api.getGuests(id, filter ? { rsvpStatus: filter } : {}),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/invitations/${id}/guests/stats`, { credentials: 'include' }).then(r => r.json()),
        api.getInvitation(id),
      ])
      setUser(meRes.data)
      setGuests(gsRes.data || [])
      setStats(stRes.data)
      setInvTitle(invRes.data?.title || 'Thiệp cưới')
    } catch (err) {
      if (err.message?.includes('401')) router.push('/login')
    } finally {
      setLoading(false)
    }
  }, [id, filter, router])

  useEffect(() => { loadData() }, [loadData])

  const handleDelete = async (guestId) => {
    if (!confirm('Xóa khách mời này?')) return
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/invitations/${id}/guests/${guestId}`, {
      method: 'DELETE', credentials: 'include',
    })
    setGuests(prev => prev.filter(g => g.id !== guestId))
  }

  const handleExport = () => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/invitations/${id}/guests/export`, '_blank')
  }

  const filteredGuests = guests.filter(g =>
    !search || g.name.toLowerCase().includes(search.toLowerCase()) || g.phone?.includes(search)
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-rose-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar user={user} />

      <main className="flex-1 overflow-y-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">←</Link>
          <h1 className="text-lg font-bold text-gray-900">
            Quản lý khách mời — {invTitle}
          </h1>
        </div>

        {/* Stats row */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            <StatCard value={stats.total}         label="Khách mời"       color="bg-white border border-gray-200" />
            <StatCard value={stats.attending}      label={`Đồng ý (${stats.total ? Math.round(stats.attending/stats.total*100) : 0}%)`} color="bg-green-50" />
            <StatCard value={stats.declined}       label={`Từ chối (${stats.total ? Math.round(stats.declined/stats.total*100) : 0}%)`} color="bg-red-50" />
            <StatCard value={stats.pending}        label={`Chờ (${stats.total ? Math.round(stats.pending/stats.total*100) : 0}%)`}     color="bg-gray-100" />
            <StatCard value={stats.totalAttendees} label="Dự kiến tham dự" color="bg-rose-50" />
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm khách mời..."
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm w-56 focus:outline-none focus:border-rose-400"
          />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-rose-400"
          >
            {RSVP_FILTERS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
          <div className="ml-auto flex gap-2">
            <button onClick={handleExport} className="border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors flex items-center gap-1.5">
              📥 Export CSV
            </button>
            <button onClick={() => setShowAdd(true)} className="bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-rose-600 transition-colors flex items-center gap-1.5">
              + Thêm khách
            </button>
          </div>
        </div>

        {/* Guest table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Tên khách</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Liên lạc</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Trạng thái RSVP</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Số người</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Thời gian</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">
                    {search ? 'Không tìm thấy khách mời phù hợp' : 'Chưa có khách mời nào'}
                  </td>
                </tr>
              ) : filteredGuests.map(g => {
                const badge = RSVP_BADGE[g.rsvpStatus] || { label: g.rsvpStatus, cls: 'bg-gray-100 text-gray-500' }
                return (
                  <tr key={g.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{g.name}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {g.phone && <p>{g.phone}</p>}
                      {g.email && <p className="text-xs">{g.email}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', badge.cls)}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{g.partySize || 1}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {g.rsvpAt ? new Date(g.rsvpAt).toLocaleDateString('vi-VN') : '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => handleDelete(g.id)} className="text-red-400 hover:text-red-600 transition-colors text-sm px-2 py-1 rounded hover:bg-red-50">
                        🗑️
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination hint */}
        {filteredGuests.length > 0 && (
          <p className="text-xs text-gray-400 mt-3 text-center">
            Hiển thị {filteredGuests.length} / {guests.length} khách mời
          </p>
        )}
      </main>

      {showAdd && (
        <AddGuestModal
          invitationId={id}
          onClose={() => setShowAdd(false)}
          onAdded={guest => setGuests(prev => [guest, ...prev])}
        />
      )}
    </div>
  )
}
