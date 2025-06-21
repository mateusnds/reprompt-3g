import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedPrompts } from "@/components/featured-prompts"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <HeroSection />
        <FeaturedPrompts />
      </main>
      <Footer />
    </div>
  )
}
