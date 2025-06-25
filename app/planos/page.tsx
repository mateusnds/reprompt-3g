"use client"

import SubscriptionPlans from "@/components/subscription-plans"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function PlanosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <main>
        <SubscriptionPlans />
      </main>
      <Footer />
    </div>
  )
} 