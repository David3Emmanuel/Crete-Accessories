'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth'
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingBag, 
  LogOut, 
  Menu, 
  X,
  Crown,
  Sparkles
} from 'lucide-react'

interface AdminSidebarProps {
  user: {
    username: string
    email: string
  }
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Layers },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  ]

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      logout()
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const toggleSidebar = () => setIsOpen(!isOpen)

  return (
    <>
      {/* Mobile Header Menu Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-3 left-4 z-40 p-2 bg-surface-container rounded-lg border border-surface-high text-on-surface"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-surface-base border-r border-surface-container/60 flex flex-col justify-between transform transition-transform duration-300 md:translate-x-0 md:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-8 py-6 px-4">
          {/* Logo / Brand Header */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-lg text-primary tracking-wider leading-none">Crete Admin</h1>
              <span className="text-[10px] text-on-surface/40 uppercase tracking-widest">Management v1</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  data-tour={`sidebar-${item.name.toLowerCase()}`}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-lg shadow-primary/10'
                      : 'text-on-surface/60 hover:text-on-surface hover:bg-surface-container/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Footer Profile & Logout */}
        <div className="p-4 border-t border-surface-container/60 flex flex-col gap-4">
          <button
            onClick={() => window.dispatchEvent(new Event('start-admin-tour'))}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/40 transition-all font-sans cursor-pointer justify-center"
          >
            <Sparkles className="w-4 h-4" />
            <span>Take a Guided Tour</span>
          </button>

          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary border border-surface-high">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate text-on-surface">{user.username}</p>
              <p className="text-[11px] text-on-surface/40 truncate">{user.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-all border border-transparent hover:border-red-900/30"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
