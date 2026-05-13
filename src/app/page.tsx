import type { Metadata } from 'next'
import { getCategories, getNewArrivals } from '@/lib/strapi/fetch'

export const metadata: Metadata = {
  title: 'Crete Accessories | Luxury Handcrafted Jewelry, Books & Caps',
  description:
    'Shop handcrafted luxury jewelry, editorial books, and statement caps. African aesthetics, global edge.',
  openGraph: {
    title: 'Crete Accessories',
    description:
      'Luxury handcrafted jewelry, books, and caps with African editorial energy.',
    type: 'website',
  },
}
import Hero from '@/components/home/Hero'
import CategoryStrip from '@/components/home/CategoryStrip'
import Marquee from '@/components/home/Marquee'
import NewArrivals from '@/components/home/NewArrivals'
import TrustBadges from '@/components/home/TrustBadges'
import SocialGrid from '@/components/home/SocialGrid'

export default async function HomePage() {
  const [categories, newArrivals] = await Promise.all([
    getCategories(),
    getNewArrivals(3),
  ])

  return (
    <>
      <Hero />
      <CategoryStrip categories={categories} />
      <Marquee />
      <NewArrivals products={newArrivals} />
      <TrustBadges />
      <SocialGrid />
    </>
  )
}
