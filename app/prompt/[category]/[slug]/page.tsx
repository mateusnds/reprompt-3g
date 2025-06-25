
"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Star, Download, Eye, Heart, Share2, Copy, Check, ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VideoPreview } from "@/components/video-preview"
import Link from "next/link"
import { getPromptBySlug, incrementViews, incrementDownloads } from "@/lib/prompts-storage"
import type { Prompt } from "@/lib/types"

interface PromptPageProps {
  params: Promise<{
    category: string
    slug: string
  }>
}

export default function PromptPage({ params }: PromptPageProps) {
  const resolvedParams = use(params)
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [purchased, setPurchased] = useState(false)

  useEffect(() => {
    const loadPrompt = async () => {
      try {
        const foundPrompt = await getPromptBySlug(resolvedParams.slug)
        setPrompt(foundPrompt)
        setLoading(false)

        if (foundPrompt) {
          await incrementViews(foundPrompt.id)
        }
      } catch (error) {
        console.error('Erro ao carregar prompt:', error)
        setLoading(false)
      }
    }

    loadPrompt()
  }, [resolvedParams.slug])

  const handleCopy = async () => {
    if (prompt) {
      await navigator.clipboard.writeText(prompt.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    if (prompt) {
      incrementDownloads(prompt.id)
      setPurchased(true)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-800 rounded mb-6"></div>
            <div className="h-4 bg-gray-800 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-800 rounded w-1/2"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Prompt não encontrado</h1>
          <p className="text-gray-400 mb-6">O prompt que você está procurando não existe ou foi removido.</p>
          <Link href="/explorar">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Explorar Prompts
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const canViewPrompt = prompt.isFree || purchased

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-white">Início</Link>
          <span>/</span>
          <Link href="/explorar" className="hover:text-white">Explorar</Link>
          <span>/</span>
          <Link href={`/prompts/${resolvedParams.category}`} className="hover:text-white capitalize">
            {resolvedParams.category}
          </Link>
          <span>/</span>
          <span className="text-white">{prompt.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Imagem/Vídeo Principal */}
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-xl mb-6">
              {prompt.videoUrl ? (
                <VideoPreview
                  videoUrl={prompt.videoUrl}
                  thumbnailUrl={prompt.images?.[0] || "/placeholder.jpg"}
                  title={prompt.title}
                  className="w-full h-96"
                />
              ) : (
                <img
                  src={prompt.images?.[0] || "/placeholder.jpg"}
                  alt={prompt.title}
                  className="w-full h-96 object-cover"
                />
              )}
              
              {/* Tags sobre a imagem */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <Badge className="bg-gray-900/80 text-white border border-gray-600">
                  {resolvedParams.category}
                </Badge>
                {prompt.isFree && (
                  <Badge className="bg-green-600 text-white">
                    Gratuito
                  </Badge>
                )}
              </div>

              {/* Ações sobre a imagem */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button size="icon" variant="secondary" className="bg-gray-900/80 border border-gray-600">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="secondary" className="bg-gray-900/80 border border-gray-600">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Título e Descrição */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-4">{prompt.title}</h1>
              <p className="text-gray-300 text-lg leading-relaxed">{prompt.description}</p>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Prompt */}
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Prompt</h3>
                  {canViewPrompt && (
                    <Button
                      onClick={handleCopy}
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copiar
                        </>
                      )}
                    </Button>
                  )}
                </div>
                
                {canViewPrompt ? (
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <code className="text-gray-300 whitespace-pre-wrap font-mono text-sm">
                      {prompt.content}
                    </code>
                  </div>
                ) : (
                  <div className="bg-gray-800 p-6 rounded-lg text-center">
                    <p className="text-gray-400 mb-4">
                      Compre este prompt para ver o conteúdo completo
                    </p>
                    <div className="bg-gray-700 p-3 rounded blur-sm">
                      <code className="text-gray-500 font-mono text-sm">
                        {prompt.content?.substring(0, 50) || ''}...
                      </code>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border-gray-700 sticky top-24">
              <CardContent className="p-6">
                {/* Preço */}
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                    {prompt.isFree ? "Gratuito" : `R$ ${prompt.price.toFixed(2)}`}
                  </div>
                  {!prompt.isFree && (
                    <p className="text-gray-400 text-sm">Pagamento único</p>
                  )}
                </div>

                {/* Botão de Compra/Download */}
                {canViewPrompt ? (
                  <Button 
                    onClick={handleCopy}
                    className="w-full mb-4 bg-green-600 hover:bg-green-700"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar Prompt
                  </Button>
                ) : (
                  <Button 
                    onClick={handleDownload}
                    className="w-full mb-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {prompt.isFree ? "Baixar Grátis" : "Comprar Agora"}
                  </Button>
                )}

                <Separator className="bg-gray-700 my-6" />

                {/* Estatísticas */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-gray-300">Avaliação</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-white font-semibold">{prompt.rating}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= Math.floor(prompt.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Download className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300">Downloads</span>
                    </div>
                    <span className="text-white font-semibold">{prompt.downloads.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">Visualizações</span>
                    </div>
                    <span className="text-white font-semibold">{prompt.views.toLocaleString()}</span>
                  </div>
                </div>

                <Separator className="bg-gray-700 my-6" />

                {/* Autor */}
                <div>
                  <h4 className="text-white font-semibold mb-3">Autor</h4>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {prompt.author.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{prompt.author}</p>
                      <p className="text-gray-400 text-sm">Criador verificado</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
