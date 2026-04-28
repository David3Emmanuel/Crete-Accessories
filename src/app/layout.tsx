import type { Metadata } from 'next'
import { Inter, Noto_Serif } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import './globals.css'

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
})

const notoSerif = Noto_Serif({
  variable: '--font-serif',
  subsets: ['latin'],
  display: 'swap',
})

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
    <html lang='en' className={`${inter.variable} ${notoSerif.variable}`}>
      <body className='min-h-screen bg-surface-dim text-on-surface antialiased'>
        <Header />
        <main className='pb-24 md:pb-0'>{children}</main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  )
}
