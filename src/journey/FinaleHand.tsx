import { useEffect, useRef, useState } from 'react'
import hand from '../assets/finale/hand-gold-navy-card.png'

export function FinaleHand({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (reducedMotion || !ref.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
    }, { threshold: .15 })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [reducedMotion])
  return <div ref={ref} className="eh-finale-hand-art" data-visible={reducedMotion || visible} aria-hidden="true">
    <img src={hand} alt="" width={1024} height={1536} decoding="async" loading="lazy" />
  </div>
}
