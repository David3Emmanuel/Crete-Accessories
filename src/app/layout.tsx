import type { Metadata } from 'next'
import { Inter, Noto_Serif } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import CartDrawer from '@/components/cart/CartDrawer'
import { getCategories } from '@/lib/strapi/fetch'
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  const categories = await getCategories()

  return (
    <html lang='en' className={`${inter.variable} ${notoSerif.variable}`}>
      <body className='min-h-screen bg-surface-dim text-on-surface antialiased'>
        <Header categories={categories} />
        <main className='pb-24 md:pb-0'>{children}</main>
        <Footer />
        <MobileNav />
        <CartDrawer />
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  )
}
