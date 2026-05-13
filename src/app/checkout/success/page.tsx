'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const reference = searchParams.get('reference') ?? searchParams.get('trxref')
  const clearCart = useCartStore((s) => s.clearCart)

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <main className='min-h-screen flex flex-col items-center justify-center px-4 text-center gap-8'>
      <CheckCircle size={72} className='text-primary' strokeWidth={1} />

      <div className='space-y-3'>
        <h1 className='font-serif text-4xl md:text-6xl font-light tracking-tighter text-on-surface'>
          Order Confirmed
        </h1>
        <p className='text-neutral-400 max-w-md mx-auto'>
          Thank you for your purchase. We&apos;ll start processing your order
          right away.
        </p>
      </div>

      {reference && (
        <div className='bg-[#1c1b1b] rounded-lg px-8 py-5 space-y-1'>
          <p className='text-xs uppercase tracking-widest text-neutral-500'>
            Payment Reference
          </p>
          <p className='font-mono text-primary text-sm'>{reference}</p>
        </div>
      )}

      <div className='flex flex-col sm:flex-row gap-4'>
        <Link
          href='/shop'
          className='px-8 py-3.5 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity'
        >
          Continue Shopping
        </Link>
        <Link
          href='/account/orders'
          className='px-8 py-3.5 rounded-full border border-neutral-700 text-neutral-400 text-sm hover:border-primary hover:text-primary transition-colors uppercase tracking-widest'
        >
          View Orders
        </Link>
      </div>
    </main>
  )
}
