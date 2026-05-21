import Navbar from '@/components/Navbar'
import dynamic from 'next/dynamic'

const FrameScroll = dynamic(() => import('@/components/FrameScroll'), { ssr: false })
const BrandPalette = dynamic(() => import('@/components/BrandPalette'), { ssr: false })
const About = dynamic(() => import('@/components/About'))
const Products = dynamic(() => import('@/components/Products'))
const Services = dynamic(() => import('@/components/Services'))
const Gallery = dynamic(() => import('@/components/Gallery'))
const Contact = dynamic(() => import('@/components/Contact'))
const Footer = dynamic(() => import('@/components/Footer'))

export default function Home() {
  return (
    <main>
      <Navbar />
      <FrameScroll />
      <BrandPalette />
      <About />
      <Products />
      <Services />
      <Gallery />
      <Contact />
      <Footer />
    </main>
  )
}
