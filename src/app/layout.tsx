import type { Metadata } from 'next'
// import { Inter, Noto_Serif } from 'next/font/google'
import './globals.css'

const inter = { variable: 'font-sans' }
const notoSerif = { variable: 'font-serif' }

export const metadata: Metadata = {
  title: {
    template: '%s | Crete Accessories',
    default: 'Crete Accessories',
  },
  description:
    'Luxury handcrafted jewelry, books, and caps with African editorial energy.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSerif.variable}`}>
      <body className="min-h-screen bg-surface-dim text-on-surface antialiased">
        {children}
      </body>
    </html>
  )
}
