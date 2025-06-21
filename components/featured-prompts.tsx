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
      <section className="py-16 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Prompts em Destaque</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubra os prompts mais populares e bem avaliados da nossa comunidade
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="h-96 animate-pulse">
                <div className="bg-gray-300 h-48 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="bg-gray-300 h-4 mb-2 rounded"></div>
                  <div className="bg-gray-300 h-3 mb-4 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Prompts em Destaque</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Descubra os prompts mais populares e bem avaliados da nossa comunidade
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <Card key={prompt.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="relative">
                <Image
                  src={prompt.thumbnail}
                  alt={prompt.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={prompt.is_free ? "secondary" : "default"}>
                    {prompt.is_free ? 'Grátis' : `R$ ${prompt.price.toFixed(2)}`}
                  </Badge>
                </div>
                <div className="absolute top-2 left-2">
                  <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                    {prompt.category}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                      {prompt.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {prompt.description}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="shrink-0 ml-2">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="py-2">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{prompt.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    <span>{prompt.downloads}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{prompt.views}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <Image
                    src={prompt.author_avatar}
                    alt={prompt.author}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className="text-sm text-muted-foreground">
                    por {prompt.author}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="pt-2">
                <Link href={`/prompt/${prompt.category}/${prompt.slug}`} className="w-full">
                  <Button className="w-full">
                    {prompt.is_free ? 'Ver Prompt' : 'Comprar Agora'}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/explorar">
            <Button variant="outline" size="lg">
              Ver Todos os Prompts
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedPrompts