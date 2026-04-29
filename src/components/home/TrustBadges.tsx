import { Truck, ShieldCheck, Award, RefreshCw } from 'lucide-react'

const badges = [
  {
    Icon: Truck,
    title: 'Nationwide Delivery',
    body: 'Swift and secure shipping across the entire country.',
  },
  {
    Icon: ShieldCheck,
    title: 'Secure Payment',
    body: 'Encrypted transactions via world-class gateways.',
  },
  {
    Icon: Award,
    title: 'Authentic Products',
    body: '100% genuine designer items guaranteed.',
  },
  {
    Icon: RefreshCw,
    title: 'Easy Returns',
    body: 'Hassle-free return policy within 14 days.',
  },
]

export default function TrustBadges() {
  return (
    <section className='py-24 px-8 bg-[#1c1b1b]'>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto text-center'>
        {badges.map(({ Icon, title, body }) => (
          <div key={title} className='flex flex-col items-center'>
            <Icon className='text-primary mb-6' size={36} strokeWidth={1.5} />
            <h4 className='font-serif text-lg font-bold text-neutral-100 mb-2'>{title}</h4>
            <p className='text-neutral-400 text-sm'>{body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
