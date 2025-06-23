"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, Download, Eye } from "lucide-react"
import Link from "next/link"
import { searchPrompts } from "@/lib/prompts-storage"
import type { Prompt } from "@/lib/types"
import { Header } from "@/components/header"

export default function BuscarPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "all")
  const [priceFilter, setPriceFilter] = useState(searchParams.get("priceFilter") || "all")
  const [sortBy, setSortBy] = useState("newest")
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(false)

  // Função para buscar prompts usando busca unificada
  const performSearch = async () => {
    setLoading(true)
    try {
      const { universalSearch } = await import('@/lib/prompts-storage')
      const results = await universalSearch({
        query: searchQuery,
        category: category === "all" ? undefined : category,
        priceFilter: priceFilter === "all" ? undefined : priceFilter as any,
        sortBy: sortBy as any,
      })
      setPrompts(results)
    } catch (error) {
      console.error("Erro na busca:", error)
      setPrompts([])
    } finally {
      setLoading(false)
    }
  }

  // Executar busca quando os parâmetros mudarem
  useEffect(() => {
    performSearch()
  }, [searchQuery, category, priceFilter, sortBy])

  // Atualizar quando os parâmetros da URL mudarem
  useEffect(() => {
    const urlQuery = searchParams.get("q") || ""
    const urlCategory = searchParams.get("category") || "all"
    const urlPriceFilter = searchParams.get("priceFilter") || "all"

    setSearchQuery(urlQuery)
    setCategory(urlCategory)
    setPriceFilter(urlPriceFilter)
  }, [searchParams])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch()
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-white">
            Início
          </Link>
          <span>/</span>
          <span className="text-white">Buscar</span>
        </nav>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            {searchQuery ? `Resultados para "${searchQuery}"` : "Buscar Prompts"}
          </h1>
          <p className="text-gray-400">{loading ? "Buscando..." : `${prompts.length} prompts encontrados`}</p>
        </div>

        {/* Filtros */}
        <Card className="bg-gray-900 border-gray-700 mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar prompts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                />
              </div>

              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  <SelectItem value="midjourney">Midjourney</SelectItem>
                  <SelectItem value="chatgpt">ChatGPT</SelectItem>
                  <SelectItem value="dalle">DALL-E</SelectItem>
                  <SelectItem value="claude">Claude</SelectItem>
                  <SelectItem value="stable-diffusion">Stable Diffusion</SelectItem>
                  <SelectItem value="leonardo-ai">Leonardo AI</SelectItem>
                  <SelectItem value="gemini">Gemini</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Preço" />
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

              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Resultados */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">Carregando prompts...</div>
          </div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">Nenhum prompt encontrado</p>
            <p className="text-gray-500">Tente ajustar os filtros ou usar termos diferentes</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {prompts.map((prompt) => (
              <Link
                key={prompt.id}
                href={`/prompt/${prompt.category}/${prompt.slug || prompt.title
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^\w-]/g, "")}`}
              >
                <Card className="hover:shadow-xl transition-shadow group bg-gray-800 border-gray-700 cursor-pointer">
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={prompt.images?.[0] || "/placeholder.jpg"}
                        alt={prompt.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
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
                        <span className="text-sm font-medium text-white">{prompt.rating?.toFixed(1) || '0.0'}</span>
                      </div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        {prompt.isFree ? "Gratuito" : `R$ ${prompt.price?.toFixed(2).replace(".", ",") || '0,00'}`}
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
                          <span>{prompt.downloads || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{prompt.views || 0}</span>
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
    </div>
  )
}