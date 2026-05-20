'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

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
  uniform vec2 uTexelSize;
  uniform float uFitFactor;    // 0 = cover (preenche), 1 = contain (cabe inteiro)
  uniform float uScale;        // < 1.0 deixa margem extra de branco
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float ratio = uAspect / uImageAspect;

    // Interpola continuamente entre COVER (uFitFactor=0) e CONTAIN (uFitFactor=1)
    float xMult, yMult;
    if (ratio > 1.0) {
      xMult = mix(1.0, ratio, uFitFactor);
      yMult = mix(1.0 / ratio, 1.0, uFitFactor);
    } else {
      xMult = mix(ratio, 1.0, uFitFactor);
      yMult = mix(1.0, 1.0 / ratio, uFitFactor);
    }
    uv.x = (vUv.x - 0.5) * xMult + 0.5;
    uv.y = (vUv.y - 0.5) * yMult + 0.5;

    // Escala adicional (menor = mais branco em volta)
    uv = (uv - 0.5) / uScale + 0.5;

    // Fora dos limites = fundo branco do design
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(0.957, 0.957, 0.949, 1.0);
      return;
    }

    // Unsharp mask 5-tap p/ nitidez
    vec4 center = texture2D(tFrame, uv);
    vec4 n = texture2D(tFrame, uv + vec2(0.0, uTexelSize.y));
    vec4 s = texture2D(tFrame, uv - vec2(0.0, uTexelSize.y));
    vec4 e = texture2D(tFrame, uv + vec2(uTexelSize.x, 0.0));
    vec4 w = texture2D(tFrame, uv - vec2(uTexelSize.x, 0.0));

    vec4 avg = (n + s + e + w) * 0.25;
    float amount = 0.35;
    vec4 sharp = center + (center - avg) * amount;

    gl_FragColor = vec4(clamp(sharp.rgb, 0.0, 1.0), 1.0);
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
  const rafRef = useRef<number>()
  const [loadedCount, setLoadedCount] = useState(0)
  const [activePhrase, setActivePhrase] = useState<number | null>(null)
  const [displayFrame, setDisplayFrame] = useState(1)
  const [isMobile, setIsMobile] = useState(false)

  // Detecta mobile (uniforms são atualizados no scroll handler)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const totalLoaded = loadedCount === FRAMES_COUNT
  const canShow = loadedCount >= 1 // libera a tela assim que o primeiro frame chega

  // Init Three.js
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })

    // DPR adaptativo: limita ao que faz sentido para frames 1920x1080
    // Se o viewport é 1440 e o frame é 1920, DPR 1 = downscale leve (ótimo)
    // Se o viewport é 1920+, DPR 1 = 1:1 (perfeito)
    // Evita upscale pesado que borra
    const optimalDPR = Math.min(window.devicePixelRatio, 1920 / Math.max(window.innerWidth, 1))
    renderer.setPixelRatio(Math.max(1, optimalDPR))
    renderer.setSize(window.innerWidth, window.innerHeight)
    rendererRef.current = renderer

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const geometry = new THREE.PlaneGeometry(2, 2)
    const isMobileNow = window.matchMedia('(max-width: 767px)').matches
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        tFrame: { value: null },
        uAspect: { value: window.innerWidth / window.innerHeight },
        uImageAspect: { value: 16 / 9 },
        uTexelSize: { value: new THREE.Vector2(1 / 1920, 1 / 1080) },
        // No mobile começa contained (frame 1); no desktop sempre cover
        uFitFactor: { value: isMobileNow ? 1.0 : 0.0 },
        uScale: { value: isMobileNow ? 0.85 : 1.0 },
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

    const maxAniso = rendererRef.current?.capabilities.getMaxAnisotropy() ?? 8

    for (let i = 0; i < FRAMES_COUNT; i++) {
      const num = String(i + 1).padStart(3, '0')
      loader.load(`/frames/ezgif-frame-${num}.png`, (texture) => {
        // Sem mipmaps — preserva nitidez. LinearFilter para magnification suave
        texture.generateMipmaps = false
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.anisotropy = maxAniso
        if ('colorSpace' in texture) {
          // @ts-ignore — Three.js r152+
          texture.colorSpace = THREE.SRGBColorSpace
        }
        texturesRef.current[i] = texture
        count++
        setLoadedCount(count)

        if (i === 0 && materialRef.current) {
          materialRef.current.uniforms.tFrame.value = texture
          materialRef.current.uniforms.uImageAspect.value =
            texture.image.width / texture.image.height
          // Atualiza texel size com dimensões reais do frame
          materialRef.current.uniforms.uTexelSize.value.set(
            1 / texture.image.width,
            1 / texture.image.height
          )
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

      // Mobile: interpola entre CONTAIN (começo/fim, com margem branca) e COVER (meio, preenche a tela)
      const mat = materialRef.current
      if (mat) {
        const isMobileNow = window.matchMedia('(max-width: 767px)').matches
        if (isMobileNow) {
          // Curvas suaves de transição
          // 0 → 0.08: contained max     (uFit=1, uScale=0.85)
          // 0.08 → 0.20: contain → cover
          // 0.20 → 0.80: cover puro     (uFit=0, uScale=1)
          // 0.80 → 0.92: cover → contain
          // 0.92 → 1: contained max
          const smoothstep = (a: number, b: number, x: number) => {
            const t = Math.min(Math.max((x - a) / (b - a), 0), 1)
            return t * t * (3 - 2 * t)
          }
          // contained = 1 nos extremos, 0 no meio
          const containedAmount =
            (1 - smoothstep(0.08, 0.20, progress)) + smoothstep(0.80, 0.92, progress)
          const clamped = Math.min(Math.max(containedAmount, 0), 1)
          mat.uniforms.uFitFactor.value = clamped
          mat.uniforms.uScale.value = 1.0 - clamped * 0.15 // 1.0 no meio, 0.85 nos extremos
        } else {
          // Desktop: sempre cover, escala 1.0
          mat.uniforms.uFitFactor.value = 0
          mat.uniforms.uScale.value = 1.0
        }
      }

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
      style={{ height: isMobile ? SECTION_HEIGHT_MOBILE : SECTION_HEIGHT_DESKTOP }}
      id="experiencia"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-[#F4F4F2]">
        {/* Canvas — tela cheia limpa, sem overlay */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{
            opacity: canShow ? 1 : 0,
            transition: 'opacity 0.4s ease',
            imageRendering: 'crisp-edges',
          }}
        />

        {/* (sem fade — corte direto para a próxima seção) */}

        {/* Frases — alternam lado no desktop, centralizadas embaixo no mobile */}
        {PHRASES.map((p, i) => {
          const isActive = activePhrase === i
          const desktopSide = p.side === 'left' ? 'md:left-12 xl:left-20 md:text-left' : 'md:right-12 xl:right-20 md:text-right'
          const baseY = isMobile ? 0 : -50 // % para vertical center no desktop
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

        {/* Splash inicial — só até o primeiro frame */}
        {!canShow && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-[#F4F4F2]">
            <div className="w-8 h-8 border-2 border-[#0E1B3C]/15 border-t-[#F28C28] rounded-full animate-spin" />
          </div>
        )}

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
