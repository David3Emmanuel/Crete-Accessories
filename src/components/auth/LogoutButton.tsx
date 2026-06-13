'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { useAuthStore } from '@/lib/store/auth'

export default function LogoutButton() {
  const router = useRouter()
  const logout = useAuthStore((s) => s.logout)
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      logout()
      router.push('/account/login')
      router.refresh()
    } catch (err) {
      console.error('Logout failed', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className='flex items-center gap-2 text-neutral-500 hover:text-red-500 transition-colors text-xs uppercase tracking-widest font-medium'
    >
      <LogOut size={14} />
      {loading ? 'Signing out...' : 'Sign Out'}
    </button>
  )
}
