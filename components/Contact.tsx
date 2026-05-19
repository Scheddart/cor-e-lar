'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin, Phone, Instagram, Clock, MessageSquare } from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const contactInfo = [
  {
    icon: MapPin,
    label: 'Endereço',
    value: 'Av. Dr. Hermínio Ometto, 1505',
    sub: 'Jardim Alvorada — Leme, SP',
    link: 'https://www.google.com/maps/place/Cor+%26+Lar+Tintas/@-22.2012586,-47.3811924,20z',
    action: 'Ver no mapa',
  },
  {
    icon: Phone,
    label: 'Telefone',
    value: '(19) 3573-2828',
    sub: 'Atendimento direto da loja',
    link: 'tel:+551935732828',
    action: 'Ligar agora',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: '@corelartintas',
    sub: 'Siga para novidades',
    link: 'https://www.instagram.com/corelartintas/',
    action: 'Ver Instagram',
  },
  {
    icon: Clock,
    label: 'Horário',
    value: 'Seg–Sex: 08h–18h',
    sub: 'Sábado: 08h–12h',
    link: null,
    action: null,
  },
]

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-item',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )
      gsap.fromTo(
        '.map-container',
        { scale: 0.95, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.map-container', start: 'top 80%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="contato" ref={sectionRef} className="relative py-20 md:py-28 lg:py-32 px-5 md:px-6 bg-night overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-paint opacity-[0.03] blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="contact-item text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="line-accent" />
            <span className="text-orange-paint font-body text-sm tracking-[0.2em] uppercase">Fale Conosco</span>
            <span className="line-accent" />
          </div>
          <h2 className="font-display text-display-lg text-cream">
            VENHA NOS
            <br />
            <span className="text-gradient-paint">VISITAR</span>
          </h2>
          <p className="text-cream/60 font-body text-lg max-w-xl mx-auto mt-4">
            Estamos na Av. Dr. Hermínio Ometto, 1505 — Leme, SP. Prontos para transformar seu espaço.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map((item, i) => {
              const Icon = item.icon
              return (
                <div
                  key={i}
                  className="contact-item glass-card rounded-2xl p-5 hover:border-orange-paint/20 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-orange-paint/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-paint/20 transition-colors">
                      <Icon size={20} className="text-orange-paint" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-cream/40 font-body text-xs tracking-wider uppercase mb-0.5">
                        {item.label}
                      </p>
                      <p className="text-cream font-body font-medium">{item.value}</p>
                      <p className="text-cream/40 font-body text-sm">{item.sub}</p>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-2 text-orange-paint text-sm font-body hover:text-orange-light transition-colors"
                        >
                          {item.action} →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/551935732828?text=Olá! Gostaria de saber mais sobre os produtos da Cor %26 Lar Tintas."
              target="_blank"
              rel="noopener noreferrer"
              className="contact-item flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] hover:bg-[#20B858] text-white font-body font-medium rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-[#25D366]/30"
            >
              <MessageSquare size={20} />
              Chamar no WhatsApp
            </a>
          </div>

          {/* Map */}
          <div className="map-container lg:col-span-3 glass-card rounded-3xl overflow-hidden" style={{ minHeight: '400px' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d234.10!2d-47.3815422!3d-22.2012825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c80bef75d41cb5%3A0x5403e1d6f75bef03!2sCor%20%26%20Lar%20Tintas!5e0!3m2!1spt-BR!2sbr!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '400px', filter: 'invert(90%) hue-rotate(180deg)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização da Cor & Lar Tintas em São Carlos, SP"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
