'use client'

import Image from 'next/image'
import Link from 'next/link'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { getStrapiMediaUrl } from '@/lib/strapi/media'

export default function CartDrawer() {
  const { items, drawerOpen, closeDrawer, updateQty, removeItem, subtotal } =
    useCartStore()

  return (
    <>
      {drawerOpen && (
        <div
          className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm'
          onClick={closeDrawer}
        />
      )}

      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-[#1c1b1b] shadow-2xl flex flex-col transition-transform duration-300 ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className='flex items-center justify-between px-6 py-5 border-b border-neutral-800'>
          <h2 className='font-serif text-xl font-bold text-on-surface'>
            Your Cart
          </h2>
          <button
            onClick={closeDrawer}
            aria-label='Close cart'
            className='text-neutral-400 hover:text-primary transition-colors'
          >
            <X size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className='flex-1 flex flex-col items-center justify-center gap-4 text-neutral-500'>
            <ShoppingBag size={48} strokeWidth={1} />
            <p className='text-sm uppercase tracking-widest'>
              Your cart is empty
            </p>
            <button
              onClick={closeDrawer}
              className='mt-2 text-primary text-sm underline underline-offset-4'
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <ul className='flex-1 overflow-y-auto divide-y divide-neutral-800 px-6'>
              {items.map(({ product, quantity, variant }) => {
                const image = product.images?.[0]
                const imageUrl = image ? getStrapiMediaUrl(image.url) : null
                return (
                  <li
                    key={`${product.id}::${variant ?? ''}`}
                    className='py-5 flex gap-4'
                  >
                    <div className='relative w-20 h-20 rounded-lg overflow-hidden bg-surface-container flex-shrink-0'>
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={image?.alternativeText ?? product.name}
                          fill
                          className='object-cover'
                          sizes='80px'
                        />
                      ) : (
                        <div className='w-full h-full bg-surface-container' />
                      )}
                    </div>

                    <div className='flex-1 min-w-0'>
                      <p className='font-serif text-sm text-on-surface leading-snug truncate'>
                        {product.name}
                      </p>
                      {variant && (
                        <p className='text-xs text-neutral-500 mt-0.5'>
                          {variant}
                        </p>
                      )}
                      <p className='text-primary text-sm font-medium mt-1'>
                        ₦{product.price.toLocaleString('en-NG')}
                      </p>

                      <div className='flex items-center gap-3 mt-2'>
                        <button
                          aria-label='Decrease quantity'
                          onClick={() =>
                            updateQty(product.id, quantity - 1, variant)
                          }
                          className='w-7 h-7 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:border-primary hover:text-primary transition-colors'
                        >
                          <Minus size={12} />
                        </button>
                        <span className='text-sm text-on-surface w-4 text-center'>
                          {quantity}
                        </span>
                        <button
                          aria-label='Increase quantity'
                          onClick={() =>
                            updateQty(product.id, quantity + 1, variant)
                          }
                          className='w-7 h-7 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:border-primary hover:text-primary transition-colors'
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => removeItem(product.id, variant)}
                          className='ml-auto text-xs text-neutral-500 hover:text-red-400 transition-colors'
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div className='px-6 py-6 border-t border-neutral-800 space-y-4'>
              <div className='flex justify-between text-sm text-neutral-400'>
                <span>Subtotal</span>
                <span className='text-on-surface font-medium'>
                  ₦{subtotal().toLocaleString('en-NG')}
                </span>
              </div>
              <p className='text-xs text-neutral-500'>
                Shipping and VAT calculated at checkout.
              </p>
              <Link
                href='/checkout'
                onClick={closeDrawer}
                className='block w-full py-3.5 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-sm text-center uppercase tracking-widest hover:opacity-90 transition-opacity'
              >
                Checkout
              </Link>
              <Link
                href='/cart'
                onClick={closeDrawer}
                className='block w-full py-3 rounded-full border border-neutral-700 text-neutral-400 text-sm text-center hover:border-primary hover:text-primary transition-colors'
              >
                View Cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
