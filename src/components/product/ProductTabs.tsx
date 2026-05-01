'use client'

import { useState } from 'react'
import type { Product } from '@/lib/strapi/types'

interface ProductTabsProps {
  product: Product
}

const TABS = ['Description', 'Delivery Info', 'Reviews'] as const
type Tab = (typeof TABS)[number]

export default function ProductTabs({ product }: ProductTabsProps) {
  const [active, setActive] = useState<Tab>('Description')

  return (
    <section className='mt-24 px-8 lg:px-16'>
      {/* Tab bar */}
      <div className='border-b border-neutral-800 flex gap-12 overflow-x-auto [scrollbar-width:none]'>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`pb-4 text-sm font-medium tracking-wide transition-colors whitespace-nowrap relative ${
              active === tab
                ? 'text-on-surface border-b-2 border-primary'
                : 'text-neutral-500 hover:text-on-surface'
            }`}
          >
            {tab === 'Reviews' ? `${tab} (0)` : tab}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div className='py-12'>
        {active === 'Description' && (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
            <div className='md:col-span-2 space-y-6'>
              {product.description ? (
                <div
                  className='text-neutral-400 leading-relaxed prose prose-invert max-w-none'
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <p className='text-neutral-500 italic'>No description available.</p>
              )}

              {product.specifications && product.specifications.length > 0 && (
                <ul className='space-y-3 text-neutral-400 pt-4'>
                  {product.specifications.map((spec, i) => (
                    <li key={i} className='flex items-center gap-3'>
                      <span className='w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0' />
                      <span>
                        <span className='text-on-surface font-medium'>{spec.label}:</span>{' '}
                        {spec.value}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className='bg-surface-container rounded-xl p-8 space-y-4 h-fit'>
              <h4 className='text-xs font-bold uppercase tracking-widest text-primary'>
                Our Promise
              </h4>
              <p className='text-sm text-neutral-400 italic leading-relaxed'>
                &ldquo;Every Crete piece is ethically sourced and crafted in small batches,
                ensuring both quality and sustainability.&rdquo;
              </p>
            </div>
          </div>
        )}

        {active === 'Delivery Info' && (
          <div className='max-w-2xl space-y-6 text-neutral-400'>
            <div className='space-y-2'>
              <h3 className='font-serif text-lg font-bold text-on-surface'>
                Nationwide Delivery
              </h3>
              <p className='leading-relaxed'>
                We deliver to all states across Nigeria. Standard delivery takes 3–5 business
                days. Express delivery (1–2 days) is available for Lagos, Abuja, and Port
                Harcourt.
              </p>
            </div>
            <div className='space-y-2'>
              <h3 className='font-serif text-lg font-bold text-on-surface'>Returns</h3>
              <p className='leading-relaxed'>
                Unworn items in original packaging can be returned within 14 days for a full
                refund. Customised or engraved items are non-returnable.
              </p>
            </div>
            <div className='space-y-2'>
              <h3 className='font-serif text-lg font-bold text-on-surface'>Packaging</h3>
              <p className='leading-relaxed'>
                All orders arrive in a Crete signature black box with a certificate of
                authenticity.
              </p>
            </div>
          </div>
        )}

        {active === 'Reviews' && (
          <div className='py-12 text-center text-neutral-500'>
            <p>No reviews yet. Be the first to share your experience.</p>
          </div>
        )}
      </div>
    </section>
  )
}
