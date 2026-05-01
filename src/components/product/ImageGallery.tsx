'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { StrapiMedia } from '@/lib/strapi/types'
import { getStrapiMediaUrl } from '@/lib/strapi/media'

interface ImageGalleryProps {
  images: StrapiMedia[]
  productName: string
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = images[activeIndex]
  const imageUrl = active ? getStrapiMediaUrl(active.url) : null

  return (
    <div className='relative group'>
      <div className='relative aspect-[4/5] bg-[#0e0e0e] rounded-xl overflow-hidden'>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={active?.alternativeText ?? productName}
            fill
            className='object-cover transition-transform duration-700 group-hover:scale-105'
            sizes='(max-width: 1024px) 100vw, 50vw'
            priority
          />
        ) : (
          <div className='w-full h-full bg-surface-container' />
        )}
      </div>

      {images.length > 1 && (
        <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3'>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`View image ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === activeIndex ? 'bg-primary' : 'bg-surface-high hover:bg-neutral-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
