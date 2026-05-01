import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { getProduct, getProductSlugs, getRelatedProducts } from '@/lib/strapi/fetch'
import ImageGallery from '@/components/product/ImageGallery'
import ProductActions from '@/components/product/ProductActions'
import ProductTabs from '@/components/product/ProductTabs'
import ProductCard from '@/components/shop/ProductCard'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getProductSlugs()
  return slugs.length > 0 ? slugs.map((slug) => ({ slug })) : [{ slug: '_' }]
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return {}
  return {
    title: product.seoTitle ?? product.name,
    description: product.seoDescription ?? undefined,
    openGraph: {
      title: product.seoTitle ?? product.name,
      description: product.seoDescription ?? undefined,
      images: product.images?.[0]
        ? [{ url: product.images[0].url }]
        : [],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const related = product.category?.slug
    ? await getRelatedProducts(product.category.slug, slug)
    : []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.seoDescription ?? undefined,
    image: product.images?.map((img: { url: string }) => img.url) ?? [],
    offers: {
      '@type': 'Offer',
      priceCurrency: 'NGN',
      price: product.price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  }

  return (
    <main className='min-h-screen pb-24'>
      {/* JSON-LD */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className='px-8 py-6 text-xs uppercase tracking-widest text-neutral-500 flex gap-2 items-center flex-wrap'>
        <Link href='/shop' className='hover:text-primary transition-colors'>
          Shop
        </Link>
        {product.category && (
          <>
            <ChevronRight size={14} />
            <Link
              href={`/shop/${product.category.slug}`}
              className='hover:text-primary transition-colors'
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight size={14} />
        <span className='text-on-surface'>{product.name}</span>
      </nav>

      {/* Hero: image + details */}
      <section className='grid grid-cols-1 lg:grid-cols-2 gap-12 px-8 lg:px-16 items-start'>
        <ImageGallery images={product.images ?? []} productName={product.name} />

        <div className='flex flex-col gap-8 lg:sticky lg:top-32'>
          {/* Title block */}
          <div className='space-y-2'>
            {product.badge && (
              <span className='text-tertiary font-medium tracking-[0.2em] text-xs uppercase'>
                {product.badge === 'BestSeller' ? 'Best Seller' : product.badge}
              </span>
            )}
            <h1 className='text-5xl lg:text-6xl font-serif font-black tracking-tighter text-on-surface leading-tight'>
              {product.name}
            </h1>
            <p className='text-2xl font-light text-primary mt-4'>
              ₦{product.price.toLocaleString('en-NG')}
            </p>
          </div>

          {/* Short description */}
          {'material' in product && product.material && (
            <p className='text-neutral-400 leading-relaxed font-light max-w-md'>
              {product.material as string}
            </p>
          )}

          <ProductActions product={product} />
        </div>
      </section>

      {/* Tabs */}
      <ProductTabs product={product} />

      {/* Related products */}
      {related.length > 0 && (
        <section className='mt-24 px-8 lg:px-16'>
          <h2 className='font-serif text-3xl font-black tracking-tighter mb-12'>
            You May Also Like
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
            {related.map((p, i) => (
              <ProductCard
                key={p.documentId}
                product={p}
                className={i % 2 === 1 ? 'sm:translate-y-12' : ''}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
