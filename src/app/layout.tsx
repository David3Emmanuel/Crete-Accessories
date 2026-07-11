import type { Metadata } from 'next'
// import { Inter, Noto_Serif } from 'next/font/google'
import './globals.css'

const inter = { variable: 'font-sans' }
const notoSerif = { variable: 'font-serif' }

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    template: '%s | Crete Accessories',
    default: 'Crete Accessories',
  },
  description:
    'Luxury handcrafted jewelry, books, and caps with African editorial energy.',
  openGraph: {
    title: 'Crete Accessories',
    description: 'Luxury handcrafted jewelry, books, and caps with African editorial energy.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Crete Accessories Logo',
      },
    ],
  },
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
