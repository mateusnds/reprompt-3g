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

      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <span className="text-purple-400 font-semibold text-lg">Marketplace #1 de Prompts IA</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Transforme suas
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> ideias </span> 
            em realidade
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Descubra, compre e venda os melhores prompts para IA. Mais de <strong>50.000 criadores</strong> confiam na nossa plataforma.
            </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto mb-8" role="search">
            <div className="relative">
              <label htmlFor="main-search" className="sr-only">
                Buscar prompts de IA por categoria, ferramenta ou estilo
              </label>
              <Input
                id="main-search"
                type="text"
                placeholder="Ex: 'retrato fotorrealístico', 'ChatGPT marketing', 'Midjourney paisagem'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-32 text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-300 rounded-2xl focus:bg-white/20 transition-all"
                autoComplete="off"
                aria-describedby="search-help"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-300" aria-hidden="true" />
              <Button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 h-10 rounded-xl transition-all duration-300"
              >
                Buscar
              </Button>
            </div>
            <p id="search-help" className="text-sm text-gray-400 mt-2 text-center">
              Busque por categoria, ferramenta de IA, estilo ou palavra-chave
            </p>
          </form>>
              Encontre prompts profissionais testados para suas necessidades específicas
            </p>
          </form>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link href="/buscar?priceFilter=free">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl">
                <Zap className="w-4 h-4 mr-2" />
                Prompts Gratuitos
              </Button>
            </Link>
            <Link href="/buscar?sortBy=rating">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl">
                <Star className="w-4 h-4 mr-2" />
                Mais Avaliados
              </Button>
            </Link>
            <Link href="/buscar?sortBy=newest">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl">
                <TrendingUp className="w-4 h-4 mr-2" />
                Novidades
              </Button>
            </Link>
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

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Comece a vender seus prompts hoje</h3>
            <p className="text-gray-300 mb-6">Junte-se a milhares de criadores que já monetizam sua criatividade.</p>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-3 rounded-xl">
                Começar a Vender
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}