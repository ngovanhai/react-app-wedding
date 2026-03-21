export const metadata = {
  title: 'Wedding Album',
  description: 'Create your beautiful wedding album online',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}