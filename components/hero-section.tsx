
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Sparkles, Zap, Star, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const popularCategories = [
    { name: "Midjourney", count: "15,800+", href: "/buscar?category=midjourney" },
    { name: "ChatGPT", count: "22,400+", href: "/buscar?category=chatgpt" },
    { name: "DALL-E", count: "11,200+", href: "/buscar?category=dalle" },
    { name: "Claude", count: "9,700+", href: "/buscar?category=claude" },
  ]

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20 pt-20 pb-16">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Marketplace de Prompts
            </span>
            <br />
            <span className="text-white">para Inteligência Artificial</span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Descubra, compre e venda os melhores prompts para IA. Mais de <strong>50.000 criadores</strong> confiam na nossa plataforma.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto mb-8" role="search">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="search"
                placeholder="Busque por categoria, ferramenta de IA, estilo ou palavra-chave"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                aria-describedby="search-help"
              />
              <Button
                type="submit"
                size="lg"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Buscar
              </Button>
            </div>
            <p id="search-help" className="text-sm text-gray-400 mt-2 text-center">
              Busque por categoria, ferramenta de IA, estilo ou palavra-chave
            </p>
          </form>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">50K+</div>
              <div className="text-gray-400 text-sm">Prompts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">25K+</div>
              <div className="text-gray-400 text-sm">Criadores</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">4.9</div>
              <div className="text-gray-400 text-sm">Avaliação</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">100%</div>
              <div className="text-gray-400 text-sm">Testados</div>
            </div>
          </div>

          {/* Popular Categories Grid */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-8">Categorias Populares</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularCategories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300"
                >
                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-purple-300 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{category.count} prompts</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link href="/buscar">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
              >
                <Search className="w-5 h-5 mr-2" />
                Buscar Prompts
              </Button>
            </Link>
            <Link href="/cadastrar-prompt">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm"
              >
                <Zap className="w-5 h-5 mr-2" />
                Vender Prompts
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-12 opacity-60">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-300 text-sm">Prompts testados</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span className="text-gray-300 text-sm">Resultados garantidos</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-gray-300 text-sm">Tendências atualizadas</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
