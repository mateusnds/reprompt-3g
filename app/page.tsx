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

// Assuming FeaturedPrompts component structure
function FeaturedPromptsComponent() {
  return (
    <div>
      <h2>Categorias Populares</h2>
      <div>
        <Link href="/buscar?category=midjourney">
          <Button variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white transition-all">
            <Sparkles className="w-4 h-4 mr-2" />
            Midjourney
          </Button>
        </Link>
        <Link href="/buscar?category=chatgpt">
          <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white transition-all">
            <MessageSquare className="w-4 h-4 mr-2" />
            ChatGPT
          </Button>
        </Link>
        <Link href="/buscar?category=dalle">
          <Button variant="outline" className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white transition-all">
            <Image className="w-4 h-4 mr-2" />
            DALL-E
          </Button>
        </Link>
        <Link href="/buscar?category=claude">
          <Button variant="outline" className="border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-white transition-all">
            <Brain className="w-4 h-4 mr-2" />
            Claude
          </Button>
        </Link>
      </div>
    </div>
  );
}


import { Button } from "@/components/ui/button"
import { Brain, Image, MessageSquare, Sparkles } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <>
      <StructuredData type="homepage" />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <main>
          <HeroSection />
          <FeaturedPromptsComponent />
          <TrustSignals />
          <ReviewsSection promptId="homepage" promptTitle="RePrompt Platform" />
        </main>
        <Footer />
      </div>
    </>
  )
}