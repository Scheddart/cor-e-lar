'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'
import PaintBucket from './PaintBucket'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const colorPalettes = [
  {
    name: 'Aconchego Terracota',
    category: 'Sala de Estar',
    colors: ['#C0613A', '#D4845A', '#E8A882', '#F2C9A8', '#FAE8D5'],
    description: 'Paleta quente que traz profundidade e acolhimento para salas de estar.',
  },
  {
    name: 'Serenidade Oceânica',
    category: 'Quarto',
    colors: ['#1A3A5C', '#2E5F8A', '#4A84B0', '#7BAED4', '#B8D8EE'],
    description: 'Tons de azul que induzem calma e relaxamento em ambientes de descanso.',
  },
  {
    name: 'Natureza Viva',
    category: 'Varanda',
    colors: ['#2D4A1E', '#4A7A2D', '#6BA342', '#96C96A', '#C5E29A'],
    description: 'Verde fresco que conecta o ambiente interno à natureza exterior.',
  },
  {
    name: 'Elegância Neutra',
    category: 'Home Office',
    colors: ['#2A2A2A', '#4A4A4A', '#7A7A7A', '#ADADAD', '#E0E0E0'],
    description: 'Tons neutros sofisticados para ambientes de trabalho produtivos.',
  },
  {
    name: 'Amarelo Vitalidade',
    category: 'Cozinha',
    colors: ['#8B6300', '#C49A00', '#F0C020', '#F5D560', '#FAE9A0'],
    description: 'Amarelos vibrantes que energizam e iluminam ambientes de convívio.',
  },
  {
    name: 'Rosa Contemporâneo',
    category: 'Quarto Infantil',
    colors: ['#8B3A5A', '#C05A80', '#E088A8', '#F0B4CC', '#F8DCEA'],
    description: 'Rosa moderno e delicado para ambientes que encantam.',
  },
]

// Helper — escurece um hex para gradiente de fundo
function darken(hex: string, amount = 0.7) {
  const m = hex.replace('#', '').match(/.{2}/g)
  if (!m) return hex
  const [r, g, b] = m.map((x) => parseInt(x, 16) * (1 - amount))
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
}

// Variantes da animação 3D do balde
const bucketVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '110%' : '-110%',
    rotateY: direction > 0 ? 35 : -35,
    scale: 0.85,
    opacity: 0,
  }),
  center: {
    x: '0%',
    rotateY: 0,
    scale: 1,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-110%' : '110%',
    rotateY: direction > 0 ? -35 : 35,
    scale: 0.85,
    opacity: 0,
  }),
}

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null)
  const [[current, direction], setCurrent] = useState<[number, number]>([0, 0])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gallery-header',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )

      gsap.fromTo(
        '.palette-card',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
          stagger: 0.07,
          scrollTrigger: { trigger: '.palettes-container', start: 'top 85%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const changeTo = (newIndex: number) => {
    if (newIndex === current) return
    const dir = newIndex > current ? 1 : -1
    setCurrent([newIndex, dir])
  }

  const featured = colorPalettes[current]
  const dominantColor = featured.colors[0]

  return (
    <section
      id="galeria"
      ref={sectionRef}
      className="relative py-20 md:py-28 lg:py-32 px-5 md:px-6 overflow-hidden"
      style={{
        background: '#000000',
      }}
    >
      {/* Fundo dinâmico — gradiente radial centrado, cor da paleta atual */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: `radial-gradient(circle at 50% 45%, ${darken(dominantColor, 0.55)} 0%, ${darken(dominantColor, 0.78)} 35%, #000000 75%)`,
        }}
        transition={{ duration: 1.0, ease: [0.32, 0.72, 0, 1] }}
      />

      {/* Top divisor sutil */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <div className="gallery-header flex flex-col lg:flex-row items-start lg:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="line-accent" />
              <span
                className="font-body text-sm tracking-[0.2em] uppercase"
                style={{ color: '#F28C28' }}
              >
                Inspiração de Cores
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-cream leading-[0.95]">
              PALETAS QUE
              <br />
              <span className="text-gradient-paint">TRANSFORMAM</span>
            </h2>
          </div>
          <p className="text-cream/60 font-body max-w-sm leading-relaxed">
            Explore combinações de cores selecionadas por nossos especialistas
            para cada ambiente da sua casa.
          </p>
        </div>

        {/* ─── BALDE 3D ─── */}
        <div
          className="relative w-full h-[420px] sm:h-[460px] md:h-[500px] mb-6"
          style={{ perspective: '1400px' }}
        >
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={current}
              custom={direction}
              variants={bucketVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.85,
                ease: [0.32, 0.72, 0, 1],
              }}
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
            >
              <div className="w-[260px] sm:w-[300px] md:w-[340px] drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)]">
                <PaintBucket paintColor={dominantColor} />
              </div>

              {/* Nome + categoria abaixo do balde */}
              <div className="mt-6 text-center px-4">
                <p
                  className="font-body text-[11px] tracking-[0.4em] uppercase mb-2"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  {featured.category}
                </p>
                <h3 className="font-display text-3xl md:text-4xl text-cream tracking-wide">
                  {featured.name}
                </h3>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ─── LINHA DISCRETA DE VARIAÇÕES (5 cores) ─── */}
        <div className="max-w-md mx-auto mb-3">
          <div className="flex h-3 rounded-full overflow-hidden border border-white/10">
            {featured.colors.map((color, i) => (
              <motion.div
                key={`${current}-${i}`}
                className="flex-1"
                style={{ backgroundColor: color }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.06, ease: 'easeOut' }}
              />
            ))}
          </div>
          {/* Hex codes minúsculos */}
          <div className="flex justify-between mt-2 px-1">
            {featured.colors.map((color, i) => (
              <span
                key={i}
                className="font-mono text-[8px] tracking-wider"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                {color.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        {/* Descrição curta */}
        <p
          className="text-center max-w-md mx-auto mb-12 font-body text-sm"
          style={{ color: 'rgba(255,255,255,0.55)' }}
        >
          {featured.description}
        </p>

        {/* ─── CARROSSEL DE PALETAS (thumbnails) ─── */}
        <div className="palettes-container grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
          {colorPalettes.map((palette, i) => {
            const isActive = current === i
            return (
              <button
                key={i}
                onClick={() => changeTo(i)}
                className={`palette-card relative rounded-xl overflow-hidden transition-all duration-300 ${
                  isActive ? 'scale-[1.04]' : 'hover:scale-[1.02] opacity-70 hover:opacity-100'
                }`}
                style={{
                  background: 'rgba(31,79,191,0.08)',
                  border: isActive ? '1.5px solid #F28C28' : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: isActive ? '0 0 30px rgba(242,140,40,0.25)' : 'none',
                }}
              >
                <div className="flex h-14">
                  {palette.colors.slice(0, 4).map((color, j) => (
                    <div
                      key={j}
                      className="flex-1"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="p-2 text-left">
                  <p className="text-cream font-body text-[10px] font-medium truncate">
                    {palette.name}
                  </p>
                  <p
                    className="font-body text-[9px] truncate"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    {palette.category}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-cream/55 font-body mb-4 text-sm">
            Precisa de uma cor específica? Fazemos a mistura exata para você.
          </p>
          <button
            onClick={() =>
              document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="inline-flex items-center gap-2 px-8 py-3.5 text-white font-body font-medium rounded-full transition-all duration-300 hover:shadow-xl"
            style={{ background: '#F28C28' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#FFA855')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#F28C28')}
          >
            Solicitar mistura personalizada
          </button>
        </div>
      </div>
    </section>
  )
}
