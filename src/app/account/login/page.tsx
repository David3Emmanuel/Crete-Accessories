'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/lib/store/auth'

export default function LoginPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials')
      }

      setAuth(data.user, data.jwt)
      router.push('/account/orders')
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className='min-h-[80vh] flex items-center justify-center px-4 py-20'>
      <div className='w-full max-w-md space-y-12'>
        <div className='text-center space-y-4'>
          <h1 className='font-serif text-5xl font-light tracking-tighter text-on-surface'>
            Welcome Back
          </h1>
          <p className='text-neutral-500 tracking-widest text-xs uppercase'>
            Enter your credentials to access your collection
          </p>
        </div>

        {error && (
          <div className='bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-lg text-sm text-center'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-4'>
            <div className='relative'>
              <Mail className='absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500' size={18} />
              <input
                name='email'
                type='email'
                placeholder='Email Address'
                required
                className='w-full bg-[#1e1e1e] border border-white/5 rounded-lg pl-12 pr-4 py-4 text-on-surface focus:outline-none focus:border-primary/50 transition-colors placeholder:text-neutral-600'
              />
            </div>

            <div className='relative'>
              <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500' size={18} />
              <input
                name='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Password'
                required
                className='w-full bg-[#1e1e1e] border border-white/5 rounded-lg pl-12 pr-12 py-4 text-on-surface focus:outline-none focus:border-primary/50 transition-colors placeholder:text-neutral-600'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-on-surface transition-colors'
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full bg-primary hover:bg-primary-container text-on-primary font-medium py-4 rounded-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            {!loading && <ArrowRight size={18} className='group-hover:translate-x-1 transition-transform' />}
          </button>
        </form>

        <div className='text-center space-y-4 pt-4 border-t border-white/5'>
          <p className='text-neutral-500 text-sm'>
            New to Crete?{' '}
            <Link href='/account/register' className='text-primary hover:underline'>
              Create an account
            </Link>
          </p>
          <Link href='/shop' className='inline-block text-neutral-500 text-xs uppercase tracking-widest hover:text-on-surface transition-colors'>
            Back to Shop
          </Link>
        </div>
      </div>
    </main>
  )
}
