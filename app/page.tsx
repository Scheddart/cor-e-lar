import Navbar from '@/components/Navbar'
import dynamic from 'next/dynamic'
import About from '@/components/About'
import Products from '@/components/Products'
import Services from '@/components/Services'
import Gallery from '@/components/Gallery'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

const FrameScroll = dynamic(() => import('@/components/FrameScroll'), { ssr: false })
const BrandPalette = dynamic(() => import('@/components/BrandPalette'), { ssr: false })

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
