'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Heart, ShoppingBag, User } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { useAuthStore } from '@/lib/store/auth'

interface HeaderProps {
  categories?: { name: string; slug: string }[]
}

const fallbackCategories = [
  { name: 'Jewelry', slug: 'jewelry' },
  { name: 'Books', slug: 'books' },
  { name: 'Caps', slug: 'caps' },
]

export default function Header({ categories = [] }: HeaderProps) {
  const pathname = usePathname()
  const cartCount = useCartStore((s) => s.totalItems())
  const openDrawer = useCartStore((s) => s.openDrawer)
  const user = useAuthStore((s) => s.user)

  const displayCategories = categories.length > 0 ? categories : fallbackCategories

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    ...displayCategories.map((cat) => ({
      label: cat.name,
      href: `/shop/${cat.slug}`,
    })),
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]


  return (
    <header className='sticky top-0 z-50 w-full flex items-center justify-between px-8 py-4 bg-neutral-950/80 backdrop-blur-xl shadow-2xl'>
      <div className='flex items-center gap-8'>
        <Link
          href='/'
          className='text-2xl font-black text-on-surface tracking-tighter font-serif'
        >
          Crete
        </Link>

        <nav className='hidden md:flex gap-6'>
          {navLinks.map(({ label, href }) => {
            const isActive =
              href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={
                  isActive
                    ? 'text-primary font-semibold border-b-2 border-primary pb-1 font-serif tracking-tight'
                    : 'text-neutral-400 hover:text-on-surface transition-colors font-serif tracking-tight'
                }
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className='flex items-center gap-4'>
        <button
          aria-label='Search'
          className='text-neutral-400 hover:text-primary transition-colors'
        >
          <Search size={20} />
        </button>

        <Link
          href={user ? '/account/orders' : '/account/login'}
          aria-label='Account'
          className='text-neutral-400 hover:text-primary transition-colors'
        >
          <User size={20} />
        </Link>

        <button
          aria-label='Wishlist'
          className='text-neutral-400 hover:text-primary transition-colors'
        >
          <Heart size={20} />
        </button>

        <button
          onClick={openDrawer}
          aria-label={`Cart (${cartCount} items)`}
          className='text-neutral-400 hover:text-primary transition-colors relative'
        >
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span className='absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full'>
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
