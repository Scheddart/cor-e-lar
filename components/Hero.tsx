'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronDown } from 'lucide-react'
import dynamic from 'next/dynamic'

const PaintCanvas = dynamic(() => import('./PaintCanvas'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-br from-night via-navy/30 to-night" />
  ),
})

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.8 })

      tl.fromTo(
        '.hero-line',
        { y: 120, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power4.out',
          stagger: 0.15,
        }
      )
        .fromTo(
          subtitleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.4'
        )
        .fromTo(
          ctaRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          '-=0.3'
        )
        .fromTo(
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          '-=0.2'
        )

      // Parallax on scroll
      gsap.to('.hero-content', {
        y: 150,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  const scrollToNext = () => {
    document.querySelector('#sobre')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative w-full h-screen min-h-[600px] overflow-hidden flex items-center justify-center"
    >
      {/* WebGL Paint Background */}
      <div className="absolute inset-0 z-0">
        <PaintCanvas />
      </div>

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-night/70 via-night/40 to-night/80" />

      {/* Noise texture */}
      <div className="absolute inset-0 z-10 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="hero-content relative z-20 text-center px-6 max-w-6xl mx-auto">
        {/* Badge */}
        <div className="overflow-hidden mb-6">
          <div className="hero-line inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full text-sm text-cream/80 font-body">
            <span className="w-2 h-2 rounded-full bg-orange-paint animate-paint-pulse" />
            Leme, SP — Primeira Loja Conceito Tintas Maza
          </div>
        </div>

        {/* Main title */}
        <h1 ref={titleRef} className="font-display mb-6" aria-label="Onde a Cor Ganha Vida">
          <div className="overflow-hidden">
            <span className="hero-line block text-display-xl text-cream leading-none">
              ONDE A COR
            </span>
          </div>
          <div className="overflow-hidden">
            <span className="hero-line block text-display-xl text-gradient-paint leading-none">
              GANHA VIDA
            </span>
          </div>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-cream/70 font-body text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Tintas premium para transformar cada espaço. Linha completa Maza com
          consultoria especializada e mistura computadorizada de cores.
        </p>

        {/* CTA buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => document.querySelector('#produtos')?.scrollIntoView({ behavior: 'smooth' })}
            className="group relative px-8 py-4 bg-orange-paint text-white font-body font-medium rounded-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-orange-paint/40 hover:scale-105"
          >
            <span className="relative z-10">Ver Produtos</span>
            <div className="absolute inset-0 bg-orange-light translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
          <button
            onClick={() => document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 glass-card text-cream font-body font-medium rounded-full hover:border-orange-paint/40 transition-all duration-300 hover:text-orange-light border border-white/10"
          >
            Fale Conosco
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer"
        onClick={scrollToNext}
      >
        <span className="text-cream/40 text-xs font-body tracking-[0.2em] uppercase">Explorar</span>
        <ChevronDown size={20} className="text-cream/40 animate-bounce" />
      </div>

      {/* Bottom paint drip decoration */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 0L48 8C96 16 192 32 288 40C384 48 480 48 576 44C672 40 768 32 864 28C960 24 1056 24 1152 28C1248 32 1344 40 1392 44L1440 48V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0V0Z"
            fill="#0A0A0A"
          />
        </svg>
      </div>
    </section>
  )
}
