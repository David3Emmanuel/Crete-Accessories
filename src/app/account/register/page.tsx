'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, User, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/lib/store/auth'
import { sendGAEvent } from '@next/third-parties/google'

export default function RegisterPage() {
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
    const username = formData.get('username') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      setAuth(data.user, data.jwt)
      sendGAEvent({
        event: 'sign_up',
        method: 'email_password',
      })
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
            Join the Collection
          </h1>
          <p className='text-neutral-500 tracking-widest text-xs uppercase'>
            Create your account to track orders and save your favorites
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
              <User className='absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500' size={18} />
              <input
                name='username'
                type='text'
                placeholder='Full Name'
                required
                className='w-full bg-[#1e1e1e] border border-white/5 rounded-lg pl-12 pr-4 py-4 text-on-surface focus:outline-none focus:border-primary/50 transition-colors placeholder:text-neutral-600'
              />
            </div>

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
                placeholder='Create Password'
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
            {loading ? 'Creating Account...' : 'Register'}
            {!loading && <ArrowRight size={18} className='group-hover:translate-x-1 transition-transform' />}
          </button>
        </form>

        <div className='text-center space-y-4 pt-4 border-t border-white/5'>
          <p className='text-neutral-500 text-sm'>
            Already have an account?{' '}
            <Link href='/account/login' className='text-primary hover:underline'>
              Sign in here
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
