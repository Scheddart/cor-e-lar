'use client'

import { useEffect } from 'react'

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Native scroll is faster on mobile — Lenis intercepts momentum scroll on iOS/Android
    if (window.matchMedia('(max-width: 767px)').matches) return

    let cancelled = false
    let cleanup: (() => void) | null = null

    // Lazy-load Lenis + GSAP after first paint (removes ~45KB from initial bundle)
    Promise.all([
      import('lenis'),
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]).then(([lenisMod, gsapMod, scrollTriggerMod]) => {
      if (cancelled) return
      const Lenis = lenisMod.default
      const { gsap } = gsapMod
      const { ScrollTrigger } = scrollTriggerMod

      gsap.registerPlugin(ScrollTrigger)
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })

      lenis.on('scroll', ScrollTrigger.update)
      const tickerCb = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(tickerCb)
      gsap.ticker.lagSmoothing(0)

      cleanup = () => {
        lenis.destroy()
        gsap.ticker.remove(tickerCb)
      }
    })

    return () => {
      cancelled = true
      if (cleanup) cleanup()
    }
  }, [])

  return <>{children}</>
}
