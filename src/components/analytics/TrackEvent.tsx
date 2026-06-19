'use client'

import { useEffect, useRef } from 'react'
import { sendGAEvent } from '@next/third-parties/google'

interface TrackEventProps {
  event: string
  payload: Record<string, any>
}

export default function TrackEvent({ event, payload }: TrackEventProps) {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (!hasTracked.current) {
      hasTracked.current = true
      sendGAEvent({
        event,
        ...payload,
      })
    }
  }, [event, payload])

  return null
}
