"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Crown, Zap, Star, Download, Clock } from "lucide-react"
import Link from "next/link"

export default function UpgradeBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-purple-900/50 via-blue-900/50 to-purple-900/50 border border-purple-500/20 rounded-xl p-6 mb-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500 rounded-full blur-2xl"></div>
      </div>

      {/* Close Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-6 h-6 text-yellow-400" />
              <Badge className="bg-yellow-600 text-white text-sm">
                Oferta Especial
              </Badge>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">
              Desbloqueie Todo o Potencial da IA
            </h3>
            
            <p className="text-gray-300 mb-4 max-w-2xl">
              Acesso ilimitado a mais de 50.000 prompts premium. Economize tempo e aumente sua produtividade com os melhores prompts criados por especialistas.
            </p>

            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2 text-gray-300">
                <Download className="w-4 h-4 text-green-400" />
                <span className="text-sm">Downloads Ilimitados</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">Prompts Premium</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-sm">Acesso Antecipado</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">
                R$ 49,90
              </div>
              <div className="text-gray-400 text-sm">
                por mês
              </div>
              <div className="text-green-400 text-sm font-medium">
                ✓ Cancelamento a qualquer momento
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/planos">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6">
                  <Crown className="w-4 h-4 mr-2" />
                  Ver Planos
                </Button>
              </Link>
              <Link href="/buscar?priceFilter=free">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Continuar Gratuito
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Downloads restantes este mês</span>
            <span>2 de 5</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" style={{ width: '40%' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
} 