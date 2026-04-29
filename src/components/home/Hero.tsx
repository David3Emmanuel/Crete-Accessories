import Link from 'next/link'

export default function Hero() {
  return (
    <section className='relative h-[921px] w-full flex items-center justify-center overflow-hidden'>
      <div className='absolute inset-0 z-0 bg-gradient-to-b from-[#0a0a0a] via-surface-base to-surface-dim' />
      <div className='absolute inset-0 bg-gradient-to-t from-surface-dim via-transparent to-surface-dim/40' />
      <div className='relative z-10 text-center px-4 max-w-4xl'>
        <h1 className='font-serif text-5xl md:text-7xl font-black text-on-surface tracking-tighter mb-8 leading-tight'>
          Your Signature <br />
          <span className='text-primary italic'>Look Starts Here</span>
        </h1>
        <div className='flex flex-col md:flex-row gap-6 justify-center items-center'>
          <Link
            href='/shop'
            className='px-12 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-full text-lg shadow-xl hover:scale-105 transition-transform duration-300'
          >
            Shop Now
          </Link>
          <Link
            href='/shop'
            className='px-12 py-4 border border-primary text-primary font-bold rounded-full text-lg hover:bg-primary/10 transition-colors duration-300'
          >
            Explore Collection
          </Link>
        </div>
      </div>
    </section>
  )
}
