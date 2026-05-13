'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Minus, Plus, ShieldCheck, RefreshCw } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { getStrapiMediaUrl } from '@/lib/strapi/media'

const SHIPPING = 3500
const VAT_RATE = 0.075

const NIGERIAN_STATES = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'FCT (Abuja)',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
]

interface DeliveryForm {
  fullName: string
  phone: string
  address: string
  state: string
  city: string
  email: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, updateQty, subtotal } = useCartStore()

  const [form, setForm] = useState<DeliveryForm>({
    fullName: '',
    phone: '',
    address: '',
    state: 'Lagos',
    city: '',
    email: '',
  })
  const [errors, setErrors] = useState<Partial<DeliveryForm>>({})
  const [loading, setLoading] = useState(false)

  const sub = subtotal()
  const vat = Math.round(sub * VAT_RATE)
  const total = sub + SHIPPING + vat

  function validate(): boolean {
    const e: Partial<DeliveryForm> = {}
    if (!form.fullName.trim()) e.fullName = 'Required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Valid email required'
    if (
      !form.phone.trim() ||
      !/^(\+?234|0)[789]\d{9}$/.test(form.phone.replace(/\s/g, ''))
    )
      e.phone = 'Enter a valid Nigerian number'
    if (!form.address.trim()) e.address = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handlePay() {
    if (!validate()) return
    if (items.length === 0) return

    setLoading(true)
    try {
      const res = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          email: form.email,
          metadata: {
            fullName: form.fullName,
            phone: form.phone,
            address: form.address,
            state: form.state,
            city: form.city,
            items: items.map((i) => ({
              name: i.product.name,
              quantity: i.quantity,
              price: i.product.price,
              variant: i.variant,
            })),
          },
        }),
      })

      if (!res.ok) throw new Error('Payment initialization failed')
      const { authorization_url } = await res.json()
      router.push(authorization_url)
    } catch {
      alert('Could not initialize payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    router.push('/shop')
    return null
  }

  const fieldClass = (err?: string) =>
    `w-full bg-[#2a2a2a] rounded-lg px-4 py-3 text-on-surface placeholder:text-neutral-600 focus:outline-none focus:ring-1 ${err ? 'ring-1 ring-red-500' : 'focus:ring-primary'}`

  return (
    <main className='min-h-screen pt-12 pb-24 px-4 md:px-12 max-w-[1440px] mx-auto'>
      <div className='mb-12'>
        <h1 className='font-serif text-5xl md:text-7xl font-light tracking-tighter text-on-surface'>
          Secure Checkout
        </h1>
        <p className='text-neutral-500 mt-3 tracking-wide'>
          Finalize your selection from the Crete Collection.
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-16'>
        <div className='lg:col-span-7 space-y-16'>
          {/* Cart items */}
          <section>
            <h2 className='font-serif text-2xl mb-6 text-on-surface'>
              Your Selection
            </h2>
            <div className='space-y-4'>
              {items.map(({ product, quantity, variant }) => {
                const image = product.images?.[0]
                const imageUrl = image ? getStrapiMediaUrl(image.url) : null
                return (
                  <div
                    key={`${product.id}::${variant ?? ''}`}
                    className='flex items-center gap-6 p-5 rounded-lg bg-[#1c1b1b]'
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
                    <div className='flex-1'>
                      <p className='font-serif text-base text-on-surface'>
                        {product.name}
                      </p>
                      {variant && (
                        <p className='text-xs text-neutral-500'>{variant}</p>
                      )}
                      <p className='text-primary text-sm font-medium mt-1'>
                        ₦{product.price.toLocaleString('en-NG')}
                      </p>
                    </div>
                    <div className='flex items-center gap-3'>
                      <button
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
                        onClick={() =>
                          updateQty(product.id, quantity + 1, variant)
                        }
                        className='w-7 h-7 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:border-primary hover:text-primary transition-colors'
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className='text-sm text-on-surface font-medium w-24 text-right'>
                      ₦{(product.price * quantity).toLocaleString('en-NG')}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Delivery form */}
          <section>
            <h2 className='font-serif text-2xl mb-8 text-on-surface'>
              Delivery Details
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <div className='flex flex-col gap-1.5'>
                <label className='text-xs uppercase tracking-widest text-neutral-500'>
                  Full Name
                </label>
                <input
                  type='text'
                  placeholder='Adewale Okonkwo'
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  className={fieldClass(errors.fullName)}
                />
                {errors.fullName && (
                  <p className='text-xs text-red-400'>{errors.fullName}</p>
                )}
              </div>

              <div className='flex flex-col gap-1.5'>
                <label className='text-xs uppercase tracking-widest text-neutral-500'>
                  Email
                </label>
                <input
                  type='email'
                  placeholder='you@example.com'
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={fieldClass(errors.email)}
                />
                {errors.email && (
                  <p className='text-xs text-red-400'>{errors.email}</p>
                )}
              </div>

              <div className='flex flex-col gap-1.5'>
                <label className='text-xs uppercase tracking-widest text-neutral-500'>
                  Phone Number
                </label>
                <input
                  type='tel'
                  placeholder='+234 800 000 0000'
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={fieldClass(errors.phone)}
                />
                {errors.phone && (
                  <p className='text-xs text-red-400'>{errors.phone}</p>
                )}
              </div>

              <div className='md:col-span-2 flex flex-col gap-1.5'>
                <label className='text-xs uppercase tracking-widest text-neutral-500'>
                  Delivery Address
                </label>
                <input
                  type='text'
                  placeholder='12 Heritage Plaza, Victoria Island'
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  className={fieldClass(errors.address)}
                />
                {errors.address && (
                  <p className='text-xs text-red-400'>{errors.address}</p>
                )}
              </div>

              <div className='flex flex-col gap-1.5'>
                <label className='text-xs uppercase tracking-widest text-neutral-500'>
                  State
                </label>
                <select
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className={fieldClass() + ' appearance-none cursor-pointer'}
                >
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className='flex flex-col gap-1.5'>
                <label className='text-xs uppercase tracking-widest text-neutral-500'>
                  City
                </label>
                <input
                  type='text'
                  placeholder='Lekki Phase 1'
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className={fieldClass(errors.city)}
                />
                {errors.city && (
                  <p className='text-xs text-red-400'>{errors.city}</p>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Summary sidebar */}
        <aside className='lg:col-span-5'>
          <div className='sticky top-32 space-y-6'>
            <div className='bg-[#1c1b1b] rounded-lg p-8 relative overflow-hidden'>
              <div className='absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16' />
              <h2 className='font-serif text-3xl mb-8 text-on-surface'>
                Summary
              </h2>

              <div className='space-y-3 mb-8 text-sm text-neutral-400'>
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
                <div className='h-px bg-neutral-800 my-4' />
                <div className='flex justify-between text-lg font-bold text-on-surface'>
                  <span>Total Payable</span>
                  <span className='text-primary'>
                    ₦{total.toLocaleString('en-NG')}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePay}
                disabled={loading}
                className='w-full py-4 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold text-lg flex items-center justify-center gap-3 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? 'Initializing...' : 'Pay with Paystack'}
              </button>
              <p className='text-center text-[10px] text-neutral-600 mt-4 uppercase tracking-widest'>
                Secure encrypted checkout powered by Paystack
              </p>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='p-4 bg-[#1c1b1b] rounded-lg flex flex-col items-center text-center gap-2'>
                <ShieldCheck
                  size={28}
                  className='text-primary'
                  strokeWidth={1.5}
                />
                <span className='text-[10px] uppercase font-bold tracking-widest text-on-surface'>
                  Guaranteed Original
                </span>
              </div>
              <div className='p-4 bg-[#1c1b1b] rounded-lg flex flex-col items-center text-center gap-2'>
                <RefreshCw
                  size={28}
                  className='text-primary'
                  strokeWidth={1.5}
                />
                <span className='text-[10px] uppercase font-bold tracking-widest text-on-surface'>
                  7 Day Returns
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
