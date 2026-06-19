import { Suspense } from 'react'
import { getCategories, getProducts } from '@/lib/strapi/fetch'
import ProductCard from '@/components/shop/ProductCard'
import ShopFilters from '@/components/shop/ShopFilters'
import ShopSort from '@/components/shop/ShopSort'
import Pagination from '@/components/shop/Pagination'
import TrackEvent from '@/components/analytics/TrackEvent'

type SP = Promise<{ [key: string]: string | string[] | undefined }>

export const metadata = {
  title: 'Shop',
  description: 'Browse our full collection of luxury accessories, books, and caps.',
}

async function ShopContent({ searchParams }: { searchParams: SP }) {
  const { sort, page, badge } = await searchParams

  const [categories, productsRes] = await Promise.all([
    getCategories(),
    getProducts({
      sort: typeof sort === 'string' ? sort : undefined,
      badge: typeof badge === 'string' ? badge : undefined,
      page: typeof page === 'string' ? Math.max(1, parseInt(page, 10)) : 1,
    }),
  ])

  const products = productsRes?.data ?? []
  const pagination = productsRes?.meta.pagination

  return (
    <main className='min-h-screen pt-12 pb-24 px-4 md:px-8 max-w-400 mx-auto'>
      <TrackEvent
        event='view_item_list'
        payload={{
          item_list_id: 'full_catalog',
          item_list_name: 'Full Catalog',
          items: products.map((p, idx) => ({
            item_id: String(p.id),
            item_name: p.name,
            index: idx + 1,
            price: p.price,
            item_category: p.category?.name ?? undefined,
          })),
        }}
      />
      <div className='flex flex-col md:flex-row gap-12'>
        <ShopFilters categories={categories} />

        <section className='flex-1 space-y-10'>
          <div className='flex flex-wrap items-center justify-end gap-4'>
            <ShopSort />
          </div>

          {products.length === 0 ? (
            <div className='py-24 text-center text-neutral-500'>No products found.</div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {products.map((product) => (
                <ProductCard key={product.documentId} product={product} />
              ))}
            </div>
          )}

          {pagination && (
            <Pagination currentPage={pagination.page} totalPages={pagination.pageCount} />
          )}
        </section>
      </div>
    </main>
  )
}

export default function ShopPage({ searchParams }: { searchParams: SP }) {
  return (
    <Suspense>
      <ShopContent searchParams={searchParams} />
    </Suspense>
  )
}
