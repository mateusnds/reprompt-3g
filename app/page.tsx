import { HeroSection } from "@/components/hero-section"
import { FeaturedPrompts } from "@/components/featured-prompts"
import { ReviewsSection } from "@/components/reviews-section"
import { MarketplaceStats } from "@/components/stats/marketplace-stats"
import { MainLayout } from "@/components/layout/main-layout"

export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturedPrompts />
      <MarketplaceStats />
      <ReviewsSection />
    </MainLayout>
  )
}