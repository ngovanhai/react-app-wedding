import './globals.css'

export const metadata = {
  title: {
    default: 'WeddingCards — Thiệp cưới online đẹp nhất',
    template: '%s | WeddingCards',
  },
  description: 'Tạo thiệp cưới online đẹp & độc đáo. Hơn 200 mẫu thiệp, dễ dàng tùy chỉnh, chia sẻ ngay.',
  keywords: ['thiệp cưới', 'wedding card', 'thiệp cưới online', 'tạo thiệp cưới'],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'WeddingCards',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Cormorant+Garamond:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
