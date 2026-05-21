import type { Metadata } from 'next'
import { Bebas_Neue, Inter } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const inter = Inter({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Cor & Lar Tintas | Leme, SP',
  description: 'Primeira loja conceito Tintas Maza no Brasil, em Leme, SP. Linha imobiliária, automotiva e industrial. Consultoria de cores e mistura computadorizada.',
  keywords: 'tintas Leme SP, Cor & Lar Tintas, Tintas Maza, loja de tintas Leme, pintura residencial, pintura automotiva Leme',
  openGraph: {
    title: 'Cor & Lar Tintas | Leme, SP',
    description: 'Onde a cor ganha vida. Tintas premium para sua casa e seu negócio.',
    type: 'website',
    locale: 'pt_BR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${bebasNeue.variable} ${inter.variable}`}>
      <head>
        <link rel="preload" as="image" href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/frames/ezgif-frame-001.jpg`} fetchPriority="high" />
      </head>
      <body>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
