import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MobileNav from '@/components/layout/MobileNav'
import CartDrawer from '@/components/cart/CartDrawer'
import { getCategories } from '@/lib/strapi/fetch'
import { GoogleAnalytics } from '@next/third-parties/google'

async function HeaderWrapper() {
  const categories = await getCategories()
  return <Header categories={categories} />
}

async function FooterWrapper() {
  const categories = await getCategories()
  return <Footer categories={categories} />
}

export default async function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <>
      <Suspense fallback={<Header categories={[]} />}>
        <HeaderWrapper />
      </Suspense>
      <main className="pb-24 md:pb-0">{children}</main>
      <Suspense fallback={<Footer categories={[]} />}>
        <FooterWrapper />
      </Suspense>
      <MobileNav />
      <CartDrawer />
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </>
  )
}
