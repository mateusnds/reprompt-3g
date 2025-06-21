import { HeroSection } from "@/components/hero-section"
import { FeaturedPrompts } from "@/components/featured-prompts"
import { ReviewsSection } from "@/components/reviews-section"
import { MarketplaceStats } from "@/components/stats/marketplace-stats"
import { TrustSignals } from "@/components/trust-signals"
import { FAQSection } from "@/components/faq-section"
import { MainLayout } from "@/components/layout/main-layout"

export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturedPrompts />
      <TrustSignals />
      <MarketplaceStats />
      <ReviewsSection />
      <FAQSection />
    </MainLayout>
  )
}