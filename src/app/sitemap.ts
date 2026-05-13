import type { MetadataRoute } from 'next'
import { getProductSlugs, getCategories } from '@/lib/strapi/fetch'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://creteaccessories.com'
  const now = new Date()

  const [slugs, categories] = await Promise.all([getProductSlugs(), getCategories()])

  const statics: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/shop`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
  ]

  const categoryUrls: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${siteUrl}/shop/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const productUrls: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${siteUrl}/products/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...statics, ...categoryUrls, ...productUrls]
}
