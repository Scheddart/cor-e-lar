'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronLeft, ChevronRight } from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Color palette showcase — since we don't have real photos, we show beautiful color swatches
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

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null)
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gallery-header',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )

      // Brush-reveal effect for palette cards
      gsap.fromTo(
        '.palette-card',
        { x: -40, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.08,
          scrollTrigger: { trigger: '.palettes-container', start: 'top 80%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const navigate = (dir: 1 | -1) => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrent((c) => (c + dir + colorPalettes.length) % colorPalettes.length)
      setIsAnimating(false)
    }, 200)
  }

  const featured = colorPalettes[current]

  return (
    <section id="galeria" ref={sectionRef} className="relative py-20 md:py-28 lg:py-32 px-5 md:px-6 bg-night-soft overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-paint/20 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="gallery-header flex flex-col lg:flex-row items-start lg:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="line-accent" />
              <span className="text-orange-paint font-body text-sm tracking-[0.2em] uppercase">
                Inspiração de Cores
              </span>
            </div>
            <h2 className="font-display text-display-lg text-cream leading-none">
              PALETAS QUE
              <br />
              <span className="text-gradient-paint">TRANSFORMAM</span>
            </h2>
          </div>
          <p className="text-cream/60 font-body max-w-sm leading-relaxed">
            Explore combinações de cores selecionadas por nossos especialistas para cada ambiente da sua casa.
          </p>
        </div>

        {/* Featured palette */}
        <div className="relative glass-card rounded-3xl overflow-hidden mb-8 group">
          {/* Color bar */}
          <div className="flex h-32 sm:h-48">
            {featured.colors.map((color, i) => (
              <div
                key={i}
                className="flex-1 transition-all duration-700 group-hover:flex-[1.5] first:rounded-tl-3xl last:rounded-tr-3xl"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {/* Info */}
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-orange-paint font-body text-xs tracking-[0.2em] uppercase">
                {featured.category}
              </span>
              <h3 className="font-display text-3xl text-cream mt-1">{featured.name}</h3>
              <p className="text-cream/50 font-body text-sm mt-2">{featured.description}</p>
            </div>
            {/* Hex codes */}
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              {featured.colors.map((color, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-lg border border-white/10"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-cream/30 font-body text-[9px]">{color}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="absolute bottom-6 right-6 flex gap-2">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-200"
              aria-label="Anterior"
            >
              <ChevronLeft size={18} className="text-cream" />
            </button>
            <button
              onClick={() => navigate(1)}
              className="w-10 h-10 rounded-full bg-orange-paint flex items-center justify-center hover:bg-orange-light transition-colors duration-200"
              aria-label="Próxima"
            >
              <ChevronRight size={18} className="text-white" />
            </button>
          </div>

          {/* Counter */}
          <div className="absolute top-4 right-4 px-3 py-1 glass-card rounded-full text-cream/50 font-body text-xs">
            {current + 1} / {colorPalettes.length}
          </div>
        </div>

        {/* Mini palette grid */}
        <div className="palettes-container grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {colorPalettes.map((palette, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`palette-card glass-card rounded-xl overflow-hidden transition-all duration-300 ${
                current === i ? 'ring-2 ring-orange-paint scale-105' : 'hover:scale-102 hover:border-white/15'
              }`}
            >
              <div className="flex h-14">
                {palette.colors.slice(0, 3).map((color, j) => (
                  <div key={j} className="flex-1" style={{ backgroundColor: color }} />
                ))}
              </div>
              <div className="p-2">
                <p className="text-cream/70 font-body text-[10px] font-medium truncate">{palette.name}</p>
                <p className="text-cream/30 font-body text-[9px]">{palette.category}</p>
              </div>
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-cream/50 font-body mb-4">
            Precisa de uma cor específica? Fazemos a mistura exata para você.
          </p>
          <button
            onClick={() => document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-orange-paint text-white font-body font-medium rounded-full hover:bg-orange-light transition-colors duration-300 hover:shadow-xl hover:shadow-orange-paint/30"
          >
            Solicitar mistura personalizada
          </button>
        </div>
      </div>
    </section>
  )
}
