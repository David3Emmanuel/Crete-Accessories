'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import type { Product } from '@/lib/strapi/types'
import { getStrapiMediaUrl } from '@/lib/strapi/media'
import { useCartStore } from '@/lib/store/cart'

interface ProductCardProps {
  product: Product
  className?: string
  /** 'shop' = edge-to-edge image, circular cart btn (default)
   *  'home' = padded image, full-width add-to-cart button */
  variant?: 'shop' | 'home'
}

const badgeStyles: Record<string, string> = {
  New: 'bg-tertiary/20 text-tertiary',
  BestSeller: 'bg-surface-high/80 text-on-surface',
  Limited: 'bg-tertiary/20 text-tertiary',
  Sale: 'bg-primary/20 text-primary',
}

export default function ProductCard({
  product,
  className = '',
  variant = 'shop',
}: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const image = product.images?.[0]
  const imageUrl = image ? getStrapiMediaUrl(image.url) : null
  const badge = product.badge

  if (variant === 'home') {
    return (
      <div
        className={`group bg-[#1a1a1a] p-6 rounded-lg transition-all duration-500 hover:shadow-[0_0_50px_rgba(230,195,100,0.1)] ${className}`}
      >
        <Link href={`/products/${product.slug}`}>
          <div className='relative aspect-[4/5] overflow-hidden rounded-lg mb-6 bg-surface-container'>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={image?.alternativeText ?? product.name}
                fill
                className='object-cover group-hover:scale-105 transition-transform duration-700'
                sizes='(max-width: 768px) 100vw, 33vw'
              />
            ) : (
              <div className='w-full h-full bg-surface-container' />
            )}
          </div>
          <div className='space-y-3'>
            <p className='text-neutral-500 text-xs tracking-widest uppercase'>
              {product.category?.name ?? ''}
            </p>
            <h3 className='font-serif text-xl font-bold text-on-surface'>{product.name}</h3>
            <p className='text-primary font-bold text-lg'>
              ₦{product.price.toLocaleString('en-NG')}
            </p>
          </div>
        </Link>
        <button
          onClick={() => addItem(product)}
          className='w-full mt-4 py-3 border border-primary text-primary rounded-full group-hover:bg-primary group-hover:text-on-primary transition-all duration-300 font-bold uppercase tracking-widest text-xs'
        >
          Add to Cart
        </button>
      </div>
    )
  }

  // shop variant
  return (
    <div
      className={`group bg-[#1c1b1b] rounded-lg overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col border border-transparent hover:border-primary/20 ${className}`}
    >
      <Link href={`/products/${product.slug}`} className='relative aspect-[4/5] overflow-hidden'>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={image?.alternativeText ?? product.name}
            fill
            className='object-cover transition-transform duration-700 group-hover:scale-110'
            sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
          />
        ) : (
          <div className='absolute inset-0 bg-surface-container' />
        )}
        {badge && (
          <span
            className={`absolute top-4 right-4 px-3 py-1 backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest uppercase ${badgeStyles[badge] ?? 'bg-surface-high/80 text-on-surface'}`}
          >
            {badge === 'BestSeller' ? 'Best Seller' : badge}
          </span>
        )}
      </Link>

      <div className='p-6 space-y-4 flex flex-col flex-1'>
        <div className='space-y-1'>
          <h4 className='font-serif text-xl text-on-surface leading-tight'>{product.name}</h4>
          {'material' in product && product.material && (
            <p className='text-sm text-neutral-500'>{product.material as string}</p>
          )}
        </div>
        <div className='mt-auto flex items-center justify-between pt-4'>
          <span className='text-xl font-medium text-primary'>
            ₦{product.price.toLocaleString('en-NG')}
          </span>
          <button
            aria-label={`Add ${product.name} to cart`}
            onClick={() => addItem(product)}
            className='flex items-center justify-center w-12 h-12 rounded-full bg-primary-container text-on-primary hover:bg-primary transition-colors shadow-lg shadow-primary/10'
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
