'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Category } from '@/lib/strapi/types'

interface ShopFiltersProps {
  categories: Category[]
  activeCategory?: string
}

const badges = [
  { value: 'New', label: 'New Arrivals' },
  { value: 'Limited', label: 'Limited Editions' },
  { value: 'Sale', label: 'Sale Items' },
  { value: 'BestSeller', label: 'Best Sellers' },
]

export default function ShopFilters({ categories, activeCategory }: ShopFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeBadge = searchParams.get('badge')

  function toggleBadge(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (activeBadge === value) {
      params.delete('badge')
    } else {
      params.set('badge', value)
    }
    params.delete('page')
    const base = activeCategory ? `/shop/${activeCategory}` : '/shop'
    router.push(`${base}?${params.toString()}`)
  }

  return (
    <aside className='w-full md:w-64 space-y-12 flex-shrink-0'>
      {/* Category */}
      <div className='space-y-6'>
        <h3 className='font-serif text-xl text-on-surface tracking-tight'>Category</h3>
        <div className='flex flex-col gap-3'>
          <Link
            href='/shop'
            className={`text-sm transition-colors ${!activeCategory ? 'text-primary font-medium underline underline-offset-4' : 'text-neutral-400 hover:text-primary'}`}
          >
            All Collections
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.documentId}
              href={`/shop/${cat.slug}`}
              className={`text-sm transition-colors ${activeCategory === cat.slug ? 'text-primary font-medium underline underline-offset-4' : 'text-neutral-400 hover:text-primary'}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Badge / Collection type */}
      <div className='space-y-6'>
        <h3 className='font-serif text-xl text-on-surface tracking-tight'>Collection</h3>
        <div className='flex flex-wrap gap-2'>
          {badges.map(({ value, label }) => {
            const active = activeBadge === value
            return (
              <button
                key={value}
                onClick={() => toggleBadge(value)}
                className={`px-4 py-2 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                  active
                    ? 'bg-primary/10 text-primary border-primary/20'
                    : 'bg-surface-container text-neutral-400 border-transparent hover:border-neutral-600'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
