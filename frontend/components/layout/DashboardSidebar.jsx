'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard',            icon: '🏠', label: 'Dashboard' },
  { href: '/dashboard/invitations', icon: '💌', label: 'Thiệp của tôi' },
  { href: '/dashboard/guests',     icon: '👥', label: 'Khách mời' },
  { href: '/dashboard/analytics',  icon: '📊', label: 'Thống kê' },
  { href: '/dashboard/settings',   icon: '⚙️', label: 'Cài đặt' },
]

export default function DashboardSidebar({ user }) {
  const pathname = usePathname()

  return (
    <aside className="w-56 bg-white border-r border-gray-100 flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-rose-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">W</div>
          <span className="font-bold text-gray-900 text-sm">WeddingCard</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(item => {
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Upgrade CTA */}
      {user?.plan === 'FREE' && (
        <div className="p-3 border-t border-gray-100">
          <Link
            href="/pricing-plans"
            className="block w-full bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold text-center py-2.5 rounded-xl transition-colors"
          >
            ⭐ Nâng cấp
          </Link>
        </div>
      )}

      {/* User info */}
      {user && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-2.5">
          <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-semibold text-xs">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-800 truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.plan}</p>
          </div>
        </div>
      )}
    </aside>
  )
}
