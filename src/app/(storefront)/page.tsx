import type { Metadata } from 'next'
import { getCategories, getNewArrivals } from '@/lib/strapi/fetch'

export const metadata: Metadata = {
  title: {
    absolute: 'Crete Accessories | Luxury Jewelry, Books & Caps',
  },
  description:
    'Shop handcrafted luxury jewelry, editorial books, and statement caps. African aesthetics, global edge.',
  openGraph: {
    siteName: 'Crete Accessories',
    title: 'Crete Accessories | Luxury Jewelry, Books & Caps',
    description:
      'Shop handcrafted luxury jewelry, editorial books, and statement caps. African aesthetics, global edge.',
    type: 'website',
    images: [
      {
        url: '/og-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Crete Accessories Brand Showcase',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crete Accessories | Luxury Jewelry, Books & Caps',
    description:
      'Shop handcrafted luxury jewelry, editorial books, and statement caps. African aesthetics, global edge.',
    images: ['/og-banner.jpg'],
  },
}
import Hero from '@/components/home/Hero'
import CategoryStrip from '@/components/home/CategoryStrip'
import Marquee from '@/components/home/Marquee'
import NewArrivals from '@/components/home/NewArrivals'
import TrustBadges from '@/components/home/TrustBadges'
import SocialGrid from '@/components/home/SocialGrid'
import TrackEvent from '@/components/analytics/TrackEvent'

import { Suspense } from 'react'

async function HomeContent() {
  const [categories, newArrivals] = await Promise.all([
    getCategories(),
    getNewArrivals(3),
  ])

  return (
    <>
      <TrackEvent
        event='view_item_list'
        payload={{
          item_list_id: 'new_arrivals',
          item_list_name: 'New Arrivals',
          items: newArrivals.map((p, idx) => ({
            item_id: String(p.id),
            item_name: p.name,
            index: idx + 1,
            price: p.price,
            item_category: p.category?.name ?? undefined,
          })),
        }}
      />
      <Hero />
      <CategoryStrip categories={categories} />
      <Marquee />
      <NewArrivals products={newArrivals} />
      <TrustBadges />
      <SocialGrid />
    </>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <>
        <Hero />
        <Marquee />
        <TrustBadges />
        <SocialGrid />
      </>
    }>
      <HomeContent />
    </Suspense>
  )
}
