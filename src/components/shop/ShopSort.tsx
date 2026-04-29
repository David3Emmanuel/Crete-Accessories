'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const sortOptions = [
  { value: 'latest', label: 'Latest Release' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
]

interface ShopSortProps {
  activeCategory?: string
}

export default function ShopSort({ activeCategory }: ShopSortProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeSort = searchParams.get('sort') ?? 'latest'

  function handleSort(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    params.delete('page')
    const base = activeCategory ? `/shop/${activeCategory}` : '/shop'
    router.push(`${base}?${params.toString()}`)
  }

  return (
    <div className='flex items-center gap-3'>
      <span className='text-xs text-neutral-500 uppercase tracking-widest'>Sort by:</span>
      <select
        value={activeSort}
        onChange={(e) => handleSort(e.target.value)}
        className='bg-transparent border-none text-on-surface text-sm font-medium focus:ring-0 cursor-pointer outline-none'
      >
        {sortOptions.map(({ value, label }) => (
          <option key={value} value={value} className='bg-surface-container text-on-surface'>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}
