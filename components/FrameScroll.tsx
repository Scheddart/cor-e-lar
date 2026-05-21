'use client'

import { useEffect, useRef, useState } from 'react'

const FRAMES_COUNT = 104
const SECTION_HEIGHT_DESKTOP = '500vh'
const SECTION_HEIGHT_MOBILE = '350vh' // mais curto pra não cansar o swipe no celular

// Frases alternando lado conforme o scroll
const PHRASES = [
  {
    range: [0.05, 0.20] as [number, number],
    side: 'left' as const,
    line1: 'Cada parede',
    line2: 'conta uma história.',
    sub: null,
  },
  {
    range: [0.24, 0.40] as [number, number],
    side: 'right' as const,
    line1: 'A cor certa',
    line2: 'transforma tudo.',
    sub: 'Linha completa Tintas Maza',
  },
  {
    range: [0.44, 0.58] as [number, number],
    side: 'left' as const,
    line1: 'Qualidade que',
    line2: 'você pode sentir.',
    sub: 'Primeira Loja Conceito Maza do Brasil',
  },
  {
    range: [0.62, 0.76] as [number, number],
    side: 'right' as const,
    line1: 'Do clássico',
    line2: 'ao ousado.',
    sub: 'Encontre sua paleta perfeita',
  },
  {
    range: [0.81, 0.95] as [number, number],
    side: 'left' as const,
    line1: 'Seu espaço.',
    line2: 'Sua identidade.',
    sub: 'Cor & Lar Tintas — Leme, SP',
  },
]

export default function FrameScroll() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const currentFrameRef = useRef(0)
  const targetFrameRef = useRef(0)
  const effectiveCountRef = useRef(FRAMES_COUNT)
  const progressRef = useRef(0)
  const rafRef = useRef<number>()
  const [loadedCount, setLoadedCount] = useState(0)
  const [activePhrase, setActivePhrase] = useState<number | null>(null)
  const [displayFrame, setDisplayFrame] = useState(1)
  const [isMobile, setIsMobile] = useState(false)

  // Detecta mobile
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const totalLoaded = loadedCount === effectiveCountRef.current
  const canShow = loadedCount >= 1

  // Init Canvas 2D + RAF loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const isMobileDevice = window.matchMedia('(max-width: 767px)').matches
    // Mobile DPR=1 (halves GPU pixels). Desktop capped to frame resolution (1920px)
    const dpr = isMobileDevice
      ? 1
      : Math.max(1, Math.min(window.devicePixelRatio, 1920 / Math.max(window.innerWidth, 1)))

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return
    ctxRef.current = ctx

    const drawFrame = (img: HTMLImageElement) => {
      const c = canvasRef.current
      const context = ctxRef.current
      if (!c || !context || !img.naturalWidth) return

      const cw = c.width
      const ch = c.height
      const iw = img.naturalWidth
      const ih = img.naturalHeight

      // Branco fora dos limites da imagem (matches frame background)
      context.fillStyle = '#FFFFFF'
      context.fillRect(0, 0, cw, ch)

      const canvasAspect = cw / ch
      const imageAspect = iw / ih

      // Mobile: 0→0.06 contained (logo visível), 0.06→0.18 transição, 0.18→1 cover
      // Desktop: sempre cover
      const isMobileNow = window.matchMedia('(max-width: 767px)').matches
      let containedAmount = 0
      let extraScale = 1
      if (isMobileNow) {
        const smoothstep = (a: number, b: number, x: number) => {
          const t = Math.min(Math.max((x - a) / (b - a), 0), 1)
          return t * t * (3 - 2 * t)
        }
        containedAmount = 1 - smoothstep(0.06, 0.18, progressRef.current)
        extraScale = 1.0 - containedAmount * 0.04 // 1.0 → 0.96
      }

      // Cover scale (preenche)
      const coverScale = canvasAspect > imageAspect ? cw / iw : ch / ih
      // Contain scale (cabe inteiro) com margem extraScale
      const containScale = (canvasAspect > imageAspect ? ch / ih : cw / iw) * extraScale

      // Interpola entre cover e contain
      const scale = containedAmount * containScale + (1 - containedAmount) * coverScale
      const drawW = iw * scale
      const drawH = ih * scale
      const drawX = (cw - drawW) / 2
      const drawY = (ch - drawH) / 2

      context.drawImage(img, drawX, drawY, drawW, drawH)
    }

    const drawCurrentFrame = () => {
      const img = imagesRef.current[currentFrameRef.current]
      if (img) drawFrame(img)
    }
    // Expose for first-frame draw from the load callback
    ;(canvas as any).__drawCurrent = drawCurrentFrame

    const onResize = () => {
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      drawCurrentFrame()
    }
    onResize()
    window.addEventListener('resize', onResize)

    const loop = () => {
      const current = currentFrameRef.current
      const target = targetFrameRef.current
      let dirty = false

      if (current !== target) {
        const next = current + (target - current) * 0.14
        const rounded = Math.round(next)
        const frame = rounded !== current ? rounded : target
        if (frame !== currentFrameRef.current) {
          currentFrameRef.current = frame
          dirty = true
        }
      }

      if (dirty) {
        drawCurrentFrame()
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('resize', onResize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Load images — mobile loads every 4th frame (26 ≈ 2MB), desktop every 2nd (52 ≈ 4MB)
  useEffect(() => {
    let count = 0
    const isMobileDevice = window.matchMedia('(max-width: 767px)').matches
    const step = isMobileDevice ? 4 : 2
    const effectiveCount = Math.ceil(FRAMES_COUNT / step)
    effectiveCountRef.current = effectiveCount

    const loadOne = (idx: number) =>
      new Promise<void>((resolve) => {
        const img = new Image()
        const num = String(idx * step + 1).padStart(3, '0')
        img.decoding = 'async'
        img.onload = () => {
          imagesRef.current[idx] = img
          count++
          setLoadedCount(count)

          // Trigger initial draw as soon as the first frame is available
          if (idx === 0) {
            const canvas = canvasRef.current as any
            if (canvas && canvas.__drawCurrent) canvas.__drawCurrent()
          }
          resolve()
        }
        img.onerror = () => resolve()
        img.src = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/frames/ezgif-frame-${num}.jpg`
      })

    // Load frame 1 alone first → fastest time-to-visible (pairs with <link rel="preload">)
    loadOne(0).then(() => {
      for (let i = 1; i < effectiveCount; i++) {
        loadOne(i)
      }
    })
  }, [])

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current
      if (!section) return

      const rect = section.getBoundingClientRect()
      const sectionHeight = section.offsetHeight
      const viewportH = window.innerHeight

      const scrolled = -rect.top
      const scrollable = sectionHeight - viewportH

      if (scrolled < -viewportH || scrolled > scrollable + viewportH) return

      const progress = Math.min(Math.max(scrolled / scrollable, 0), 1)
      progressRef.current = progress

      const isMobileNow = window.matchMedia('(max-width: 767px)').matches
      const step = isMobileNow ? 4 : 2
      const effectiveCount = effectiveCountRef.current
      const newTarget = Math.round(progress * (effectiveCount - 1))
      targetFrameRef.current = newTarget
      setDisplayFrame(newTarget * step + 1)

      let active: number | null = null
      PHRASES.forEach((p, i) => {
        if (progress >= p.range[0] && progress <= p.range[1]) active = i
      })
      setActivePhrase(active)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const loadPct = Math.round((loadedCount / effectiveCountRef.current) * 100)

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: isMobile ? SECTION_HEIGHT_MOBILE : SECTION_HEIGHT_DESKTOP }}
      id="experiencia"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ background: '#F4F4F2' }}
        />

        {/* Frases — alternam lado no desktop, centralizadas embaixo no mobile */}
        {PHRASES.map((p, i) => {
          const isActive = activePhrase === i
          const desktopSide = p.side === 'left' ? 'md:left-12 xl:left-20 md:text-left' : 'md:right-12 xl:right-20 md:text-right'
          const baseY = isMobile ? 0 : -50
          const offsetY = isActive ? 0 : 24
          return (
            <div
              key={i}
              className={`absolute z-10 pointer-events-none select-none px-4 text-center left-4 right-4 max-w-md mx-auto bottom-[12%] md:bottom-auto md:top-1/2 md:left-auto md:right-auto md:mx-0 md:max-w-md ${desktopSide}`}
              style={{
                opacity: isActive ? 1 : 0,
                transform: isMobile
                  ? `translateY(${offsetY}px)`
                  : `translateY(calc(${baseY}% + ${offsetY}px))`,
                transition: 'opacity 0.6s ease, transform 0.6s ease',
              }}
            >
              <p
                className="font-display leading-[1.05]"
                style={{
                  fontSize: 'clamp(1.4rem, 3.4vw, 2.8rem)',
                  color: '#0E1B3C',
                  textShadow: '0 2px 12px rgba(244,244,242,0.6)',
                }}
              >
                {p.line1}
                <br />
                <span
                  style={{
                    background: 'linear-gradient(135deg, #D62828 0%, #F28C28 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {p.line2}
                </span>
              </p>
              {p.sub && (
                <p
                  className="text-[10px] md:text-xs tracking-[0.25em] md:tracking-[0.3em] uppercase mt-2 md:mt-3"
                  style={{ color: 'rgba(14,27,60,0.55)' }}
                >
                  {p.sub}
                </p>
              )}
            </div>
          )
        })}

        {/* Frame counter (sutil) */}
        <div
          className="absolute bottom-6 right-6 z-10 text-xs tracking-widest font-mono select-none pointer-events-none"
          style={{ color: 'rgba(14,27,60,0.18)' }}
        >
          {String(displayFrame).padStart(3, '0')} / {String(FRAMES_COUNT).padStart(3, '0')}
        </div>

        {/* Splash inicial — fica em cima e some quando o primeiro frame chega */}
        <div
          className="absolute inset-0 flex items-center justify-center z-20 bg-[#F4F4F2]"
          style={{
            opacity: canShow ? 0 : 1,
            transition: 'opacity 0.25s ease',
            pointerEvents: canShow ? 'none' : 'auto',
          }}
        >
          <div className="w-8 h-8 border-2 border-[#0E1B3C]/15 border-t-[#F28C28] rounded-full animate-spin" />
        </div>

        {/* Indicador discreto enquanto carrega o resto em background */}
        {canShow && !totalLoaded && (
          <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2 pointer-events-none select-none">
            <div className="w-3 h-3 border border-[#0E1B3C]/20 border-t-[#F28C28] rounded-full animate-spin" />
            <span className="text-[10px] font-mono tracking-widest" style={{ color: 'rgba(14,27,60,0.4)' }}>
              {loadPct}%
            </span>
          </div>
        )}
      </div>
    </section>
  )
}
