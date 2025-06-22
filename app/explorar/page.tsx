
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Star, Download, Eye, Filter, X, Grid, List } from "lucide-react"
import Link from "next/link"
import { universalSearch, type UniversalSearchFilters } from "@/lib/prompts-storage"
import { getActiveTags } from "@/lib/tags-storage"
import type { Prompt } from "@/lib/types"
import type { Tag } from "@/lib/tags-storage"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VideoPreview } from "@/components/video-preview"

const categories = [
  { name: "Midjourney", slug: "midjourney" },
  { name: "ChatGPT", slug: "chatgpt" },
  { name: "DALL-E", slug: "dalle" },
  { name: "Claude", slug: "claude" },
  { name: "Stable Diffusion", slug: "stable-diffusion" },
  { name: "Leonardo AI", slug: "leonardo-ai" },
  { name: "Gemini", slug: "gemini" },
  { name: "Grok", slug: "grok" },
  { name: "FLUX", slug: "flux" },
  { name: "Sora", slug: "sora" },
  { name: "Vídeos", slug: "videos" },
]

export default function ExplorarPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Filtros
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [priceFilter, setPriceFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)

  // Estatísticas
  const [stats, setStats] = useState({
    total: 0,
    free: 0,
    paid: 0,
    categories: {} as Record<string, number>,
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [searchQuery, selectedCategory, selectedTags, priceFilter, sortBy])

  const loadData = async () => {
    setLoading(true)
    try {
      const [allPrompts, tags] = await Promise.all([
        universalSearch(),
        getActiveTags()
      ])

      setAvailableTags(tags)

      // Calcular estatísticas
      const newStats = {
        total: allPrompts.length,
        free: allPrompts.filter((p) => p.isFree).length,
        paid: allPrompts.filter((p) => !p.isFree).length,
        categories: {} as Record<string, number>,
      }

      categories.forEach((cat) => {
        newStats.categories[cat.slug] = allPrompts.filter((p) => p.category === cat.slug).length
      })

      setStats(newStats)
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = async () => {
    const filters: UniversalSearchFilters = {
      query: searchQuery.trim() || undefined,
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      priceFilter: priceFilter as 'all' | 'free' | 'paid',
      sortBy: sortBy as any
    }

    try {
      const filtered = await universalSearch(filters)
      setPrompts(filtered)
    } catch (error) {
      console.error("Erro ao aplicar filtros:", error)
      setPrompts([])
    }
  }

  const handleTagToggle = (tagName: string) => {
    setSelectedTags((prev) => (prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]))
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedTags([])
    setPriceFilter("all")
    setSortBy("newest")
  }

  const hasActiveFilters = searchQuery || selectedCategory !== "all" || selectedTags.length > 0 || priceFilter !== "all"

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-white text-lg">Carregando prompts...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Explorar Prompts</h1>
          <p className="text-gray-400 mb-6">Descubra {stats.total} prompts incríveis para suas criações com IA</p>

          {/* Estatísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-gray-400 text-sm">Total</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{stats.free}</div>
                <div className="text-gray-400 text-sm">Gratuitos</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{stats.paid}</div>
                <div className="text-gray-400 text-sm">Premium</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{prompts.length}</div>
                <div className="text-gray-400 text-sm">Filtrados</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Barra de busca e controles */}
        <Card className="bg-gray-900 border-gray-700 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Busca */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por título, descrição, autor ou tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                />
              </div>

              {/* Controles */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                  {hasActiveFilters && (
                    <Badge className="ml-2 bg-purple-600 text-white text-xs">
                      {[selectedCategory !== "all" ? 1 : 0, selectedTags.length, priceFilter !== "all" ? 1 : 0].reduce(
                        (a, b) => a + b,
                        0,
                      )}
                    </Badge>
                  )}
                </Button>

                <div className="flex border border-gray-600 rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Filtros expandidos */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-700 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Categoria */}
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Categoria</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="all">Todas as categorias</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.slug} value={cat.slug}>
                            {cat.name} ({stats.categories[cat.slug] || 0})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Preço */}
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Preço</label>
                    <Select value={priceFilter} onValueChange={setPriceFilter}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="all">Todos os preços</SelectItem>
                        <SelectItem value="free">Gratuitos ({stats.free})</SelectItem>
                        <SelectItem value="paid">Premium ({stats.paid})</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Ordenação */}
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Ordenar por</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="newest">Mais recentes</SelectItem>
                        <SelectItem value="oldest">Mais antigos</SelectItem>
                        <SelectItem value="rating">Melhor avaliados</SelectItem>
                        <SelectItem value="downloads">Mais baixados</SelectItem>
                        <SelectItem value="views">Mais visualizados</SelectItem>
                        <SelectItem value="price-low">Menor preço</SelectItem>
                        <SelectItem value="price-high">Maior preço</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">
                    Tags {selectedTags.length > 0 && `(${selectedTags.length} selecionadas)`}
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {availableTags.map((tag) => (
                      <div key={tag.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={tag.id}
                          checked={selectedTags.includes(tag.name)}
                          onCheckedChange={() => handleTagToggle(tag.name)}
                        />
                        <label htmlFor={tag.id} className="text-gray-300 text-sm cursor-pointer hover:text-white">
                          {tag.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ações dos filtros */}
                <div className="flex justify-between items-center pt-4">
                  <div className="text-gray-400 text-sm">
                    {prompts.length} de {stats.total} prompts
                  </div>
                  {hasActiveFilters && (
                    <Button variant="ghost" onClick={clearFilters} className="text-gray-400 hover:text-white">
                      <X className="w-4 h-4 mr-2" />
                      Limpar filtros
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filtros ativos */}
        {hasActiveFilters && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="bg-purple-600 text-white">
                  {categories.find((c) => c.slug === selectedCategory)?.name}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSelectedCategory("all")} />
                </Badge>
              )}
              {priceFilter !== "all" && (
                <Badge variant="secondary" className="bg-blue-600 text-white">
                  {priceFilter === "free" ? "Gratuitos" : "Premium"}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setPriceFilter("all")} />
                </Badge>
              )}
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-green-600 text-white">
                  {tag}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => handleTagToggle(tag)} />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Resultados */}
        {prompts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">
              {hasActiveFilters ? "Nenhum prompt encontrado com os filtros aplicados" : "Nenhum prompt disponível"}
            </div>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline" className="border-gray-600 text-gray-300">
                Limpar filtros
              </Button>
            )}
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {prompts.map((prompt) => (
              <Link
                key={prompt.id}
                href={`/prompt/${prompt.category}/${prompt.slug}`}
              >
                <Card
                  className={`hover:shadow-xl transition-shadow group bg-gray-800 border-gray-700 cursor-pointer ${
                    viewMode === "list" ? "flex" : ""
                  }`}
                >
                  <CardHeader className={`p-0 ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                    <div className="relative overflow-hidden rounded-t-lg">
                      {prompt.videoUrl ? (
                        <VideoPreview
                          videoUrl={prompt.videoUrl}
                          thumbnailUrl={prompt.images[0] || "/placeholder.svg"}
                          title={prompt.title}
                          className={viewMode === "list" ? "w-48 h-32" : "w-full h-48"}
                        />
                      ) : (
                        <img
                          src={prompt.images[0] || "/placeholder.svg"}
                          alt={prompt.title}
                          className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                            viewMode === "list" ? "w-48 h-32" : "w-full h-48"
                          }`}
                        />
                      )}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className="bg-gray-900/80 text-white border border-gray-600 text-xs">
                          {prompt.category}
                        </Badge>
                        {prompt.isFree && <Badge className="bg-green-600 text-white text-xs">Gratuito</Badge>}
                        {prompt.isAdminCreated && <Badge className="bg-blue-600 text-white text-xs">Oficial</Badge>}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-white">{prompt.rating.toFixed(1)}</span>
                      </div>
                      <div className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        {prompt.isFree ? "Gratuito" : `R$ ${prompt.price.toFixed(2).replace(".", ",")}`}
                      </div>
                    </div>

                    <h3 className="font-bold text-lg mb-2 group-hover:text-purple-400 transition-colors text-white line-clamp-2">
                      {prompt.title}
                    </h3>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{prompt.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {prompt.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="border-gray-600 text-gray-400 text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {prompt.tags.length > 3 && (
                        <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                          +{prompt.tags.length - 3}
                        </Badge>
                      )}
                    </div>

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

        {/* Paginação (placeholder para implementação futura) */}
        {prompts.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-gray-400">
              Mostrando {prompts.length} de {stats.total} prompts
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
