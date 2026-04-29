import Link from 'next/link'
import type { Product } from '@/lib/strapi/types'
import ProductCard from '@/components/shop/ProductCard'

interface NewArrivalsProps {
  products: Product[]
}

export default function NewArrivals({ products }: NewArrivalsProps) {
  return (
    <section className='py-24 px-8 bg-surface-dim'>
      <div className='flex justify-between items-end mb-16'>
        <div>
          <span className='text-primary font-medium tracking-[0.3em] uppercase block mb-4'>
            Curated Selection
          </span>
          <h2 className='font-serif text-4xl md:text-5xl font-bold text-neutral-100'>
            New Arrivals
          </h2>
        </div>
        <Link
          href='/shop'
          className='text-primary border-b border-primary pb-1 hover:text-primary-container transition-colors'
        >
          View All Collection
        </Link>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
        {products.map((product, i) => (
          <ProductCard
            key={product.documentId}
            product={product}
            variant='home'
            className={i === 1 ? 'md:translate-y-12' : ''}
          />
        ))}
      </div>
    </section>
  )
}
