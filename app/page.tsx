import { Metadata } from "next"
import HeroSection from '@/components/hero-section'
import FeaturedPrompts from '@/components/featured-prompts'
import TrustSignals from '@/components/trust-signals'
import ReviewsSection from '@/components/reviews-section'
import FAQSection from '@/components/faq-section'
import Footer from '@/components/footer'
import Header from '@/components/header'
import StructuredData from '@/components/structured-data'

export const metadata: Metadata = {
  title: "RePrompt - Marketplace #1 de Prompts para IA | Midjourney, DALL-E, ChatGPT",
  description: "Descubra, compre e venda os melhores prompts para IA no maior marketplace do Brasil. Mais de 50.000 criadores confiam na nossa plataforma. Prompts para Midjourney, DALL-E, Stable Diffusion e ChatGPT.",
  keywords: [
    "prompts IA",
    "marketplace prompts",
    "midjourney prompts",
    "dalle prompts",
    "chatgpt prompts",
    "stable diffusion prompts",
    "inteligência artificial",
    "geração de imagens",
    "prompts premium",
    "prompts profissionais"
  ],
  authors: [{ name: "RePrompt Team" }],
  creator: "RePrompt",
  publisher: "RePrompt",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://reprompt.com",
    siteName: "RePrompt",
    title: "RePrompt - Marketplace #1 de Prompts para IA",
    description: "Descubra, compre e venda os melhores prompts para IA no maior marketplace do Brasil. Mais de 50.000 criadores confiam na nossa plataforma.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "RePrompt - Marketplace de Prompts para IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RePrompt - Marketplace #1 de Prompts para IA",
    description: "Descubra, compre e venda os melhores prompts para IA no Brasil.",
    images: ["/images/twitter-image.jpg"],
    creator: "@reprompt",
  },
  alternates: {
    canonical: "https://reprompt.com",
  },
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
          <ReviewsSection />
          <FAQSection />
        </main>
        <Footer />
      </div>
    </>
  )
}