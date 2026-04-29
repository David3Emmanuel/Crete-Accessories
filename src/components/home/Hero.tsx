import Link from 'next/link'

export default function Hero() {
  return (
    <section className='relative h-[75vh] w-full flex items-center justify-center overflow-hidden'>
      <div className='absolute inset-0 z-0'>
        <img
          alt='Luxury Accessories Backdrop'
          className='w-full h-full object-cover opacity-60 grayscale-[0.3]'
          data-alt='close-up of luxury gold rings and watches on dark velvet fabric with dramatic spotlighting and warm golden highlights'
          src='https://lh3.googleusercontent.com/aida-public/AB6AXuBm49hpx-Wv6nLzVcpJNPbgHULSzBO-fgX0iuKjT4uh82q-GleQeTz3zWnNYvMoZJoUJmcNPOLqVJe66caylUky-gff3R9ocl9sT9vvwG9yusB-X6qNElGDkselgDzvtiavBdGOX44L1fGgQOtkHnB0yKgFnzBCtPabtszgaDeDT87fJi_cwTC8WOh-axAIMQFd1LxlxT9blrQhwLmoJSWW-OMOGZpTWkNqURT_7CAyI1mOx35D00sbzVJY-ujz_b1E_VzV-4cgOYJY'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-surface via-transparent to-surface/40'></div>
      </div>
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
