'use client'

import { Instagram, MapPin, Phone, Heart } from 'lucide-react'
import Logo from './Logo'

const footerLinks = [
  {
    title: 'Produtos',
    links: [
      { label: 'Linha Imobiliária', href: '#produtos' },
      { label: 'Linha Automotiva', href: '#produtos' },
      { label: 'Linha Industrial', href: '#produtos' },
      { label: 'Solventes', href: '#produtos' },
    ],
  },
  {
    title: 'Serviços',
    links: [
      { label: 'Consultoria de Cores', href: '#servicos' },
      { label: 'Mistura Computadorizada', href: '#servicos' },
      { label: 'Entrega', href: '#servicos' },
      { label: 'Suporte Técnico', href: '#servicos' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Sobre Nós', href: '#sobre' },
      { label: 'Galeria de Cores', href: '#galeria' },
      { label: 'Contato', href: '#contato' },
      { label: 'Tintas Maza', href: 'https://www.maza.com.br' },
    ],
  },
]

export default function Footer() {
  const scrollTo = (href: string) => {
    if (href.startsWith('http')) {
      window.open(href, '_blank')
      return
    }
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-night-soft border-t border-night-border overflow-hidden">
      {/* Top gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-paint/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <Logo variant="full" className="h-20 w-auto" />
            </div>
            <p className="text-cream/50 font-body text-sm leading-relaxed mb-6">
              Primeira loja conceito Tintas Maza no Brasil, em Leme, SP. Qualidade premium e
              atendimento especializado em tintas e revestimentos.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/corelartintas/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 glass-card rounded-full flex items-center justify-center hover:border-orange-paint/30 hover:text-orange-paint transition-all duration-200 text-cream/60"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.google.com/maps/place/Cor+%26+Lar+Tintas"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 glass-card rounded-full flex items-center justify-center hover:border-orange-paint/30 hover:text-orange-paint transition-all duration-200 text-cream/60"
                aria-label="Localização no Google Maps"
              >
                <MapPin size={18} />
              </a>
              <a
                href="https://wa.me/551935732828"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 glass-card rounded-full flex items-center justify-center hover:border-orange-paint/30 hover:text-orange-paint transition-all duration-200 text-cream/60"
                aria-label="WhatsApp"
              >
                <Phone size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="font-body font-semibold text-cream text-sm tracking-wider uppercase mb-4">
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => scrollTo(link.href)}
                      className="text-cream/50 font-body text-sm hover:text-orange-light transition-colors duration-200 paint-underline"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-night-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-cream/30 font-body text-sm">
            © {new Date().getFullYear()} Cor & Lar Tintas. Todos os direitos reservados.
          </p>
          <p className="text-cream/20 font-body text-xs flex items-center gap-1.5">
            Feito com <Heart size={11} className="text-orange-paint" fill="currentColor" /> para Leme, SP
          </p>
        </div>
      </div>
    </footer>
  )
}
