import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        night: '#000000',           // preto puro
        'night-soft': '#0E1B3C',     // navy da paleta (era cinza)
        'night-border': '#152547',   // navy mais claro como border (era cinza)
        // Nova paleta da marca
        brand: {
          navy: '#0E1B3C',      // Azul Marinho Profundo (dominante)
          'navy-soft': '#152547',
          'navy-deep': '#08112A',
          white: '#F4F4F2',     // Branco Gelo
          red: '#D62828',       // Vermelho Vibrante
          orange: '#F28C28',    // Laranja Queimado
          royal: '#1F4FBF',     // Azul Royal (complementar)
        },
        // Aliases legados para compatibilidade com componentes existentes
        orange: {
          paint: '#F28C28',
          light: '#FFA855',
          glow: 'rgba(242,140,40,0.18)',
        },
        cream: '#F4F4F2',
        'cream-soft': '#E8E6DF',
        navy: '#0E1B3C',
        gold: '#F28C28',
        'gold-light': '#FFA855',
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(4rem, 12vw, 10rem)', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '0.95', letterSpacing: '-0.01em' }],
        'display-md': ['clamp(2rem, 5vw, 4rem)', { lineHeight: '1', letterSpacing: '-0.01em' }],
      },
      animation: {
        'paint-pulse': 'paintPulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        paintPulse: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
