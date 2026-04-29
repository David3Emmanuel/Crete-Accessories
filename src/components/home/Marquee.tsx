import { Fragment } from 'react'

const items = [
  'FREE NATIONWIDE DELIVERY',
  'RINGS',
  'NECKLACES',
  'EARRINGS',
  'BRACELETS',
  'BOOKS',
  'CAPS',
  'SHOP NOW',
]

function MarqueeItems() {
  return (
    <>
      {items.map((item, i) => (
        <Fragment key={i}>
          <span>{item}</span>
          <span className='text-on-primary/60 text-xs'>◆</span>
        </Fragment>
      ))}
    </>
  )
}

export default function Marquee() {
  return (
    <div className='bg-primary py-4 overflow-hidden border-y border-primary-container'>
      <div
        className='inline-flex items-center gap-10 text-on-primary font-black text-sm md:text-base tracking-[0.15em] whitespace-nowrap'
        style={{ animation: 'marquee 30s linear infinite' }}
      >
        <MarqueeItems />
        <MarqueeItems />
      </div>
    </div>
  )
}
