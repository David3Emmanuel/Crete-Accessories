import { getCategories, getNewArrivals } from '@/lib/strapi/fetch'
import Hero from '@/components/home/Hero'
import CategoryStrip from '@/components/home/CategoryStrip'
import Marquee from '@/components/home/Marquee'
import NewArrivals from '@/components/home/NewArrivals'
import TrustBadges from '@/components/home/TrustBadges'
import SocialGrid from '@/components/home/SocialGrid'

export default async function HomePage() {
  const [categories, newArrivals] = await Promise.all([getCategories(), getNewArrivals(3)])

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
