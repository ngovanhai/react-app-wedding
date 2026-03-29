'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'

// ─── Tab icon config ───────────────────────────────────
const TABS = [
  { id: 'text',    icon: '✏️', label: 'Văn bản' },
  { id: 'image',   icon: '🖼️', label: 'Hình ảnh' },
  { id: 'music',   icon: '🎵', label: 'Âm nhạc' },
  { id: 'effects', icon: '✨', label: 'Hiệu ứng' },
  { id: 'widgets', icon: '📅', label: 'Tiện ích' },
  { id: 'preset',  icon: '🎨', label: 'Preset' },
]

// ─── Sidebar panel contents ─────────────────────────────
function TextPanel({ data, onChange }) {
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-semibold text-gray-300">Thông tin đám cưới</h3>
      {[
        { key: 'groomName',  label: 'Tên chú rể',  placeholder: 'Nguyễn Văn An' },
        { key: 'brideName',  label: 'Tên cô dâu',  placeholder: 'Trần Thị Bình' },
        { key: 'venue',      label: 'Địa điểm',    placeholder: 'Nhà hàng Tiệc Cưới...' },
      ].map(f => (
        <div key={f.key}>
          <label className="block text-xs text-gray-400 mb-1">{f.label}</label>
          <input
            type="text"
            value={data[f.key] || ''}
            onChange={e => onChange(f.key, e.target.value)}
            placeholder={f.placeholder}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      ))}
      <div>
        <label className="block text-xs text-gray-400 mb-1">Ngày cưới</label>
        <input
          type="date"
          value={data.weddingDate?.slice(0, 10) || ''}
          onChange={e => onChange('weddingDate', e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-500"
        />
      </div>
    </div>
  )
}

function MusicPanel({ data, onChange }) {
  const SAMPLES = [
    { id: 'canon', name: 'Canon in D', artist: 'Pachelbel', duration: '03:47' },
    { id: 'perfect', name: 'Perfect', artist: 'Ed Sheeran', duration: '04:23' },
    { id: 'thousand', name: 'A Thousand Years', artist: 'Christina Perri', duration: '04:45' },
    { id: 'marry-you', name: 'Marry You', artist: 'Bruno Mars', duration: '03:50' },
    { id: 'all-of-me', name: 'All of Me', artist: 'John Legend', duration: '04:29' },
  ]
  return (
    <div className="p-4 space-y-3">
      <h3 className="text-sm font-semibold text-gray-300">Nhạc nền</h3>
      <p className="text-xs text-gray-500">Hiện tại: {data.backgroundMusic || 'Chưa chọn'}</p>
      <div className="space-y-2">
        {SAMPLES.map(s => (
          <div
            key={s.id}
            onClick={() => onChange('backgroundMusic', s.name)}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors',
              data.backgroundMusic === s.name
                ? 'bg-rose-500/20 border border-rose-500/50'
                : 'bg-gray-700 hover:bg-gray-600'
            )}
          >
            <button className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white text-xs shrink-0">▶</button>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{s.name}</p>
              <p className="text-xs text-gray-400">{s.artist}</p>
            </div>
            <span className="text-xs text-gray-400 shrink-0">{s.duration}</span>
            {data.backgroundMusic === s.name && (
              <span className="text-rose-400 text-xs shrink-0">✓ Đang dùng</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function GenericPanel({ label }) {
  return (
    <div className="p-4 text-center py-12">
      <div className="text-3xl mb-3">🚧</div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-xs text-gray-600 mt-1">Tính năng sẽ có trong phiên bản tiếp theo</p>
    </div>
  )
}

// ─── Phone Canvas Preview ───────────────────────────────
function PhoneCanvas({ data }) {
  const weddingDate = data.weddingDate
    ? new Date(data.weddingDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '15.06.2025'

  return (
    <div className="relative w-[280px] mx-auto">
      {/* Phone frame */}
      <div className="relative bg-gray-900 rounded-[3rem] border-4 border-gray-700 shadow-2xl overflow-hidden" style={{ height: '560px' }}>
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-3 pb-1">
          <span className="text-xs text-gray-300">9:41</span>
          <div className="w-16 h-5 bg-gray-900 rounded-full" />
          <span className="text-xs text-gray-300">●●●</span>
        </div>

        {/* Invitation card */}
        <div className="mx-2 rounded-2xl overflow-hidden h-full" style={{ background: 'linear-gradient(180deg, #1a0a0a 0%, #2d0a0a 50%, #1a0a0a 100%)' }}>
          <div className="flex flex-col items-center justify-center h-full p-6 text-center relative">
            {/* Floral decorations */}
            <div className="absolute top-4 left-0 right-0 flex justify-center">
              <span className="text-rose-300 text-3xl opacity-60">❋</span>
            </div>

            <p className="text-rose-300 text-xs tracking-widest uppercase mb-3 mt-8">
              Trân trọng kính mời
            </p>

            <h2 className="text-white font-bold text-xl leading-tight mb-1" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {data.groomName || 'Nguyễn Văn An'}
            </h2>
            <p className="text-rose-300 text-sm mb-1">&</p>
            <h2 className="text-white font-bold text-xl leading-tight mb-4" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {data.brideName || 'Trần Thị Bình'}
            </h2>

            <div className="w-16 h-px bg-rose-400/50 mb-4" />

            <p className="text-rose-200 text-sm font-medium tracking-wider">
              {weddingDate}
            </p>

            {data.venue && (
              <p className="text-gray-400 text-xs mt-2 px-4 leading-relaxed">
                📍 {data.venue}
              </p>
            )}

            {/* Bottom decor */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
              <span className="text-rose-300 text-2xl opacity-40">❋</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Editor ────────────────────────────────────────
export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const templateId = params.id

  const [activeTab, setActiveTab] = useState('text')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [invitation, setInvitation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    groomName: '', brideName: '', venue: '',
    weddingDate: '', backgroundMusic: '',
  })

  // Create or load invitation
  useEffect(() => {
    async function init() {
      try {
        // Try create new invitation from this template
        const result = await api.createInvitation({ templateId })
        setInvitation(result.data)
        if (result.data.contentJson) {
          setFormData(prev => ({ ...prev, ...result.data.contentJson }))
        }
      } catch (err) {
        if (err.message?.includes('PLAN_LIMIT')) {
          router.push('/pricing-plans')
        } else if (err.message?.includes('401')) {
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [templateId, router])

  const handleChange = useCallback((key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }, [])

  const handleSave = async () => {
    if (!invitation) return
    setSaving(true)
    try {
      await api.saveInvitation(invitation.id, {
        ...formData,
        contentJson: formData,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      // silent
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!invitation) return
    await handleSave()
    await api.publishInvitation(invitation.id)
    router.push('/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-rose-500 border-t-transparent mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Đang tạo thiệp...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Top bar */}
      <header className="bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <span className="text-white text-sm font-medium truncate max-w-[180px]">
            {invitation?.title || 'Thiệp mới'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 hidden sm:block">
            {saved ? '✓ Đã lưu' : 'Chưa lưu'}
          </span>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-ghost text-sm text-gray-300 hover:text-white px-3 py-1.5"
          >
            {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
          <button
            onClick={handlePublish}
            className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
          >
            🚀 Xuất bản
          </button>
        </div>
      </header>

      {/* Main 3-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left — icon sidebar */}
        <aside className="w-16 bg-gray-900 border-r border-gray-700 flex flex-col items-center py-3 gap-1 shrink-0">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
              className={cn(
                'w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all text-xs',
                activeTab === tab.id
                  ? 'bg-rose-500 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <span className="text-lg leading-none">{tab.icon}</span>
              <span className="text-[9px] leading-tight">{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* Left — expanded panel */}
        <aside className="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto shrink-0">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <h2 className="text-sm font-medium text-white">
              {TABS.find(t => t.id === activeTab)?.label}
            </h2>
          </div>
          {activeTab === 'text'    && <TextPanel data={formData} onChange={handleChange} />}
          {activeTab === 'music'   && <MusicPanel data={formData} onChange={handleChange} />}
          {activeTab === 'image'   && <GenericPanel label="Hình ảnh & Ảnh nền" />}
          {activeTab === 'effects' && <GenericPanel label="Hiệu ứng chuyển động" />}
          {activeTab === 'widgets' && <GenericPanel label="Tiện ích (Countdown, RSVP, Map...)" />}
          {activeTab === 'preset'  && <GenericPanel label="Bộ màu & Phông chữ" />}
        </aside>

        {/* Center — canvas */}
        <main className="flex-1 overflow-auto flex items-center justify-center bg-gray-950 p-8">
          <div className="flex flex-col items-center gap-4">
            <PhoneCanvas data={formData} />
            <p className="text-xs text-gray-600">← Xem trước trên điện thoại →</p>
          </div>
        </main>

        {/* Right — quick settings */}
        <aside className="w-56 bg-gray-800 border-l border-gray-700 p-4 shrink-0 overflow-y-auto">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Tuỳ chỉnh</h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Nhạc nền</p>
              <p className="text-xs text-white">{formData.backgroundMusic || 'Chưa chọn'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Ngày cưới</p>
              <p className="text-xs text-white">
                {formData.weddingDate
                  ? new Date(formData.weddingDate).toLocaleDateString('vi-VN')
                  : 'Chưa chọn'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Trạng thái</p>
              <span className={cn(
                'inline-block px-2 py-0.5 rounded text-xs font-medium',
                invitation?.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-400' : 'bg-gray-600 text-gray-300'
              )}>
                {invitation?.status === 'PUBLISHED' ? 'Đã xuất bản' : 'Bản nháp'}
              </span>
            </div>
            <div className="pt-2">
              <Link
                href={invitation?.slug ? `/${invitation.slug}` : '#'}
                target="_blank"
                className="w-full block text-center text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 rounded-lg transition-colors"
              >
                👁️ Xem thiệp
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
