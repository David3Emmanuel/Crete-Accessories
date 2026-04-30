import { cacheLife, cacheTag } from 'next/cache'
import type { Category, Product, StrapiListResponse, StrapiSingleResponse } from './types'

export { getStrapiMediaUrl } from './media'

const baseURL = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337'

async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${baseURL}/api${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.STRAPI_API_TOKEN
          ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
          : {}),
      },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function getCategories(): Promise<Category[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('categories')
  const res = await get<StrapiListResponse<Category>>('/categories?populate=image')
  return res?.data ?? []
}

export async function getNewArrivals(limit = 3): Promise<Product[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('products')
  const res = await get<StrapiListResponse<Product>>(
    `/products?populate=images,category&sort=publishedAt:desc&pagination[limit]=${limit}`,
  )
  return res?.data ?? []
}

// ─── Shop query options ───────────────────────────────────────────────────────

const sortMap: Record<string, string> = {
  'price-asc': 'price:asc',
  'price-desc': 'price:desc',
  latest: 'publishedAt:desc',
}

export interface ShopQueryOptions {
  categorySlug?: string
  sort?: string
  badge?: string
  page?: number
  pageSize?: number
}

export async function getProducts(
  options: ShopQueryOptions = {},
): Promise<StrapiListResponse<Product> | null> {
  'use cache'
  cacheLife('hours')
  cacheTag('products')

  const { categorySlug, sort, badge, page = 1, pageSize = 12 } = options
  const parts: string[] = ['populate=images,category']

  if (categorySlug) parts.push(`filters[category][slug][$eq]=${encodeURIComponent(categorySlug)}`)
  if (badge) parts.push(`filters[badge][$eq]=${encodeURIComponent(badge)}`)
  parts.push(`sort=${sortMap[sort ?? ''] ?? 'publishedAt:desc'}`)
  parts.push(`pagination[page]=${page}&pagination[pageSize]=${pageSize}`)

  return get<StrapiListResponse<Product>>(`/products?${parts.join('&')}`)
}

export async function getProductSlugs(): Promise<string[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('products')
  const res = await get<StrapiListResponse<Product>>(
    '/products?fields=slug&pagination[pageSize]=100',
  )
  return res?.data.map((p) => p.slug).filter(Boolean) ?? []
}

export async function getRelatedProducts(
  categorySlug: string,
  excludeSlug: string,
  limit = 4,
): Promise<Product[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('products')
  const res = await get<StrapiListResponse<Product>>(
    `/products?populate=images,category&filters[category][slug][$eq]=${encodeURIComponent(categorySlug)}&filters[slug][$ne]=${encodeURIComponent(excludeSlug)}&pagination[limit]=${limit}&sort=publishedAt:desc`,
  )
  return res?.data ?? []
}

export async function getProduct(slug: string): Promise<Product | null> {
  'use cache'
  cacheLife('hours')
  cacheTag('products')
  const res = await get<StrapiListResponse<Product>>(
    `/products?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=images,category,specifications,variants`,
  )
  return res?.data?.[0] ?? null
}
