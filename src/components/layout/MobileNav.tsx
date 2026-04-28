'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Store, ShoppingCart, User, type LucideIcon } from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  isCart?: boolean
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Shop', href: '/shop', icon: Store },
  { label: 'Cart', href: '/cart', icon: ShoppingCart, isCart: true },
  { label: 'Profile', href: '/account/login', icon: User },
]

interface MobileNavProps {
  cartCount?: number
}

export default function MobileNav({ cartCount = 0 }: MobileNavProps) {
  const pathname = usePathname()

  return (
    <nav className='fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 md:hidden bg-neutral-900/90 backdrop-blur-lg rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)]'>
      {navItems.map(({ label, href, icon: Icon, isCart }) => {
        const isActive =
          href === '/' ? pathname === '/' : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className={`flex flex-col items-center justify-center p-3 rounded-full transition-colors relative ${
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-neutral-500 hover:text-primary'
            }`}
          >
            <Icon size={22} />
            <span className='text-[10px] uppercase tracking-widest font-medium mt-1'>
              {label}
            </span>
            {isCart && cartCount > 0 && (
              <span className='absolute top-1 right-1 bg-primary text-on-primary text-[9px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full'>
                {cartCount}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
