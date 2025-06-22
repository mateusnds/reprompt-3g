
import { Metadata } from "next"
import HeroSection from '@/components/hero-section'
import FeaturedPrompts from '@/components/featured-prompts'
import { TrustSignals } from '@/components/trust-signals'
import { ReviewsSection } from '@/components/reviews-section'
import Footer from '@/components/footer'
import Header from '@/components/header'
import StructuredData from '@/components/structured-data'

export const metadata: Metadata = {
  title: "RePrompt - Marketplace #1 de Prompts para IA | Midjourney, DALL-E, ChatGPT",
  description: "Descubra, compre e venda os melhores prompts para IA no maior marketplace do Brasil. Mais de 50.000 criadores confiam na nossa plataforma. Prompts para Midjourney, DALL-E, Stable Diffusion e ChatGPT.",
}

export default function HomePage() {
  return (
    <>
      <StructuredData type="homepage" />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <main>
          <HeroSection />
          <FeaturedPrompts />
          <TrustSignals />
          <ReviewsSection promptId="homepage" promptTitle="RePrompt Platform" />
        </main>
        <Footer />
      </div>
    </>
  )
}
