'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import DashboardSidebar from '@/components/layout/DashboardSidebar'

// ─── Stat Card ───────────────────────────────────────
function StatCard({ icon, label, value, color }) {
  return (
    <div className={cn('rounded-2xl p-4 flex items-center gap-4', color)}>
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  )
}

// ─── Invitation Card ─────────────────────────────────
function InvitationCard({ inv, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const statusBadge = {
    PUBLISHED: { label: 'Đã xuất bản', cls: 'bg-green-100 text-green-700' },
    DRAFT:     { label: 'Nháp',        cls: 'bg-gray-100 text-gray-600' },
    ARCHIVED:  { label: 'Lưu trữ',    cls: 'bg-amber-100 text-amber-700' },
  }[inv.status] ?? { label: inv.status, cls: 'bg-gray-100 text-gray-500' }

  const dateStr = inv.weddingDate
    ? new Date(inv.weddingDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : inv.createdAt
      ? `Tạo ngày ${new Date(inv.createdAt).toLocaleDateString('vi-VN')}`
      : ''

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
      {/* Thumbnail */}
      <div className="relative h-44 bg-gradient-to-br from-rose-50 to-rose-100">
        {inv.template?.thumbnail ? (
          <img src={inv.template.thumbnail} alt={inv.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <span className="text-4xl mb-1">💌</span>
            <p className="text-xs text-rose-400">Thiệp cưới</p>
          </div>
        )}
        <span className={cn('absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-medium', statusBadge.cls)}>
          {statusBadge.label}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm truncate">{inv.title}</h3>
        {(inv.groomName || inv.brideName) && (
          <p className="text-xs text-rose-500 mt-0.5 truncate">
            {[inv.groomName, inv.brideName].filter(Boolean).join(' & ')}
          </p>
        )}
        <p className="text-xs text-gray-400 mt-1">{dateStr}</p>

        {/* Stats row */}
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
          <span>👁️ {inv.viewCount ?? 0}</span>
          <span>💬 {inv._count?.messages ?? 0}</span>
          <span>✅ {inv._count?.guests ?? 0}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center border-t border-gray-100 divide-x divide-gray-100">
        <Link
          href={`/editor-template/${inv.templateId || inv.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
        >
          ✏️ Chỉnh sửa
        </Link>
        <button
          onClick={() => {navigator.clipboard?.writeText(`${window.location.origin}/${inv.slug}`)}}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
        >
          📤 Chia sẻ
        </button>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(p => !p)}
            className="px-3 py-2.5 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            ···
          </button>
          {menuOpen && (
            <div className="absolute right-0 bottom-full mb-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1 w-36" onClick={() => setMenuOpen(false)}>
              <Link href={`/${inv.slug}`} target="_blank" className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">
                👁️ Xem thiệp
              </Link>
              <button
                onClick={() => onDelete(inv.id)}
                className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50"
              >
                🗑️ Xóa
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Create New Card ─────────────────────────────────
function CreateNewCard() {
  return (
    <Link
      href="/templates"
      className="bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-rose-300 hover:bg-rose-50 transition-all flex flex-col items-center justify-center min-h-[240px] group"
    >
      <div className="w-12 h-12 rounded-full bg-rose-100 group-hover:bg-rose-200 flex items-center justify-center text-rose-500 text-xl mb-3 transition-colors">
        +
      </div>
      <p className="text-sm font-medium text-gray-600 group-hover:text-rose-600 transition-colors">Tạo thiệp mới</p>
    </Link>
  )
}

// ─── Main Dashboard ──────────────────────────────────
export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser]         = useState(null)
  const [invitations, setInvitations] = useState([])
  const [loading, setLoading]   = useState(true)

  const loadData = useCallback(async () => {
    try {
      const [meRes, invsRes] = await Promise.all([
        api.getMe(),
        api.getInvitations(),
      ])
      setUser(meRes.data)
      setInvitations(invsRes.data || [])
    } catch (err) {
      if (err.message?.includes('401') || err.message?.includes('403')) {
        router.push('/login')
      }
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { loadData() }, [loadData])

  const handleDelete = async (id) => {
    if (!confirm('Xóa thiệp này?')) return
    await api.deleteInvitation(id).catch(() => {})
    setInvitations(prev => prev.filter(i => i.id !== id))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-rose-500 border-t-transparent" />
      </div>
    )
  }

  // Aggregate stats
  const totalViews    = invitations.reduce((s, i) => s + (i.viewCount || 0), 0)
  const totalGuests   = invitations.reduce((s, i) => s + (i._count?.guests || 0), 0)
  const totalMessages = invitations.reduce((s, i) => s + (i._count?.messages || 0), 0)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar user={user} />

      <main className="flex-1 overflow-y-auto">
        {/* Upgrade banner */}
        {user?.plan === 'FREE' && (
          <div className="bg-gradient-to-r from-rose-50 to-amber-50 border-b border-rose-100 px-6 py-3 flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Gói hiện tại: <strong>Free</strong> |{' '}
              <Link href="/pricing-plans" className="text-rose-500 font-semibold hover:underline">
                Nâng cấp
              </Link>{' '}
              để unlock tính năng cao cấp
            </p>
            <Link href="/pricing-plans" className="text-xs bg-rose-500 text-white px-3 py-1.5 rounded-lg hover:bg-rose-600 transition-colors">
              Xem gói
            </Link>
          </div>
        )}

        <div className="p-6">
          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon="💌" label="Thiệp đã tạo"     value={invitations.length} color="bg-rose-50" />
            <StatCard icon="👁️" label="Tổng lượt xem"   value={totalViews.toLocaleString()} color="bg-blue-50" />
            <StatCard icon="✅" label="Đã xác nhận"      value={totalGuests} color="bg-green-50" />
            <StatCard icon="❤️" label="Lời chúc"         value={totalMessages} color="bg-amber-50" />
          </div>

          {/* Invitations grid */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Thiệp của tôi</h2>
            <Link href="/templates" className="text-sm text-rose-500 hover:text-rose-600 font-medium">
              + Tạo mới
            </Link>
          </div>

          {invitations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-5xl mb-4">💌</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Chưa có thiệp nào</h3>
              <p className="text-sm text-gray-500 mb-6">Tạo thiệp cưới đầu tiên của bạn ngay!</p>
              <Link href="/templates" className="bg-rose-500 text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-rose-600 transition-colors">
                Chọn mẫu thiệp
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {invitations.map(inv => (
                <InvitationCard key={inv.id} inv={inv} onDelete={handleDelete} />
              ))}
              <CreateNewCard />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
