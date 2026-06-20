import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import CartDrawer from '@/components/cart/CartDrawer'
import { getCategories } from '@/lib/strapi/fetch'
import { GoogleAnalytics } from '@next/third-parties/google'

export default async function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  const categories = await getCategories()

  return (
    <>
      <Header categories={categories} />
      <main className="pb-24 md:pb-0">{children}</main>
      <Footer />
      <MobileNav />
      <CartDrawer />
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </>
  )
}
