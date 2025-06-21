
"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ReactNode } from "react"

interface MainLayoutProps {
  children: ReactNode
  showHero?: boolean
}

export function MainLayout({ children, showHero = false }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      {showHero && (
        <div className="hero-section">
          {/* Hero content will be passed as children or prop */}
        </div>
      )}
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
