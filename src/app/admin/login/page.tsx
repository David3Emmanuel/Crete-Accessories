'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth'
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const { setAuth, logout } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Invalid email or password')
      }

      // Check if user is an admin
      if (data.user?.role !== 'admin') {
        // Clear cookies and session if not admin
        await fetch('/api/auth/logout', { method: 'POST' })
        logout()
        throw new Error('Access Denied: Administrator account required.')
      }

      // Save auth state
      setAuth(data.user, data.jwt)
      
      // Redirect to dashboard
      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-dim px-4 font-sans select-none">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(230,195,100,0.08),rgba(255,255,255,0))]" />
      
      <div className="w-full max-w-md bg-surface-base border border-surface-container/60 rounded-2xl shadow-2xl p-8 relative overflow-hidden backdrop-blur-md">
        {/* Subtle decorative gold line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
        
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-primary tracking-wide mb-2">Crete Accessories</h1>
          <p className="text-on-surface/60 text-sm">Store Administration</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-500/30 rounded-xl text-red-300 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-on-surface/80 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface/40 w-5 h-5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@creteaccessories.com"
                className="w-full pl-11 pr-4 py-3 bg-surface-dim/80 border border-surface-container rounded-xl text-on-surface placeholder:text-on-surface/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface/80 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface/40 w-5 h-5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-surface-dim/80 border border-surface-container rounded-xl text-on-surface placeholder:text-on-surface/30 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-container text-on-primary font-medium py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-primary/10 hover:shadow-primary/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <>
                <span>Enter Admin Panel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
