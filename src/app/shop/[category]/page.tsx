import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getCategories, getProducts } from '@/lib/strapi/fetch'
import ProductCard from '@/components/shop/ProductCard'
import ShopFilters from '@/components/shop/ShopFilters'
import ShopSort from '@/components/shop/ShopSort'
import Pagination from '@/components/shop/Pagination'

type SP = Promise<{ [key: string]: string | string[] | undefined }>

interface Props {
  params: Promise<{ category: string }>
  searchParams: SP
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params
  const slug = category.toLowerCase()
  return {
    title: slug.charAt(0).toUpperCase() + slug.slice(1),
    description: `Browse our ${slug} collection.`,
  }
}

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.length > 0
    ? categories.map((cat) => ({ category: cat.slug }))
    : [{ category: '_' }]
}

async function CategoryContent({ params, searchParams }: Props) {
  const [{ category }, sp] = await Promise.all([params, searchParams])
  const { sort, page, badge } = sp

  const [categories, productsRes] = await Promise.all([
    getCategories(),
    getProducts({
      categorySlug: category,
      sort: typeof sort === 'string' ? sort : undefined,
      badge: typeof badge === 'string' ? badge : undefined,
      page: typeof page === 'string' ? Math.max(1, parseInt(page, 10)) : 1,
    }),
  ])

  // 404 if the slug doesn't match any known category
  const matchedCategory = categories.find((c) => c.slug === category)
  if (!matchedCategory) notFound()

  const products = productsRes?.data ?? []
  const pagination = productsRes?.meta.pagination

  return (
    <main className='min-h-screen pt-12 pb-24 px-4 md:px-8 max-w-[1600px] mx-auto'>
      <div className='flex flex-col md:flex-row gap-12'>
          <ShopFilters categories={categories} activeCategory={category} />

        <section className='flex-1 space-y-10'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <h1 className='font-serif text-3xl font-bold text-on-surface'>
              {matchedCategory.name}
            </h1>
              <ShopSort activeCategory={category} />
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

export default function CategoryPage(props: Props) {
  return (
    <Suspense>
      <CategoryContent {...props} />
    </Suspense>
  )
}
