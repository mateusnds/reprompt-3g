"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Crown, Gift } from "lucide-react"
import Link from "next/link"
import type { SubscriptionPlan } from "@/lib/types"
import { SubscriptionService } from "@/lib/subscription-service"

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const data = await SubscriptionService.getPlans()
        setPlans(data)
      } catch (error) {
        console.error('Erro ao carregar planos:', error)
        setPlans([])
      } finally {
        setLoading(false)
      }
    }

    loadPlans()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Carregando Planos...</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-gray-900/80 border-gray-700 animate-pulse">
                <CardHeader className="text-center">
                  <div className="h-8 bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-6 bg-gray-700 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <div key={j} className="h-4 bg-gray-700 rounded"></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20" aria-labelledby="pricing-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-6 h-6 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">Planos Premium</span>
          </div>
          <h2 id="pricing-heading" className="text-4xl font-bold text-white mb-4">
            Escolha o Plano Ideal para Você
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Acesso ilimitado a milhares de prompts premium criados por especialistas. 
            Economize tempo e aumente sua produtividade com IA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative bg-gray-900/80 border-gray-700 hover:border-purple-500/50 transition-all duration-300 ${
                plan.isPopular ? 'ring-2 ring-purple-500 scale-105' : ''
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Mais Popular
                  </Badge>
                </div>
              )}

              {plan.discountPercentage && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-green-600 text-white text-xs">
                    -{plan.discountPercentage}%
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </CardTitle>
                <p className="text-gray-400 text-sm mb-4">
                  {plan.description}
                </p>
                
                <div className="mb-4">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-white">
                      {SubscriptionService.formatPrice(plan.price)}
                    </span>
                    {plan.originalPrice && plan.originalPrice > plan.price && (
                      <span className="text-gray-500 line-through text-lg">
                        {SubscriptionService.formatPrice(plan.originalPrice)}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    {plan.duration === 'monthly' ? 'por mês' : 
                     plan.duration === 'quarterly' ? 'por 3 meses' : 'por ano'}
                  </p>
                  {plan.duration !== 'monthly' && (
                    <p className="text-purple-400 text-sm mt-1">
                      {SubscriptionService.formatPrice(SubscriptionService.calculateMonthlyPrice(plan))}/mês
                    </p>
                  )}
                </div>

                {plan.duration === 'annual' && (
                  <div className="bg-green-900/20 border border-green-500/20 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 text-green-400">
                      <Gift className="w-4 h-4" />
                      <span className="text-sm font-medium">2 meses grátis!</span>
                    </div>
                  </div>
                )}
              </CardHeader>

              <CardContent className="pt-0">
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${
                    plan.isPopular 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
                      : 'bg-gray-800 hover:bg-gray-700 border border-gray-600'
                  } text-white py-3 text-lg font-semibold`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.isPopular ? (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Escolher Plano
                    </>
                  ) : (
                    'Começar Agora'
                  )}
                </Button>

                <p className="text-gray-500 text-xs text-center mt-3">
                  Cancelamento a qualquer momento
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ainda tem dúvidas?
            </h3>
            <p className="text-gray-300 mb-6">
              Nossa equipe está pronta para ajudar você a escolher o plano ideal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/faq">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Ver FAQ
                </Button>
              </Link>
              <Link href="/contato">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Falar com Suporte
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-sm">Garantia de 7 dias</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-sm">Pagamento seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-sm">Cancelamento gratuito</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-sm">Suporte 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 