
"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, Download, Eye, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getFeaturedPromptsData, type Prompt } from '@/lib/prompts-storage'

const FeaturedPrompts = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPrompts = async () => {
      try {
        setLoading(true)
        const featuredPrompts = await getFeaturedPromptsData()
        setPrompts(featuredPrompts)
      } catch (error) {
        console.error('Erro ao carregar prompts em destaque:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPrompts()
  }, [])

  if (loading) {
    return (
      <section className="py-16 featured-prompts">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 gradient-text">
              Prompts em Destaque
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Descubra os prompts mais populares e bem avaliados da nossa comunidade
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="h-96 animate-pulse">
                <div className="bg-slate-700 h-48 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="bg-slate-700 h-4 mb-3 rounded"></div>
                  <div className="bg-slate-700 h-3 mb-2 rounded"></div>
                  <div className="bg-slate-700 h-3 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 featured-prompts">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Prompts em Destaque
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Descubra os prompts mais populares e bem avaliados da nossa comunidade. 
            Criações que transformaram ideias em resultados incríveis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {prompts.map((prompt) => (
            <Card 
              key={prompt.id} 
              className="group hover:shadow-2xl transition-all duration-500 overflow-hidden bg-slate-800/90 border-slate-600/50"
              data-card="true"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={prompt.thumbnail}
                  alt={prompt.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute top-3 right-3">
                  <Badge 
                    variant={prompt.is_free ? "secondary" : "default"}
                    className="bg-white/90 text-slate-900 font-semibold"
                  >
                    {prompt.is_free ? 'Grátis' : `R$ ${prompt.price.toFixed(2)}`}
                  </Badge>
                </div>
                
                <div className="absolute top-3 left-3">
                  <Badge 
                    variant="outline" 
                    className="bg-black/70 text-white border-white/30 font-medium"
                  >
                    {prompt.category}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-white line-clamp-2 group-hover:text-purple-300 transition-colors">
                      {prompt.title}
                    </CardTitle>
                    <CardDescription className="text-slate-300 line-clamp-2 mt-2 text-base">
                      {prompt.description}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="shrink-0 ml-3 text-white hover:text-red-400">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="py-3">
                <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-white font-medium">{prompt.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span className="text-slate-300">{prompt.downloads}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span className="text-slate-300">{prompt.views}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Image
                    src={prompt.author_avatar}
                    alt={prompt.author}
                    width={32}
                    height={32}
                    className="rounded-full border-2 border-slate-600"
                  />
                  <span className="text-slate-300 font-medium">
                    por {prompt.author}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="pt-3">
                <Link href={`/prompt/${prompt.category}/${prompt.slug}`} className="w-full">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 transition-all duration-300">
                    {prompt.is_free ? 'Ver Prompt Grátis' : 'Comprar Agora'}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link href="/explorar">
            <Button 
              variant="outline" 
              size="lg"
              className="bg-transparent border-purple-500 text-white hover:bg-purple-600 hover:border-purple-600 px-8 py-3 text-lg font-semibold"
            >
              Ver Todos os Prompts
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedPrompts
