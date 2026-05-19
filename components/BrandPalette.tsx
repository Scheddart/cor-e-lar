'use client'

import { useEffect, useRef } from 'react'

export default function BrandPalette() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.querySelectorAll('.reveal-up').forEach((el, i) => {
              setTimeout(() => {
                (el as HTMLElement).style.opacity = '1'
                ;(el as HTMLElement).style.transform = 'translateY(0)'
              }, i * 120)
            })
          }
        })
      },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 md:py-32 lg:py-56 px-4 md:px-8"
      style={{
        background:
          'linear-gradient(180deg, #1F4FBF 0%, #173FA0 20%, #0E1B3C 55%, #050B1F 90%, #000000 100%)',
      }}
      id="paleta"
    >
      {/* (sem overlay no topo — o gradiente da seção já começa em royal) */}

      {/* Glow decorativo */}
      <div
        className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(31,79,191,0.35) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(242,140,40,0.14) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Transição inferior — fade para preto puro (próxima seção About) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, #000000 100%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center">

        <p
          className="reveal-up text-brand-white/40 text-xs tracking-[0.6em] uppercase mb-6"
          style={{ opacity: 0, transform: 'translateY(24px)', transition: 'all 0.6s ease' }}
        >
          Identidade Visual
        </p>

        <h2
          className="reveal-up font-display text-brand-white mb-4 leading-tight"
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 5rem)',
            opacity: 0,
            transform: 'translateY(24px)',
            transition: 'all 0.6s ease',
          }}
        >
          PALETA DE
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #1F4FBF 0%, #4F7FE0 50%, #1F4FBF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            CORES DA MARCA
          </span>
        </h2>

        <p
          className="reveal-up text-brand-white/55 text-base max-w-xl mx-auto mb-16 leading-relaxed"
          style={{ opacity: 0, transform: 'translateY(24px)', transition: 'all 0.6s ease' }}
        >
          As cores que definem a Cor &amp; Lar — escolhidas para transmitir
          qualidade, confiança e a riqueza das tintas Maza.
        </p>

        <div
          className="reveal-up grid grid-cols-2 md:grid-cols-5 gap-4 mb-10"
          style={{ opacity: 0, transform: 'translateY(24px)', transition: 'all 0.6s ease' }}
        >
          {[
            { label: 'Azul Marinho', hex: '#0E1B3C', text: 'text-white/70' },
            { label: 'Branco Gelo', hex: '#F4F4F2', text: 'text-black/65' },
            { label: 'Vermelho Vibrante', hex: '#D62828', text: 'text-white/85' },
            { label: 'Laranja Queimado', hex: '#F28C28', text: 'text-white/85' },
            { label: 'Azul Royal', hex: '#1F4FBF', text: 'text-white/85' },
          ].map((c) => (
            <div
              key={c.hex}
              className="rounded-2xl overflow-hidden border border-white/10"
              style={{ background: c.hex }}
            >
              <div className="h-28" />
              <div className="px-3 py-3 bg-black/30 backdrop-blur-sm">
                <p className={`text-xs font-semibold tracking-wide ${c.text}`}>{c.label}</p>
                <p className={`text-[10px] font-mono mt-0.5 ${c.text} opacity-70`}>{c.hex}</p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="reveal-up"
          style={{ opacity: 0, transform: 'translateY(24px)', transition: 'all 0.6s ease' }}
        >
          <p className="text-brand-white/30 text-xs tracking-[0.4em] uppercase">
            A identidade visual da Cor &amp; Lar Tintas
          </p>
        </div>

      </div>
    </section>
  )
}
