'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`?${params.toString()}`)
  }

  return (
    <div className='flex items-center justify-center gap-4 py-12'>
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label='Previous page'
        className='w-12 h-12 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:pointer-events-none'
      >
        <ChevronLeft size={18} />
      </button>

      <span className='text-on-surface font-medium tabular-nums'>
        {String(currentPage).padStart(2, '0')}
      </span>
      <span className='text-neutral-500'>/</span>
      <span className='text-neutral-500 tabular-nums'>
        {String(totalPages).padStart(2, '0')}
      </span>

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label='Next page'
        className='w-12 h-12 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-400 hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:pointer-events-none'
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
