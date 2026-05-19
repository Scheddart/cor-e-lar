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
        night: '#0A0A0A',
        'night-soft': '#141414',
        'night-border': '#1E1E1E',
        orange: {
          paint: '#FF4D1A',
          light: '#FF7A50',
          glow: 'rgba(255,77,26,0.15)',
        },
        cream: '#F5EDE0',
        'cream-soft': '#EEE3D2',
        navy: '#1C2B4A',
        gold: '#C9A04A',
        'gold-light': '#E8C56A',
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
