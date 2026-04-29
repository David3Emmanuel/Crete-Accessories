import Link from 'next/link'
import { Globe, Camera, Mail, ArrowRight } from 'lucide-react'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Books', href: '/shop/books' },
  { label: 'Caps', href: '/shop/caps' },
]

const supportLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Shipping Policy', href: '/shipping-policy' },
  { label: 'Terms & Conditions', href: '/terms' },
]

export default function Footer() {
  return (
    <footer className='bg-neutral-950 border-t border-neutral-800 w-full py-16 px-8 font-serif text-sm'>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-12'>
        {/* Brand */}
        <div className='space-y-6'>
          <div className='text-3xl font-bold text-on-surface'>Crete</div>
          <p className='text-neutral-500 leading-relaxed max-w-xs'>
            Elevating your personal aesthetic with timeless accessories and
            curated essentials.
          </p>
          <div className='flex gap-4'>
            <a
              href='https://twitter.com'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Twitter / X'
              className='text-neutral-500 hover:text-primary transition-colors'
            >
              <Globe size={18} />
            </a>
            <a
              href='https://instagram.com'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Instagram'
              className='text-neutral-500 hover:text-primary transition-colors'
            >
              <Camera size={18} />
            </a>
            <a
              href='mailto:hello@creteaccessories.com'
              aria-label='Email'
              className='text-neutral-500 hover:text-primary transition-colors'
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h5 className='text-primary font-bold mb-6 uppercase tracking-widest text-xs'>
            Quick Links
          </h5>
          <ul className='space-y-4'>
            {quickLinks.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className='text-neutral-500 hover:text-primary underline underline-offset-4 transition-colors'
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h5 className='text-primary font-bold mb-6 uppercase tracking-widest text-xs'>
            Support
          </h5>
          <ul className='space-y-4'>
            {supportLinks.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className='text-neutral-500 hover:text-primary underline underline-offset-4 transition-colors'
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h5 className='text-primary font-bold mb-6 uppercase tracking-widest text-xs'>
            Newsletter
          </h5>
          <p className='text-neutral-500 mb-6'>
            Join our sovereign circle for exclusive drops.
          </p>
          <form className='flex border-b border-neutral-700 pb-2'>
            <input
              type='email'
              placeholder='Your Email'
              aria-label='Newsletter email'
              className='bg-transparent border-none focus:ring-0 text-on-surface w-full text-sm placeholder:text-neutral-600 outline-none'
            />
            <button
              type='submit'
              aria-label='Subscribe'
              className='text-primary hover:text-primary-container transition-colors'
            >
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className='mt-12 pt-8 border-t border-neutral-900 text-neutral-600 text-xs flex flex-col md:flex-row justify-between gap-4'>
        <p>
          © <Year /> Crete Accessories. All rights reserved.
        </p>
        <div className='flex gap-6'>
          <span>Crafted for Excellence</span>
          <span>Secure Checkout Guaranteed</span>
        </div>
      </div>
    </footer>
  )
}

async function Year() {
  'use cache'
  return <span>{new Date().getFullYear()}</span>
}
