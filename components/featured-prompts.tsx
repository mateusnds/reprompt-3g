"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, Star, TrendingUp, Clock, Gift, Crown } from "lucide-react"
import Link from "next/link"
import { getFeaturedPrompts } from '@/lib/database'
import type { Prompt } from "@/lib/types"
import { PromptCard } from "@/components/prompt/prompt-card"

export default function FeaturedPrompts() {
  const [featuredPrompts, setFeaturedPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPrompts = async () => {
      try {
        const prompts = await getFeaturedPrompts()
        setFeaturedPrompts(prompts)
      } catch (error) {
        console.error("Erro ao carregar prompts:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPrompts()
  }, [])

  const getTopRatedPrompts = () => {
    return featuredPrompts
      .filter(p => p.rating >= 4.5)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6)
  }

  const getTrendingPrompts = () => {
    return featuredPrompts
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, 6)
      
  }

  const getNewestPrompts = () => {
    return featuredPrompts
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6)
  }

  const getFreePrompts = () => {
    return featuredPrompts
      .filter(p => p.isFree)
      .slice(0, 6)
  }

  if (loading) {
    return (
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-800 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-800 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Descubra os
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> melhores prompts</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explore nossa seleção curada dos prompts mais populares, bem avaliados e recém-lançados
          </p>
        </div>

        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-12 bg-gray-900 border border-gray-700">
            <TabsTrigger 
              value="trending" 
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Trending</span>
            </TabsTrigger>
            <TabsTrigger 
              value="top-rated" 
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline">Top Rated</span>
            </TabsTrigger>
            <TabsTrigger 
              value="newest" 
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Newest</span>
            </TabsTrigger>
            <TabsTrigger 
              value="free" 
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Gift className="w-4 h-4" />
              <span className="hidden sm:inline">Free</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Prompts em Alta</h3>
                    <p className="text-gray-400">Os mais baixados nas últimas 24h</p>
                  </div>
                </div>
                <Link href="/buscar?sortBy=downloads">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:text-white">
                    Ver Todos
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getTrendingPrompts().map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="top-rated">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Melhor Avaliados</h3>
                    <p className="text-gray-400">Prompts com as maiores notas</p>
                  </div>
                </div>
                <Link href="/buscar?sortBy=rating">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:text-white">
                    Ver Todos
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getTopRatedPrompts().map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="newest">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Recém-Lançados</h3>
                    <p className="text-gray-400">Os prompts mais novos da plataforma</p>
                  </div>
                </div>
                <Link href="/buscar?sortBy=newest">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:text-white">
                    Ver Todos
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getNewestPrompts().map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="free">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Prompts Gratuitos</h3>
                    <p className="text-gray-400">Experimente sem custo algum</p>
                  </div>
                </div>
                <Link href="/buscar?priceFilter=free">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:text-white">
                    Ver Todos
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFreePrompts().map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/20 max-w-3xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Crown className="w-6 h-6 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">Marketplace Premium</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Não encontrou o que procurava?
              </h3>
              <p className="text-gray-300 mb-6">
                Explore nossa coleção completa com mais de 25.000 prompts em todas as categorias
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/buscar">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Explorar Todos os Prompts
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:text-white">
                    Vender Seus Prompts
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}