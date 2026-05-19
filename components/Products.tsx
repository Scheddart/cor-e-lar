'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Home, Car, Factory, Droplets, ArrowRight } from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const categories = [
  {
    icon: Home,
    label: 'Linha Imobiliária',
    tag: '01',
    color: '#FF4D1A',
    desc: 'Tintas acrílicas de alta performance para ambientes internos e externos. Cobertura superior, durabilidade e resistência.',
    items: ['Tinta Acrílica Premium', 'Massa Corrida PVA', 'Textura Acrílica', 'Verniz Imobiliário', 'Fundo Preparador'],
    accent: 'from-orange-paint/20 to-transparent',
  },
  {
    icon: Car,
    label: 'Linha Automotiva',
    tag: '02',
    color: '#C9A04A',
    desc: 'Soluções completas para pintura automotiva com acabamento profissional. Catalisadores, bases e vernizes especializados.',
    items: ['Esmalte Sintético', 'Fundo Anticorrosivo', 'Primer Automotivo', 'Verniz Poliuretano', 'Thinner Especial'],
    accent: 'from-gold/20 to-transparent',
  },
  {
    icon: Factory,
    label: 'Linha Industrial',
    tag: '03',
    color: '#1C2B4A',
    desc: 'Tintas e revestimentos industriais de alta resistência química e mecânica para estruturas e equipamentos.',
    items: ['Esmalte Industrial', 'Tinta Epóxi', 'Anticorrosivo', 'Tinta para Piso', 'Revestimento Especial'],
    accent: 'from-navy/40 to-transparent',
  },
  {
    icon: Droplets,
    label: 'Solventes & Acessórios',
    tag: '04',
    color: '#7C8FA6',
    desc: 'Linha completa de solventes, diluentes e acessórios para pintura. Aguarrás, thinner, pincéis, rolos e muito mais.',
    items: ['Aguarrás', 'Thinner', 'Acetona', 'Pincéis e Rolos', 'Fitas e Proteção'],
    accent: 'from-white/10 to-transparent',
  },
]

export default function Products() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.product-header',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )
      gsap.fromTo(
        '.product-card',
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: { trigger: '.products-grid', start: 'top 80%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="produtos" ref={sectionRef} className="relative py-20 md:py-28 lg:py-32 px-5 md:px-6 bg-night-soft overflow-hidden">
      <div className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="product-header text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="line-accent" />
            <span className="text-orange-paint font-body text-sm tracking-[0.2em] uppercase">Nosso Catálogo</span>
            <span className="line-accent" />
          </div>
          <h2 className="font-display text-display-lg text-cream">
            LINHA COMPLETA
            <br />
            <span className="text-gradient-paint">DE PRODUTOS</span>
          </h2>
          <p className="text-cream/60 font-body text-lg max-w-2xl mx-auto mt-4 leading-relaxed">
            Da pintura residencial ao acabamento industrial, temos tudo que você precisa
            com a qualidade Maza que o mercado reconhece.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`px-5 py-2.5 rounded-full font-body text-sm font-medium transition-all duration-300 ${
                active === i
                  ? 'bg-orange-paint text-white shadow-lg shadow-orange-paint/30'
                  : 'glass-card text-cream/60 hover:text-cream hover:border-white/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Active category detail */}
        <div className="mb-16 glass-card rounded-3xl p-8 lg:p-12 border border-white/5">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${categories[active].color}20` }}
                >
                  {(() => {
                    const Icon = categories[active].icon
                    return <Icon size={28} style={{ color: categories[active].color }} />
                  })()}
                </div>
                <div>
                  <span className="text-cream/30 font-body text-sm">{categories[active].tag}</span>
                  <h3 className="font-display text-3xl text-cream">{categories[active].label}</h3>
                </div>
              </div>
              <p className="text-cream/70 font-body text-lg leading-relaxed mb-6">
                {categories[active].desc}
              </p>
              <button
                onClick={() => document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 text-orange-paint font-body font-medium hover:gap-4 transition-all duration-300"
              >
                Solicitar orçamento <ArrowRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {categories[active].items.map((item, j) => (
                <div
                  key={j}
                  className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-orange-paint/20 transition-all duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-paint flex-shrink-0" />
                  <span className="text-cream/80 font-body">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All category grid */}
        <div className="products-grid grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, i) => {
            const Icon = cat.icon
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`product-card group text-left glass-card rounded-2xl p-6 hover:border-white/15 transition-all duration-400 relative overflow-hidden ${
                  active === i ? 'border-orange-paint/30' : ''
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-400`} />
                <div className="relative z-10">
                  <div className="text-cream/20 font-display text-5xl mb-4">{cat.tag}</div>
                  <Icon size={24} className="mb-3" style={{ color: cat.color }} />
                  <h3 className="font-body font-semibold text-cream text-sm leading-tight">{cat.label}</h3>
                  <p className="text-cream/40 font-body text-xs mt-2 leading-relaxed line-clamp-2">{cat.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
