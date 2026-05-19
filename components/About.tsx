'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const stats = [
  { number: 27, suffix: '+', label: 'Anos de história', desc: 'Tintas Maza no mercado' },
  { number: 100, suffix: '%', label: 'Cores customizadas', desc: 'Mistura computadorizada' },
  { number: 500, suffix: '+', label: 'Produtos em estoque', desc: 'Linha completa disponível' },
  { number: 1, suffix: 'ª', label: 'Loja Conceito Maza', desc: 'No Brasil' },
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text reveal on scroll
      gsap.fromTo(
        '.about-text-line',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      )

      // Stat counters
      const statEls = statsRef.current?.querySelectorAll('.stat-number')
      statEls?.forEach((el, i) => {
        const target = stats[i].number
        const obj = { val: 0 }
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          snap: { val: 1 },
          onUpdate: () => {
            el.textContent = Math.round(obj.val).toString()
          },
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
          },
        })
      })

      // Stats cards reveal
      gsap.fromTo(
        '.stat-card',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="sobre"
      ref={sectionRef}
      className="relative py-20 md:py-28 lg:py-32 px-5 md:px-6 overflow-hidden"
      style={{ background: '#000000' }}
    >
      {/* Glow sutil em azul-marinho (sem cinza, sem laranja borrado) */}
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(14,27,60,0.55) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full pointer-events-none -translate-y-1/2"
        style={{
          background: 'radial-gradient(circle, rgba(31,79,191,0.18) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          {/* Left: Text */}
          <div>
            <div className="overflow-hidden">
              <div className="about-text-line flex items-center gap-3 mb-4">
                <span className="line-accent" />
                <span className="text-orange-paint font-body text-sm tracking-[0.2em] uppercase">
                  Nossa História
                </span>
              </div>
            </div>

            <h2 className="about-text-line font-display text-cream mb-6 leading-[1.05] pb-2 text-4xl sm:text-5xl md:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem]">
              MAIS QUE TINTA,
              <br />
              <span className="text-gradient-paint inline-block pb-1">TRANSFORMAÇÃO</span>
            </h2>

            <div className="space-y-5">
              <p className="about-text-line text-cream/70 font-body text-lg leading-relaxed">
                A <strong className="text-cream">Cor & Lar Tintas</strong> é a primeira loja conceito
                da Tintas Maza no Brasil, localizada em Leme, SP. Uma experiência única de
                atendimento e qualidade premium em tintas e revestimentos.
              </p>
              <p className="about-text-line text-cream/60 font-body leading-relaxed">
                Com mais de 27 anos de trajetória, a Maza é referência nacional na fabricação de
                tintas imobiliárias, automotivas e industriais. Nossa loja oferece consultoria
                especializada, mistura computadorizada de cores e a linha completa de produtos para
                cada tipo de projeto.
              </p>
              <p className="about-text-line text-cream/60 font-body leading-relaxed">
                Nossa missão é simples: transformar espaços através da cor, com qualidade garantida
                e o melhor atendimento da região.
              </p>
            </div>

            <div className="about-text-line mt-8">
              <button
                onClick={() => document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth' })}
                className="group inline-flex items-center gap-3 text-orange-paint font-body font-medium hover:gap-5 transition-all duration-300"
              >
                Visite nossa loja
                <span className="w-8 h-px bg-orange-paint group-hover:w-12 transition-all duration-300" />
              </button>
            </div>
          </div>

          {/* Right: Stats */}
          <div ref={statsRef} className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="stat-card glass-card rounded-2xl p-6 hover:border-orange-paint/20 transition-all duration-300 group"
              >
                <div className="font-display text-5xl text-orange-paint group-hover:text-orange-light transition-colors">
                  <span className="stat-number">0</span>
                  <span>{stat.suffix}</span>
                </div>
                <p className="text-cream font-body font-medium mt-2">{stat.label}</p>
                <p className="text-cream/40 font-body text-sm mt-1">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
