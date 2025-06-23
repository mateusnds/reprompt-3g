"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Download, Eye, ShoppingCart, Zap, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getFeaturedPrompts } from '@/lib/prompts-storage'
import { Prompt } from '@/lib/types'

export default function FeaturedPrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPrompts = async () => {
      try {
        const data = await getFeaturedPrompts()
        setPrompts(data)
      } catch (error) {
        console.error('Erro ao carregar prompts:', error)
        setPrompts([])
      } finally {
        setLoading(false)
      }
    }

    loadPrompts()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Prompts em Destaque</h2>
            <p className="text-gray-300">Carregando os melhores prompts...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-gray-900/50 border-gray-700 animate-pulse">
                <div className="h-48 bg-gray-700 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 w-16 bg-gray-700 rounded"></div>
                    <div className="h-6 w-20 bg-gray-700 rounded"></div>
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
    <section className="py-16 bg-gray-800/30" aria-labelledby="featured-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-6 h-6 text-yellow-400" aria-hidden="true" />
            <span className="text-yellow-400 font-semibold">Prompts Premium</span>
          </div>
          <h2 id="featured-heading" className="text-4xl font-bold text-white mb-4">
            Prompts em Destaque
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Descubra os prompts mais populares e bem avaliados da nossa comunidade. 
            Criados por especialistas e testados por milhares de usuários.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {prompts.map((prompt) => (
            <Card key={prompt.id} className="group bg-gray-900/80 border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 overflow-hidden">
              <div className="relative overflow-hidden">
                <Image
                  src={prompt.previewImages[0] || '/placeholder.jpg'}
                  alt={`Preview do prompt: ${prompt.title}`}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-purple-600 hover:bg-purple-700 text-white">
                    {prompt.aiTool}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="outline" className="bg-black/50 border-gray-600 text-white">
                    R$ {prompt.price.toFixed(2)}
                  </Badge>
                </div>
                {prompt.verified && (
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-green-600 text-white text-xs">
                      ✓ Verificado
                    </Badge>
                  </div>
                )}
              </div>

              <CardHeader className="pb-4">
                <CardTitle className="text-white text-lg line-clamp-2 group-hover:text-purple-300 transition-colors">
                  {prompt.title}
                </CardTitle>
                <p className="text-gray-400 text-sm line-clamp-2">
                  {prompt.description}
                </p>
              </CardHeader>

              <CardContent className="pt-0 pb-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {prompt.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-gray-800 text-gray-300 hover:bg-gray-700">
                      {tag}
                    </Badge>
                  ))}
                  {prompt.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-gray-800 text-gray-300">
                      +{prompt.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{prompt.rating.toFixed(1)}</span>
                      <span>({prompt.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      <span>{prompt.downloads}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{prompt.views}</span>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  Por {prompt.author} • {prompt.difficulty}
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <div className="flex gap-2 w-full">
                  <Button 
                    asChild 
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    <Link href={`/prompt/${prompt.category}/${prompt.slug}`}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Comprar
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    asChild
                    className="border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800"
                  >
                    <Link href={`/prompt/${prompt.category}/${prompt.slug}`}>
                      Ver Detalhes
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            asChild
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8"
          >
            <Link href="/buscar">
              Ver Todos os Prompts
            </Link>
          </Button>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-300 mb-4">
            Explore mais prompts e encontre exatamente o que você precisa.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/buscar?sortBy=rating" key="mais-avaliados">
              <Button 
                variant="outline" 
                className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
              >
                <Star className="w-4 h-4 mr-2" />
                Mais Avaliados
              </Button>
            </Link>
            <Link href="/buscar?sortBy=newest" key="novidades">
              <Button 
                variant="outline" 
                className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
              >
                <Clock className="w-4 h-4 mr-2" />
                Novidades
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-300 mb-4">
            Está com pouco dinheiro?
          </p>
          <Link href="/buscar?priceFilter=free" className="text-purple-400 hover:text-purple-300 font-medium">
            Ver todos os prompts gratuitos →
          </Link>
        </div>
      </div>
    </section>
  )
}