'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'

function RSVPForm({ slug }) {
  const [form, setForm] = useState({ name: '', phone: '', status: 'ATTENDING', adultsCount: 1 })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.submitRSVP(slug, form)
      setDone(true)
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra, thử lại nhé')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="text-center py-6">
        <div className="text-4xl mb-2">🎉</div>
        <p className="font-semibold text-gray-800">Đã xác nhận!</p>
        <p className="text-sm text-gray-500 mt-1">
          {form.status === 'ATTENDING'
            ? `Tuyệt vời! Hẹn gặp bạn tại đám cưới 💕`
            : 'Cảm ơn bạn đã phản hồi. Sẽ nhớ bạn!'}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setForm(f => ({ ...f, status: 'ATTENDING' }))}
          className={cn(
            'flex-1 py-2.5 rounded-xl text-sm font-medium transition-all',
            form.status === 'ATTENDING'
              ? 'bg-rose-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          ✅ Tham dự
        </button>
        <button
          type="button"
          onClick={() => setForm(f => ({ ...f, status: 'DECLINED' }))}
          className={cn(
            'flex-1 py-2.5 rounded-xl text-sm font-medium transition-all',
            form.status === 'DECLINED'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          ❌ Không thể
        </button>
      </div>

      <input
        type="text"
        value={form.name}
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        placeholder="Họ và tên của bạn *"
        required
        minLength={2}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400"
      />

      <input
        type="tel"
        value={form.phone}
        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
        placeholder="Số điện thoại (tùy chọn)"
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400"
      />

      {form.status === 'ATTENDING' && (
        <div>
          <p className="text-xs text-gray-500 mb-2">Số người tham dự:</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setForm(f => ({ ...f, adultsCount: n }))}
                className={cn(
                  'w-10 h-10 rounded-full text-sm font-medium transition-all',
                  form.adultsCount === n
                    ? 'bg-rose-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
      >
        {loading ? 'Đang gửi...' : 'Xác nhận tham dự'}
      </button>
    </form>
  )
}

function WishesSection({ slug }) {
  const [wishes, setWishes] = useState([])
  const [form, setForm] = useState({ guestName: '', content: '' })
  const [sending, setSending] = useState(false)

  useEffect(() => {
    api.getMessages ? // check if method exists
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/public/${slug}/messages`)
        .then(r => r.json())
        .then(d => setWishes(d.data || []))
        .catch(() => {})
      : null
  }, [slug])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!form.content.trim()) return
    setSending(true)
    try {
      await api.submitMessage(slug, form)
      setWishes(prev => [{ id: Date.now(), guestName: form.guestName || 'Ẩn danh', content: form.content, createdAt: new Date() }, ...prev])
      setForm({ guestName: '', content: '' })
    } catch { /* silent */ }
    finally { setSending(false) }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSend} className="space-y-2">
        <input
          type="text"
          value={form.guestName}
          onChange={e => setForm(f => ({ ...f, guestName: e.target.value }))}
          placeholder="Tên của bạn (tùy chọn)"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400"
        />
        <textarea
          value={form.content}
          onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
          placeholder="Gửi lời chúc đến đôi bạn trẻ 💕"
          rows={3}
          required
          maxLength={500}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rose-400 resize-none"
        />
        <button
          type="submit"
          disabled={sending || !form.content.trim()}
          className="w-full bg-rose-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-rose-600 transition-colors disabled:opacity-50"
        >
          {sending ? '...' : '💌 Gửi lời chúc'}
        </button>
      </form>

      <div className="space-y-3 max-h-60 overflow-y-auto">
        {wishes.map(w => (
          <div key={w.id} className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs font-semibold text-rose-600 mb-1">{w.guestName}</p>
            <p className="text-sm text-gray-700 leading-relaxed">{w.content}</p>
          </div>
        ))}
        {wishes.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">Chưa có lời chúc nào. Hãy là người đầu tiên! 💕</p>
        )}
      </div>
    </div>
  )
}

export default function GuestViewPage() {
  const { slug } = useParams()
  const [invitation, setInvitation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeTab, setActiveTab] = useState('rsvp')

  useEffect(() => {
    api.getPublicInvitation(slug)
      .then(r => setInvitation(r.data))
      .catch(err => {
        if (err.message?.includes('404')) setNotFound(true)
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-rose-400 border-t-transparent" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-5xl mb-4">💌</div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">Thiệp không tồn tại</h1>
        <p className="text-gray-500 text-sm">Thiệp này chưa được xuất bản hoặc đường link không đúng.</p>
      </div>
    )
  }

  const weddingDate = invitation?.weddingDate
    ? new Date(invitation.weddingDate).toLocaleDateString('vi-VN', {
        day: '2-digit', month: 'long', year: 'numeric',
      })
    : null

  const TABS = [
    { id: 'rsvp', icon: '💌', label: 'RSVP' },
    { id: 'wishes', icon: '🎁', label: 'Lời chúc' },
  ]

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {/* Phone wrapper */}
      <div className="w-full max-w-sm mx-auto">
        {/* Wedding Card — scrollable */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
          {/* Hero cover */}
          <div
            className="relative h-72 flex flex-col items-center justify-center text-center p-6"
            style={{ background: 'linear-gradient(180deg, #0f0a0a 0%, #2d1010 60%, #1a0808 100%)' }}
          >
            {/* Music icon */}
            <button className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white text-sm">
              🎵
            </button>

            <p className="text-rose-300 text-xs tracking-widest uppercase mb-3">Trân trọng kính mời</p>

            <h1 className="text-white text-2xl font-bold leading-tight mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {invitation?.groomName || 'Nguyễn Văn An'}
            </h1>
            <p className="text-rose-300 text-lg mb-1">&amp;</p>
            <h1 className="text-white text-2xl font-bold leading-tight mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {invitation?.brideName || 'Trần Thị Bình'}
            </h1>

            {weddingDate && (
              <p className="text-rose-200 text-sm font-medium tracking-wider">
                📅 {weddingDate}
              </p>
            )}

            {invitation?.venue && (
              <p className="text-gray-400 text-xs mt-2">
                📍 {invitation.venue}
              </p>
            )}
          </div>

          {/* Event schedule */}
          <div className="bg-white border-b border-gray-100 p-4 space-y-3">
            <h2 className="text-sm font-semibold text-gray-700 text-center">Lịch trình</h2>
            {[
              { time: '10:00', event: 'Lễ Gia Tiên', location: 'Tại gia' },
              { time: '11:30', event: 'Lễ Thành Hôn', location: invitation?.venue },
              { time: '18:00', event: 'Tiệc Cưới', location: invitation?.venue },
            ].map(s => (
              <div key={s.time} className="flex items-start gap-3">
                <span className="text-rose-500 font-mono text-sm font-bold w-12 shrink-0">{s.time}</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">{s.event}</p>
                  {s.location && <p className="text-xs text-gray-400">{s.location}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-4">
            <div className="flex border border-gray-200 rounded-xl overflow-hidden mb-4">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex-1 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-1.5',
                    activeTab === tab.id
                      ? 'bg-rose-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  )}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'rsvp'   && <RSVPForm slug={slug} />}
            {activeTab === 'wishes' && <WishesSection slug={slug} />}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-4 text-center text-xs text-gray-400 border-t border-gray-100">
            Thiệp cưới được tạo bởi <span className="text-rose-500 font-medium">WeddingCards</span>
          </div>
        </div>
      </div>
    </div>
  )
}
