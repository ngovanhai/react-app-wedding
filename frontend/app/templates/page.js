'use client'

import { useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { value: '', label: 'Tất cả' },
  { value: 'hien-dai', label: 'Hiện đại' },
  { value: 'co-dien', label: 'Cổ điển' },
  { value: 'toi-gian', label: 'Tối giản' },
]

const TIERS = [
  { value: '', label: 'Tất cả gói' },
  { value: 'FREE', label: 'Miễn phí' },
  { value: 'BASIC', label: 'Basic' },
  { value: 'PREMIUM', label: 'Premium' },
]

function TemplateSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="aspect-[9/16] bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  )
}

function TemplateCard({ template }) {
  const tierColors = {
    FREE:    'badge-gray',
    BASIC:   'badge-rose',
    PREMIUM: 'badge-amber',
  }

  return (
    <div className="card-hover group cursor-pointer overflow-hidden">
      {/* Thumbnail */}
      <div className="relative aspect-[9/16] bg-gradient-to-br from-rose-100 to-rose-200 overflow-hidden">
        {template.thumbnail ? (
          <img
            src={template.thumbnail}
            alt={template.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-rose-400">
            <span className="text-4xl mb-2">💌</span>
            <span className="text-xs font-medium">{template.name}</span>
          </div>
        )}

        {/* Tier badge — top left */}
        <div className="absolute top-2 left-2">
          <span className={cn('badge text-xs font-semibold uppercase tracking-wide', tierColors[template.tier])}>
            {template.tier}
          </span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-4">
          <Link
            href={`/editor-template/${template.id}`}
            className="btn-primary w-full text-center text-sm py-2"
          >
            Dùng mẫu này
          </Link>
          <button className="btn-secondary w-full text-sm py-2">
            Xem trước
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-800 truncate">{template.name}</h3>
        <p className="text-xs text-gray-400 capitalize mt-0.5">
          {template.category?.replace('-', ' ')}
        </p>
      </div>
    </div>
  )
}

export default function TemplatesPage() {
  const [category, setCategory] = useState('')
  const [tier, setTier] = useState('')

  const params = {}
  if (category) params.category = category
  if (tier) params.tier = tier

  const { data, isLoading, error } = useSWR(
    ['/api/templates', category, tier],
    () => api.getTemplates(params)
  )

  const templates = data?.data || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="page-container py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">💒</span>
            <span className="font-bold text-gray-900">WeddingCards</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <Link href="/templates" className="text-rose-600 font-medium">Mẫu thiệp</Link>
            <Link href="/pricing-plans" className="hover:text-gray-900">Bảng giá</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="btn-ghost btn-sm">Đăng nhập</Link>
            <Link href="/register" className="btn-primary btn-sm">Bắt đầu miễn phí</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="text-center py-12 px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Mẫu thiệp cưới <span className="gradient-text">online đẹp</span>
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Khám phá bộ sưu tập mẫu thiệp trực tuyến cao cấp và đa dạng cho mọi sự kiện.
        </p>
      </div>

      {/* Filter bar */}
      <div className="page-container pb-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* Category tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
                  category === cat.value
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-white border border-gray-300 text-gray-600 hover:border-rose-400 hover:text-rose-500'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Tier select — right side */}
          <div className="ml-auto">
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="input text-sm py-1.5 pr-8 w-auto"
              style={{ width: 'auto' }}
            >
              {TIERS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="page-container pb-16">
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-2">Không thể tải danh sách mẫu</p>
            <p className="text-sm text-gray-400">{error.message}</p>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => <TemplateSkeleton key={i} />)}
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Không tìm thấy mẫu nào</h3>
            <p className="text-gray-400 text-sm">Thử thay đổi bộ lọc để xem thêm mẫu</p>
            <button
              onClick={() => { setCategory(''); setTier('') }}
              className="btn-secondary mt-4"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-4">{templates.length} mẫu</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {templates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
