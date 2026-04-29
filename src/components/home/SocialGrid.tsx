const placeholders = Array.from({ length: 6 }, (_, i) => i)

export default function SocialGrid() {
  return (
    <section className='bg-surface-dim'>
      <div className='grid grid-cols-2 md:grid-cols-6'>
        {placeholders.map((i) => (
          <div
            key={i}
            className='aspect-square overflow-hidden group bg-surface-container cursor-pointer'
          >
            <div className='w-full h-full bg-surface-high/30 group-hover:bg-surface-high/60 transition-colors duration-700' />
          </div>
        ))}
      </div>
    </section>
  )
}
