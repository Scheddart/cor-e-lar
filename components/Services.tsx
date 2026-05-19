'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Palette, Cpu, Truck, MessageCircle, Star, Shield } from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const services = [
  {
    icon: Palette,
    title: 'Consultoria de Cores',
    desc: 'Consultores especializados para te ajudar a escolher a combinação perfeita para cada ambiente.',
    highlight: 'Gratuita',
  },
  {
    icon: Cpu,
    title: 'Mistura Computadorizada',
    desc: 'Tecnologia de precisão para criar qualquer cor personalizada com exatidão absoluta.',
    highlight: 'Alta precisão',
  },
  {
    icon: Truck,
    title: 'Entrega Rápida',
    desc: 'Entrega ágil em Leme e região. Seu projeto não para por falta de material.',
    highlight: 'Leme e região',
  },
  {
    icon: MessageCircle,
    title: 'Atendimento WhatsApp',
    desc: 'Tire dúvidas, peça orçamentos e finalize pedidos direto pelo WhatsApp, rápido e fácil.',
    highlight: 'Tempo real',
  },
  {
    icon: Star,
    title: 'Produtos Originais',
    desc: 'Linha completa e original Tintas Maza com garantia de fabricante e suporte técnico.',
    highlight: 'Garantia Maza',
  },
  {
    icon: Shield,
    title: 'Suporte Técnico',
    desc: 'Orientação técnica sobre aplicação, diluição e preparo de superfície para melhores resultados.',
    highlight: 'Especializado',
  },
]

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.service-header',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )
      gsap.fromTo(
        '.service-card',
        { y: 50, opacity: 0, scale: 0.97 },
        {
          y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: '.services-grid', start: 'top 80%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="servicos" ref={sectionRef} className="relative py-20 md:py-28 lg:py-32 px-5 md:px-6 bg-night overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-orange-paint opacity-[0.04] blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="service-header grid lg:grid-cols-2 gap-12 items-end mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="line-accent" />
              <span className="text-orange-paint font-body text-sm tracking-[0.2em] uppercase">
                O que oferecemos
              </span>
            </div>
            <h2 className="font-display text-display-lg text-cream leading-none">
              SERVIÇOS QUE
              <br />
              <span className="text-gradient-paint">FAZEM A DIFERENÇA</span>
            </h2>
          </div>
          <p className="text-cream/60 font-body text-lg leading-relaxed">
            Não vendemos apenas tinta. Oferecemos a experiência completa: da escolha da
            cor até a entrega na sua porta, com o suporte que seu projeto merece.
          </p>
        </div>

        {/* Services grid */}
        <div className="services-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc, i) => {
            const Icon = svc.icon
            return (
              <div
                key={i}
                className="service-card group glass-card rounded-2xl p-7 hover:border-orange-paint/20 transition-all duration-400 relative overflow-hidden"
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-paint/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="relative mb-5 inline-block">
                    <div className="w-12 h-12 rounded-xl bg-orange-paint/10 flex items-center justify-center group-hover:bg-orange-paint/20 transition-colors duration-300">
                      <Icon size={22} className="text-orange-paint" />
                    </div>
                  </div>

                  {/* Badge */}
                  <span className="inline-block px-2.5 py-0.5 bg-orange-paint/10 text-orange-paint text-xs font-body rounded-full mb-3">
                    {svc.highlight}
                  </span>

                  <h3 className="font-body font-semibold text-cream text-lg mb-2">
                    {svc.title}
                  </h3>
                  <p className="text-cream/50 font-body text-sm leading-relaxed">
                    {svc.desc}
                  </p>
                </div>

                {/* Bottom accent line on hover */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-orange-paint group-hover:w-full transition-all duration-500 ease-out" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
