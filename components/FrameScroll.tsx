'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

const FRAMES_COUNT = 102
const SECTION_HEIGHT = '500vh' // scroll mais rápido que antes

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

// Ponto onde o background muda de branco → azul marinho profundo
const BG_TRANSITION_START = 0.72
const BG_TRANSITION_END = 0.85

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform sampler2D tFrame;
  uniform float uAspect;
  uniform float uImageAspect;
  uniform vec3 uBgColor;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float ratio = uAspect / uImageAspect;

    if (ratio > 1.0) {
      uv.y = (uv.y - 0.5) / ratio + 0.5;
    } else {
      uv.x = (uv.x - 0.5) * ratio + 0.5;
    }

    vec4 frameColor = texture2D(tFrame, uv);

    // Detecta branco/cinza claro (fundo dos frames) e troca pela cor de fundo dinâmica
    float whiteness = min(frameColor.r, min(frameColor.g, frameColor.b));
    float bgMask = smoothstep(0.78, 0.95, whiteness);

    vec3 finalColor = mix(frameColor.rgb, uBgColor, bgMask);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

export default function FrameScroll() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const texturesRef = useRef<THREE.Texture[]>([])
  const currentFrameRef = useRef(0)
  const targetFrameRef = useRef(0)
  const targetBgRef = useRef(new THREE.Color(0xf4f4f2))
  const currentBgRef = useRef(new THREE.Color(0xf4f4f2))
  const rafRef = useRef<number>()
  const [loadedCount, setLoadedCount] = useState(0)
  const [activePhrase, setActivePhrase] = useState<number | null>(null)
  const [displayFrame, setDisplayFrame] = useState(1)

  const totalLoaded = loadedCount === FRAMES_COUNT

  // Init Three.js
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(window.innerWidth, window.innerHeight)
    rendererRef.current = renderer

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        tFrame: { value: null },
        uAspect: { value: window.innerWidth / window.innerHeight },
        uImageAspect: { value: 16 / 9 },
        uBgColor: { value: new THREE.Color(0xf4f4f2) },
      },
    })
    materialRef.current = material

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      material.uniforms.uAspect.value = window.innerWidth / window.innerHeight
    }
    window.addEventListener('resize', onResize)

    const loop = () => {
      const current = currentFrameRef.current
      const target = targetFrameRef.current

      if (current !== target) {
        const next = current + (target - current) * 0.14
        const rounded = Math.round(next)
        const frame = rounded !== current ? rounded : target
        currentFrameRef.current = frame
      }

      const tex = texturesRef.current[currentFrameRef.current]
      if (tex && material.uniforms.tFrame.value !== tex) {
        material.uniforms.tFrame.value = tex
      }

      // Smooth bg color transition
      currentBgRef.current.lerp(targetBgRef.current, 0.08)
      material.uniforms.uBgColor.value.copy(currentBgRef.current)

      renderer.render(scene, camera)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('resize', onResize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      renderer.dispose()
    }
  }, [])

  // Load textures
  useEffect(() => {
    const loader = new THREE.TextureLoader()
    let count = 0

    for (let i = 0; i < FRAMES_COUNT; i++) {
      const num = String(i + 1).padStart(3, '0')
      loader.load(`/frames/ezgif-frame-${num}.png`, (texture) => {
        texture.generateMipmaps = false
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texturesRef.current[i] = texture
        count++
        setLoadedCount(count)

        if (i === 0 && materialRef.current) {
          materialRef.current.uniforms.tFrame.value = texture
          materialRef.current.uniforms.uImageAspect.value =
            texture.image.width / texture.image.height
        }
      })
    }
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

      const newTarget = Math.round(progress * (FRAMES_COUNT - 1))
      targetFrameRef.current = newTarget
      setDisplayFrame(newTarget + 1)

      // Background transition
      const bgT =
        progress < BG_TRANSITION_START
          ? 0
          : progress > BG_TRANSITION_END
          ? 1
          : (progress - BG_TRANSITION_START) / (BG_TRANSITION_END - BG_TRANSITION_START)

      const white = new THREE.Color(0xf4f4f2)
      const navy = new THREE.Color(0x0e1b3c)
      targetBgRef.current = white.clone().lerp(navy, bgT)

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

  const loadPct = Math.round((loadedCount / FRAMES_COUNT) * 100)

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: SECTION_HEIGHT }}
      id="experiencia"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-[#F4F4F2]">
        {/* Canvas — tela cheia limpa, sem overlay */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: totalLoaded ? 1 : 0,
            transition: 'opacity 0.8s ease',
          }}
        />

        {/* Frases — alternam lado conforme o scroll */}
        {PHRASES.map((p, i) => {
          const isActive = activePhrase === i
          const sideClass = p.side === 'left' ? 'left-12 xl:left-20 text-left' : 'right-12 xl:right-20 text-right'
          return (
            <div
              key={i}
              className={`absolute ${sideClass} z-10 max-w-md pointer-events-none select-none`}
              style={{
                top: '50%',
                opacity: isActive ? 1 : 0,
                transform: `translateY(calc(-50% + ${isActive ? 0 : 24}px))`,
                transition: 'opacity 0.6s ease, transform 0.6s ease',
              }}
            >
              <p
                className="font-display leading-[1.05]"
                style={{
                  fontSize: 'clamp(1.6rem, 2.6vw, 2.8rem)',
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
                  className="text-xs tracking-[0.3em] uppercase mt-3"
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

        {/* Loading */}
        {!totalLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#F4F4F2]">
            <div className="mb-6">
              <svg viewBox="0 0 200 60" className="h-10 w-auto" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="100" cy="30" rx="96" ry="26" fill="#F4F4F2" stroke="#0E1B3C" strokeWidth="1.5" />
                <path d="M 15 22 Q 55 18, 100 22 T 185 22" stroke="#D62828" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <text x="100" y="35" textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="20" fontWeight="700" fill="#0E1B3C" letterSpacing="1.5">COR &amp; LAR</text>
                <path d="M 15 40 Q 55 44, 100 40 T 185 40" stroke="#1F4FBF" strokeWidth="2" strokeLinecap="round" fill="none" />
                <text x="100" y="52" textAnchor="middle" fontFamily="'Bebas Neue', sans-serif" fontSize="8" fill="#0E1B3C" letterSpacing="4">TINTAS</text>
              </svg>
            </div>
            <div className="w-48 h-0.5 bg-[#0E1B3C]/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F28C28] rounded-full transition-all duration-300"
                style={{ width: `${loadPct}%` }}
              />
            </div>
            <p className="text-[#0E1B3C]/40 text-xs mt-3 tracking-widest">{loadPct}%</p>
          </div>
        )}
      </div>
    </section>
  )
}
