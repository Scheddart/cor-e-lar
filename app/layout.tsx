import type { Metadata } from 'next'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'

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
    <html lang="pt-BR">
      <body>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
