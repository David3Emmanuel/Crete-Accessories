'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { getStrapiMediaUrl } from '@/lib/strapi/media'

const SHIPPING = 3500
const VAT_RATE = 0.075

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, clearCart } = useCartStore()

  const sub = subtotal()
  const vat = Math.round(sub * VAT_RATE)
  const total = sub + SHIPPING + vat

  if (items.length === 0) {
    return (
      <main className='min-h-screen flex flex-col items-center justify-center gap-6 text-neutral-500'>
        <ShoppingBag size={64} strokeWidth={1} />
        <p className='font-serif text-2xl text-on-surface'>
          Your cart is empty
        </p>
        <Link
          href='/shop'
          className='px-8 py-3 rounded-full border border-primary text-primary hover:bg-primary hover:text-on-primary transition-colors text-sm uppercase tracking-widest font-bold'
        >
          Browse the Shop
        </Link>
      </main>
    )
  }

  return (
    <main className='min-h-screen pt-12 pb-24 px-4 md:px-12 max-w-[1440px] mx-auto'>
      <div className='mb-12'>
        <h1 className='font-serif text-5xl md:text-7xl font-light tracking-tighter text-on-surface'>
          Your Cart
        </h1>
        <p className='text-neutral-500 mt-3'>
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
        <section className='lg:col-span-7 space-y-4'>
          {items.map(({ product, quantity, variant }) => {
            const image = product.images?.[0]
            const imageUrl = image ? getStrapiMediaUrl(image.url) : null
            return (
              <div
                key={`${product.id}::${variant ?? ''}`}
                className='flex items-center gap-6 p-6 rounded-lg bg-[#1c1b1b] hover:bg-[#222] transition-colors'
              >
                <div className='relative w-24 h-24 rounded-lg overflow-hidden bg-surface-container flex-shrink-0'>
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={image?.alternativeText ?? product.name}
                      fill
                      className='object-cover'
                      sizes='96px'
                    />
                  ) : (
                    <div className='w-full h-full bg-surface-container' />
                  )}
                </div>

                <div className='flex-1 min-w-0'>
                  <Link
                    href={`/products/${product.slug}`}
                    className='font-serif text-lg text-on-surface hover:text-primary transition-colors'
                  >
                    {product.name}
                  </Link>
                  {variant && (
                    <p className='text-sm text-neutral-500 mt-0.5'>{variant}</p>
                  )}
                  <p className='text-primary font-medium mt-1'>
                    ₦{product.price.toLocaleString('en-NG')}
                  </p>

                  <div className='mt-3 flex items-center gap-3'>
                    <button
                      aria-label='Decrease quantity'
                      onClick={() =>
                        updateQty(product.id, quantity - 1, variant)
                      }
                      className='w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:border-primary hover:text-primary transition-colors'
                    >
                      <Minus size={14} />
                    </button>
                    <span className='text-sm text-on-surface w-5 text-center font-medium'>
                      {quantity}
                    </span>
                    <button
                      aria-label='Increase quantity'
                      onClick={() =>
                        updateQty(product.id, quantity + 1, variant)
                      }
                      className='w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:border-primary hover:text-primary transition-colors'
                    >
                      <Plus size={14} />
                    </button>
                    <span className='ml-auto text-sm text-on-surface font-medium'>
                      ₦{(product.price * quantity).toLocaleString('en-NG')}
                    </span>
                    <button
                      aria-label={`Remove ${product.name}`}
                      onClick={() => removeItem(product.id, variant)}
                      className='text-neutral-600 hover:text-red-400 transition-colors'
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          <button
            onClick={clearCart}
            className='text-xs text-neutral-500 hover:text-red-400 transition-colors uppercase tracking-widest mt-2'
          >
            Clear cart
          </button>
        </section>

        <aside className='lg:col-span-5'>
          <div className='sticky top-32 bg-[#1c1b1b] rounded-lg p-8 space-y-6'>
            <h2 className='font-serif text-2xl text-on-surface'>
              Order Summary
            </h2>

            <div className='space-y-3 text-sm text-neutral-400'>
              <div className='flex justify-between'>
                <span>Subtotal</span>
                <span className='text-on-surface'>
                  ₦{sub.toLocaleString('en-NG')}
                </span>
              </div>
              <div className='flex justify-between'>
                <span>Shipping</span>
                <span className='text-on-surface'>
                  ₦{SHIPPING.toLocaleString('en-NG')}
                </span>
              </div>
              <div className='flex justify-between'>
                <span>VAT (7.5%)</span>
                <span className='text-on-surface'>
                  ₦{vat.toLocaleString('en-NG')}
                </span>
              </div>
              <div className='h-px bg-neutral-800 my-2' />
              <div className='flex justify-between text-base font-bold text-on-surface'>
                <span>Total</span>
                <span className='text-primary'>
                  ₦{total.toLocaleString('en-NG')}
                </span>
              </div>
            </div>

            <Link
              href='/checkout'
              className='block w-full py-4 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-center uppercase tracking-widest hover:opacity-90 transition-opacity'
            >
              Proceed to Checkout
            </Link>
            <Link
              href='/shop'
              className='block w-full py-3 rounded-full border border-neutral-700 text-neutral-400 text-sm text-center hover:border-primary hover:text-primary transition-colors'
            >
              Continue Shopping
            </Link>
          </div>
        </aside>
      </div>
    </main>
  )
}
