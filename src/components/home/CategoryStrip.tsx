import Image from 'next/image'
import Link from 'next/link'
import type { Category } from '@/lib/strapi/types'
import { getStrapiMediaUrl } from '@/lib/strapi/media'

interface CategoryStripProps {
  categories: Category[]
}

const labels: Record<string, string> = {
  jewelry: 'Collection',
  books: 'Curated',
  caps: 'Premium',
}

export default function CategoryStrip({ categories }: CategoryStripProps) {
  return (
    <section className='py-12 bg-[#0e0e0e] overflow-hidden'>
      <div className='flex gap-8 px-8 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory'>
        {categories.map((cat) => {
          const imageUrl = cat.image ? getStrapiMediaUrl(cat.image.url) : null
          const label = labels[cat.slug?.toLowerCase() ?? ''] ?? 'Collection'
          return (
            <Link
              key={cat.documentId}
              href={`/shop/${cat.slug}`}
              className='relative min-w-[300px] flex-shrink-0 snap-center group overflow-hidden rounded-xl h-48'
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={cat.name}
                  fill
                  className='object-cover group-hover:scale-110 transition-transform duration-700'
                  sizes='300px'
                />
              ) : (
                <div className='absolute inset-0 bg-surface-container' />
              )}
              <div className='absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors' />
              <div className='absolute bottom-6 left-6'>
                <span className='text-primary font-bold text-xs uppercase tracking-[0.2em] mb-2 block'>
                  {label}
                </span>
                <h3 className='text-2xl font-serif font-bold text-neutral-100'>{cat.name}</h3>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
