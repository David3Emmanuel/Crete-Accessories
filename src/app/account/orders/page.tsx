import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, ChevronRight, Clock, CheckCircle2, XCircle, Truck } from 'lucide-react'
import type { Order, StrapiListResponse } from '@/lib/strapi/types'
import LogoutButton from '@/components/auth/LogoutButton'

async function getOrders(jwt: string): Promise<Order[]> {
  const baseURL = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337'
  try {
    const res = await fetch(`${baseURL}/api/orders?sort=createdAt:desc`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      next: { revalidate: 0 }, // Don't cache order history
    })
    if (!res.ok) return []
    const data: StrapiListResponse<Order> = await res.json()
    return data.data
  } catch {
    return []
  }
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-amber-500 bg-amber-500/10',
  paid: 'text-emerald-500 bg-emerald-500/10',
  shipped: 'text-blue-500 bg-blue-500/10',
  delivered: 'text-primary bg-primary/10',
  cancelled: 'text-red-500 bg-red-500/10',
}

const STATUS_ICONS: Record<string, any> = {
  pending: Clock,
  paid: CheckCircle2,
  shipped: Truck,
  delivered: CheckCircle2,
  cancelled: XCircle,
}

function OrdersLoading() {
  return (
    <div className='space-y-6 animate-pulse'>
      {[1, 2].map((i) => (
        <div key={i} className='bg-[#1e1e1e] border border-white/5 rounded-2xl overflow-hidden p-8 space-y-6'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5'>
            <div className='flex items-center gap-6'>
              <div className='h-8 w-32 bg-white/5 rounded' />
              <div className='h-8 w-24 bg-white/5 rounded' />
            </div>
            <div className='h-8 w-32 bg-white/5 rounded' />
          </div>
          <div className='flex items-center gap-4'>
            <div className='w-16 h-16 bg-white/5 rounded-lg' />
            <div className='flex-1 space-y-2'>
              <div className='h-4 w-48 bg-white/5 rounded' />
              <div className='h-4 w-24 bg-white/5 rounded' />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

async function OrdersList() {
  const cookieStore = await cookies()
  const jwt = cookieStore.get('jwt')?.value

  if (!jwt) {
    redirect('/account/login')
  }

  const orders = await getOrders(jwt)

  if (orders.length === 0) {
    return (
      <div className='text-center py-24 bg-[#1e1e1e] rounded-2xl border border-white/5'>
        <Package className='mx-auto text-neutral-700 mb-6' size={48} />
        <h2 className='text-2xl font-serif text-neutral-400 mb-2'>No orders yet</h2>
        <p className='text-neutral-600 mb-8 max-w-xs mx-auto'>
          You haven't placed any orders with us yet. Your future purchases will appear here.
        </p>
        <Link
          href='/shop'
          className='bg-primary text-on-primary px-8 py-3 rounded-lg font-medium hover:bg-primary-container transition-all inline-block'
        >
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {orders.map((order) => {
        const StatusIcon = STATUS_ICONS[order.status] || Clock
        return (
          <div
            key={order.documentId}
            className='bg-[#1e1e1e] border border-white/5 rounded-2xl overflow-hidden hover:border-primary/20 transition-colors group'
          >
            <div className='p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5'>
              <div className='flex items-center gap-6'>
                <div className='space-y-1'>
                  <p className='text-neutral-500 text-xs uppercase tracking-widest'>Order Number</p>
                  <p className='text-on-surface font-mono text-sm'>{order.orderNumber}</p>
                </div>
                <div className='w-px h-10 bg-white/5 hidden md:block' />
                <div className='space-y-1'>
                  <p className='text-neutral-500 text-xs uppercase tracking-widest'>Date</p>
                  <p className='text-on-surface text-sm'>
                    {new Date(order.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-4'>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider ${STATUS_COLORS[order.status]}`}>
                  <StatusIcon size={14} />
                  {order.status}
                </div>
                <p className='text-xl font-medium text-primary'>
                  ₦{order.total.toLocaleString('en-NG')}
                </p>
              </div>
            </div>

            <div className='p-6 md:p-8 space-y-4'>
              {order.items?.map((item) => (
                <div key={item.documentId} className='flex items-center gap-4'>
                  <div className='relative w-16 h-16 bg-[#2a2a2a] rounded-lg overflow-hidden flex-shrink-0'>
                    {item.product?.images?.[0] && (
                      <img
                        src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${item.product.images[0].url}`}
                        alt={item.product.name}
                        className='w-full h-full object-cover'
                      />
                    )}
                  </div>
                  <div className='flex-1'>
                    <p className='text-on-surface font-medium'>{item.product?.name || 'Unknown Product'}</p>
                    <p className='text-neutral-500 text-sm'>
                      Qty: {item.quantity} × ₦{item.priceAtPurchase.toLocaleString('en-NG')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function OrdersPage() {
  return (
    <main className='min-h-screen py-20 px-4 md:px-8 max-w-5xl mx-auto'>
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12'>
        <div className='space-y-2'>
          <h1 className='font-serif text-5xl font-light tracking-tighter text-on-surface'>
            Order History
          </h1>
          <div className='flex items-center gap-4'>
            <p className='text-neutral-500 tracking-widest text-xs uppercase'>
              Track and manage your Crete collection
            </p>
            <span className='w-1 h-1 bg-neutral-700 rounded-full' />
            <LogoutButton />
          </div>
        </div>
        <Link 
          href='/shop'
          className='text-primary hover:text-primary-container transition-colors text-sm font-medium flex items-center gap-2'
        >
          Continue Shopping <ChevronRight size={16} />
        </Link>
      </div>

      <Suspense fallback={<OrdersLoading />}>
        <OrdersList />
      </Suspense>
    </main>
  )
}

