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

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Navbar aparece APÓS a animação FrameScroll terminar
    const handleScroll = () => {
      const frameSection = document.getElementById('experiencia')
      if (!frameSection) {
        setVisible(window.scrollY > 50)
        return
      }
      const bottom = frameSection.offsetTop + frameSection.offsetHeight
      // Mostra quando o usuário passa do final da seção FrameScroll
      setVisible(window.scrollY >= bottom - window.innerHeight * 0.3)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 bg-[#0E1B3C]/95 backdrop-blur-xl border-b border-white/5 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
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
              <span className="hidden md:inline-block font-display text-sm tracking-[0.3em] text-brand-white/80">
                COR &amp; LAR TINTAS
              </span>
            </button>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="paint-underline text-sm text-brand-white/70 hover:text-brand-white transition-colors duration-200 font-body font-medium"
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
                className="flex items-center gap-2 px-5 py-2.5 bg-[#F28C28] hover:bg-[#FFA855] text-white text-sm font-body font-medium rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#F28C28]/30"
              >
                <Phone size={14} />
                Fale Conosco
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden text-brand-white p-2"
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
