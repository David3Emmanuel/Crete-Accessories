'use client'

import { useState } from 'react'
import { Heart, Minus, Plus, ShieldCheck, Truck } from 'lucide-react'
import type { Product, ProductVariant } from '@/lib/strapi/types'

interface ProductActionsProps {
  product: Product
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [qty, setQty] = useState(1)
  const [activeVariant, setActiveVariant] = useState<ProductVariant | null>(
    product.variants?.[0] ?? null,
  )

  return (
    <div className='flex flex-col gap-8'>
      {/* Variant colour swatches */}
      {product.variants && product.variants.length > 0 && (
        <div className='space-y-3'>
          <label className='text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold'>
            {activeVariant?.name ?? 'Finish'}
          </label>
          <div className='flex gap-3'>
            {product.variants.map((v: ProductVariant) => {
              const isActive = activeVariant?.name === v.name
              return (
                <button
                  key={v.name}
                  onClick={() => setActiveVariant(v)}
                  aria-label={v.name}
                  className={`w-10 h-10 rounded-full border-2 p-0.5 transition-all ${
                    isActive ? 'border-primary' : 'border-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  <div
                    className='w-full h-full rounded-full'
                    style={{ backgroundColor: v.colorHex ?? '#888' }}
                  />
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className='space-y-3'>
        <label className='text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-bold'>
          Quantity
        </label>
        <div className='flex items-center bg-surface-container rounded-full w-fit px-4 py-2 gap-2'>
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label='Decrease quantity'
            className='text-primary hover:text-primary-container transition-colors'
          >
            <Minus size={16} />
          </button>
          <span className='px-6 font-medium tabular-nums min-w-[2rem] text-center'>{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            aria-label='Increase quantity'
            className='text-primary hover:text-primary-container transition-colors'
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* CTAs */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <button className='flex-1 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold py-5 rounded-full transition-transform hover:scale-[1.02] active:scale-95 shadow-xl'>
          Add to Cart
        </button>
        <button className='flex items-center justify-center gap-2 px-8 py-5 rounded-full border border-neutral-600 hover:border-primary transition-colors text-on-surface'>
          <Heart size={18} />
          <span className='text-sm font-medium'>Save</span>
        </button>
      </div>

      {/* Mini trust strip */}
      <div className='flex items-center gap-6 pt-6 border-t border-neutral-800 text-[10px] uppercase tracking-widest text-neutral-500'>
        <div className='flex items-center gap-2'>
          <ShieldCheck size={14} className='text-primary' />
          <span>Certified Authentic</span>
        </div>
        <div className='flex items-center gap-2'>
          <Truck size={14} className='text-primary' />
          <span>Nationwide Delivery</span>
        </div>
      </div>
    </div>
  )
}
