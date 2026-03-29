'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải ít nhất 6 ký tự')
      return
    }

    setLoading(true)
    try {
      await api.register({ name: formData.name, email: formData.email, password: formData.password })
      router.push('/dashboard')
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại, thử lại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-rose-500 via-rose-600 to-rose-800 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/5 rounded-full" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-16">
            <span className="text-2xl">💒</span>
            <span className="text-white font-bold text-xl">WeddingCards</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Bắt đầu hành trình<br />yêu thương của bạn
          </h1>
          <p className="text-rose-100 text-lg">
            Tạo tài khoản miễn phí và bắt đầu<br />
            thiết kế thiệp cưới trong vài phút.
          </p>
        </div>

        <div className="relative space-y-3">
          {[
            { icon: '🎁', text: 'Gói miễn phí — 2 thiệp, 500 lượt xem' },
            { icon: '⚡', text: 'Tạo thiệp trong dưới 5 phút' },
            { icon: '📱', text: 'Chia sẻ dễ dàng qua link / QR code' },
          ].map((item) => (
            <div key={item.text} className="flex items-start gap-3 text-white/90">
              <span className="text-lg mt-0.5">{item.icon}</span>
              <span className="text-sm">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <span className="text-2xl">💒</span>
            <span className="font-bold text-xl text-gray-900">WeddingCards</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Tạo tài khoản</h2>
            <p className="text-gray-500 text-sm mb-8">
              Đã có tài khoản?{' '}
              <Link href="/login" className="text-rose-600 hover:text-rose-700 font-medium">
                Đăng nhập
              </Link>
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label" htmlFor="name">Họ và tên</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  placeholder="Nguyễn Văn An"
                  required
                  minLength={2}
                />
              </div>

              <div>
                <label className="label" htmlFor="reg-email">Email</label>
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="label" htmlFor="reg-password">Mật khẩu</label>
                <input
                  id="reg-password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input"
                  placeholder="Ít nhất 6 ký tự"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label className="label" htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input"
                  placeholder="Nhập lại mật khẩu"
                  required
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full btn-lg mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Đang tạo tài khoản...
                  </span>
                ) : 'Đăng ký miễn phí'}
              </button>

              <p className="text-xs text-gray-400 text-center">
                Bằng cách đăng ký, bạn đồng ý với{' '}
                <Link href="/terms" className="underline">Điều khoản dịch vụ</Link>
                {' '}và{' '}
                <Link href="/privacy" className="underline">Chính sách bảo mật</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
