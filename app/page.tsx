import { Metadata } from "next"
import HeroSection from "@/components/hero-section"
import FeaturedPrompts from "@/components/featured-prompts"
import { MarketplaceStats } from "@/components/stats/marketplace-stats"
import { TrustSignals } from "@/components/trust-signals"
import { FAQSection } from "@/components/faq-section"

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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RePrompt",
    description: "Marketplace #1 de prompts para IA no Brasil",
    url: "https://reprompt.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://reprompt.com/buscar?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "RePrompt",
      url: "https://reprompt.com",
      logo: {
        "@type": "ImageObject",
        url: "https://reprompt.com/logo.png",
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-black">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <HeroSection />
        </section>

        {/* Featured Prompts */}
        <section className="py-20 bg-gray-900">
          <FeaturedPrompts />
        </section>

        {/* Marketplace Stats */}
        <section className="py-20">
          <MarketplaceStats />
        </section>

        {/* Trust Signals */}
        <section className="py-20 bg-gray-900">
          <TrustSignals />
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <FAQSection />
        </section>
      </main>
    </>
  )
}