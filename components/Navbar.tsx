'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Menu, X, Phone } from 'lucide-react'
import Logo from './Logo'

const navLinks = [
  { label: 'Início', href: '#hero' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Produtos', href: '#produtos' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Galeria', href: '#galeria' },
  { label: 'Contato', href: '#contato' },
]

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    gsap.registerPlugin(ScrollTrigger)

    // Entrance animation
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
    )

    // Scroll-based style change
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
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
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-night/95 backdrop-blur-xl border-b border-night-border'
            : 'bg-transparent'
        }`}
        style={{ opacity: 0 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button
              onClick={() => scrollToSection('#hero')}
              className="flex items-center group"
            >
              <Logo
                variant="compact"
                className="h-12 w-auto group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_2px_8px_rgba(245,237,224,0.15)]"
              />
            </button>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="paint-underline text-sm text-cream/70 hover:text-cream transition-colors duration-200 font-body font-medium"
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
                className="flex items-center gap-2 px-5 py-2.5 bg-orange-paint hover:bg-orange-light text-white text-sm font-body font-medium rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-orange-paint/30"
              >
                <Phone size={14} />
                Fale Conosco
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden text-cream p-2"
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
        className={`fixed inset-0 z-40 bg-night/98 backdrop-blur-xl transition-all duration-500 lg:hidden flex flex-col justify-center items-center gap-8 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {navLinks.map((link, i) => (
          <button
            key={link.href}
            onClick={() => scrollToSection(link.href)}
            className="font-display text-5xl text-cream hover:text-orange-paint transition-colors duration-200"
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            {link.label}
          </button>
        ))}
        <a
          href="https://wa.me/551935732828"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center gap-2 px-8 py-3 bg-orange-paint text-white font-body font-medium rounded-full"
          onClick={() => setMenuOpen(false)}
        >
          <Phone size={16} />
          Fale Conosco
        </a>
      </div>
    </>
  )
}
