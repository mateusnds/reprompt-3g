
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Download, Eye } from "lucide-react"
import Link from "next/link"
import { searchPrompts } from "@/lib/prompts-storage"
import type { Prompt } from "@/lib/types"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VideoPreview } from "@/components/video-preview"
import { use } from "react"

interface CategoryPageProps {
  params: Promise<{
    categoria: string
  }>
}

const categoryNames: { [key: string]: string } = {
  midjourney: "Midjourney",
  chatgpt: "ChatGPT",
  dalle: "DALL-E",
  claude: "Claude",
  "stable-diffusion": "Stable Diffusion",
  "leonardo-ai": "Leonardo AI",
  gemini: "Gemini",
  grok: "Grok",
  flux: "FLUX",
  sora: "Sora",
  videos: "Vídeos",
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = use(params)
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [sortBy, setSortBy] = useState("newest")
  const [priceFilter, setPriceFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  const categoryName = categoryNames[resolvedParams.categoria] || resolvedParams.categoria

  useEffect(() => {
    const loadCategoryPrompts = () => {
      setLoading(true)
      try {
        const results = searchPrompts("", {
          category: resolvedParams.categoria,
          priceFilter: priceFilter === "all" ? undefined : priceFilter,
          sortBy,
        })
        setPrompts(results)
      } catch (error) {
        console.error("Erro ao carregar prompts:", error)
        setPrompts([])
      } finally {
        setLoading(false)
      }
    }

    loadCategoryPrompts()
  }, [resolvedParams.categoria, sortBy, priceFilter])

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-white">
            Início
          </Link>
          <span>/</span>
          <Link href="/buscar" className="hover:text-white">
            Explorar
          </Link>
          <span>/</span>
          <span className="text-white">{categoryName}</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Prompts de {categoryName}</h1>
          <p className="text-gray-400">{loading ? "Carregando..." : `${prompts.length} prompts encontrados`}</p>
        </div>

        {/* Filtros */}
        <Card className="bg-gray-900 border-gray-700 mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Filtrar por preço" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">Todos os preços</SelectItem>
                  <SelectItem value="free">Gratuitos</SelectItem>
                  <SelectItem value="paid">Premium</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="newest">Mais recentes</SelectItem>
                  <SelectItem value="rating">Melhor avaliados</SelectItem>
                  <SelectItem value="downloads">Mais baixados</SelectItem>
                  <SelectItem value="price-low">Menor preço</SelectItem>
                  <SelectItem value="price-high">Maior preço</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">Carregando prompts...</div>
          </div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">Nenhum prompt encontrado para {categoryName}</p>
            <p className="text-gray-500">Seja o primeiro a criar um prompt para esta categoria!</p>
            <Link href="/dashboard/novo-prompt">
              <Button className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Criar Prompt
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {prompts.map((prompt) => (
              <Link
                key={prompt.id}
                href={`/prompt/${prompt.category}/${prompt.title
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^\w-]/g, "")}`}
              >
                <Card className="hover:shadow-xl transition-shadow group bg-gray-800 border-gray-700 cursor-pointer">
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      {prompt.videoUrl ? (
                        <VideoPreview
                          videoUrl={prompt.videoUrl}
                          thumbnailUrl={prompt.images?.[0] || "/placeholder.svg"}
                          title={prompt.title}
                          className="w-full h-48"
                        />
                      ) : (
                        <img
                          src={prompt.images?.[0] || "/placeholder.svg"}
                          alt={prompt.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <Badge className="absolute top-3 left-3 bg-gray-900/80 text-white border border-gray-600">
                        {prompt.category}
                      </Badge>
                      {prompt.isFree && (
                        <Badge className="absolute top-3 right-3 bg-green-600 text-white">Gratuito</Badge>
                      )}
                      {prompt.isAdminCreated && (
                        <Badge className="absolute bottom-3 left-3 bg-blue-600 text-white">Oficial</Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-white">{prompt.rating.toFixed(1)}</span>
                      </div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        {prompt.isFree ? "Gratuito" : `R$ ${prompt.price.toFixed(2).replace(".", ",")}`}
                      </div>
                    </div>

                    <h3 className="font-bold text-lg mb-2 group-hover:text-purple-400 transition-colors text-white">
                      {prompt.title}
                    </h3>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{prompt.description}</p>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Download className="w-4 h-4" />
                          <span>{prompt.downloads}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{prompt.views}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        por <span className="font-medium text-gray-300">{prompt.author}</span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        {prompt.isFree ? "Baixar" : "Comprar"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
