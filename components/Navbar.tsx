'use client'

import { useEffect, useRef, useState } from 'react'
import { Menu, X, Phone } from 'lucide-react'
import Logo from './Logo'

const navLinks = [
  { label: 'Início', href: '#experiencia' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Produtos', href: '#produtos' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Galeria', href: '#galeria' },
  { label: 'Contato', href: '#contato' },
]

type Theme = 'light' | 'royal' | 'navy' | 'black'

const themes: Record<Theme, { bg: string; text: string; subtext: string; border: string; cta: string; ctaHover: string }> = {
  light: {
    bg: 'rgba(244, 244, 242, 0.95)',
    text: '#0E1B3C',
    subtext: 'rgba(14, 27, 60, 0.7)',
    border: 'rgba(14, 27, 60, 0.08)',
    cta: '#0E1B3C',
    ctaHover: '#1F4FBF',
  },
  royal: {
    bg: 'rgba(31, 79, 191, 0.95)',
    text: '#F4F4F2',
    subtext: 'rgba(244, 244, 242, 0.75)',
    border: 'rgba(244, 244, 242, 0.12)',
    cta: '#F28C28',
    ctaHover: '#FFA855',
  },
  navy: {
    bg: 'rgba(14, 27, 60, 0.95)',
    text: '#F4F4F2',
    subtext: 'rgba(244, 244, 242, 0.7)',
    border: 'rgba(244, 244, 242, 0.08)',
    cta: '#F28C28',
    ctaHover: '#FFA855',
  },
  black: {
    bg: 'rgba(0, 0, 0, 0.85)',
    text: '#F4F4F2',
    subtext: 'rgba(244, 244, 242, 0.65)',
    border: 'rgba(244, 244, 242, 0.06)',
    cta: '#F28C28',
    ctaHover: '#FFA855',
  },
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [theme, setTheme] = useState<Theme>('navy')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = () => {
      const frameSection = document.getElementById('experiencia')
      const paleta = document.getElementById('paleta')
      const sobre = document.getElementById('sobre')

      // Visibilidade — aparece após FrameScroll
      if (!frameSection) {
        setVisible(window.scrollY > 50)
      } else {
        const bottom = frameSection.offsetTop + frameSection.offsetHeight
        setVisible(window.scrollY >= bottom - window.innerHeight * 0.5)
      }

      // Tema dinâmico baseado na seção atual sob a navbar
      const navbarY = 40 // ponto de amostragem (~meio da navbar)
      const sampleY = window.scrollY + navbarY

      if (paleta && sampleY >= paleta.offsetTop && sampleY < paleta.offsetTop + paleta.offsetHeight) {
        // Dentro de BrandPalette — checa se está no topo (royal) ou base (navy/black)
        const rel = (sampleY - paleta.offsetTop) / paleta.offsetHeight
        if (rel < 0.35) setTheme('royal')
        else if (rel < 0.8) setTheme('navy')
        else setTheme('black')
      } else if (sobre && sampleY >= sobre.offsetTop) {
        setTheme('black')
      } else {
        setTheme('navy')
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const t = themes[theme]

  const scrollToSection = (href: string) => {
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
    setMenuOpen(false)
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
        style={{
          background: t.bg,
          borderColor: t.border,
          transition:
            'opacity 0.7s ease, transform 0.7s ease, background-color 0.5s ease, border-color 0.5s ease',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo + Brand name */}
            <button
              onClick={() => scrollToSection('#experiencia')}
              className="flex items-center gap-3 group"
            >
              <Logo
                variant="compact"
                className="h-10 w-auto group-hover:scale-105 transition-transform duration-300"
              />
              <span
                className="hidden md:inline-block font-display text-sm tracking-[0.3em]"
                style={{ color: t.subtext, transition: 'color 0.5s ease' }}
              >
                COR &amp; LAR TINTAS
              </span>
            </button>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="paint-underline text-sm font-body font-medium"
                  style={{ color: t.subtext, transition: 'color 0.3s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = t.text)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = t.subtext)}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href="https://wa.me/551935732828"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 text-white text-sm font-body font-medium rounded-full transition-all duration-300 hover:shadow-lg"
                style={{ background: t.cta }}
                onMouseEnter={(e) => (e.currentTarget.style.background = t.ctaHover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = t.cta)}
              >
                <Phone size={14} />
                Fale Conosco
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2"
              style={{ color: t.text, transition: 'color 0.5s ease' }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#0E1B3C]/98 backdrop-blur-xl transition-all duration-500 lg:hidden flex flex-col justify-center items-center gap-8 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {navLinks.map((link, i) => (
          <button
            key={link.href}
            onClick={() => scrollToSection(link.href)}
            className="font-display text-5xl text-brand-white hover:text-[#F28C28] transition-colors duration-200"
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            {link.label}
          </button>
        ))}
        <a
          href="https://wa.me/551935732828"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center gap-2 px-8 py-3 bg-[#F28C28] text-white font-body font-medium rounded-full"
          onClick={() => setMenuOpen(false)}
        >
          <Phone size={16} />
          Fale Conosco
        </a>
      </div>
    </>
  )
}
