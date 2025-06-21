
"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Download, Eye, Copy, Heart, Share2, User, Calendar } from "lucide-react"
import Link from "next/link"
import { getPromptBySlug, incrementViews } from "@/lib/prompts-storage"
import { getPromptRatingStats } from "@/lib/reviews-storage"
import { formatDate } from "@/lib/utils"
import type { Prompt } from "@/lib/types"
import Image from "next/image"
import { ReviewsSection } from "@/components/reviews-section"
import { simulatePurchase } from "@/lib/reviews-storage"
import { getCurrentUser } from "@/lib/auth"
import { VideoPreview } from "@/components/video-preview"
import { use } from "react"

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
  const [copySuccess, setCopySuccess] = useState(false)
  const [ratingStats, setRatingStats] = useState<any>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    const loadPrompt = () => {
      const foundPrompt = getPromptBySlug(resolvedParams.category, resolvedParams.slug)
      if (foundPrompt) {
        setPrompt(foundPrompt)
        incrementViews(foundPrompt.id)
        const stats = getPromptRatingStats(foundPrompt.id)
        setRatingStats(stats)
      }
      setLoading(false)
    }

    loadPrompt()
  }, [resolvedParams.category, resolvedParams.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    )
  }

  if (!prompt) {
    notFound()
  }

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error("Erro ao copiar:", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-white">
          Início
        </Link>
        <span>/</span>
        <Link href="/explorar" className="hover:text-white">
          Explorar
        </Link>
        <span>/</span>
        <Link href={`/prompts/${resolvedParams.category}`} className="hover:text-white capitalize">
          {resolvedParams.category}
        </Link>
        <span>/</span>
        <span className="text-white">{prompt.title}</span>
      </nav>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Conteúdo Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Imagens/Vídeo */}
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-0">
              <div className="relative">
                {prompt.videoUrl ? (
                  <VideoPreview
                    videoUrl={prompt.videoUrl}
                    thumbnailUrl={prompt.images?.[0] || "/placeholder.svg"}
                    title={prompt.title}
                    className="w-full h-96"
                  />
                ) : (
                  <Image
                    src={prompt.images?.[0] || "/placeholder.svg"}
                    alt={prompt.title}
                    width={800}
                    height={400}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-gray-900/80 text-white border border-gray-600">{prompt.category}</Badge>
                  {prompt.isFree && <Badge className="bg-green-600 text-white">Gratuito</Badge>}
                  {prompt.isAdminCreated && <Badge className="bg-blue-600 text-white">Oficial</Badge>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Título e Descrição */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{prompt.title}</h1>
            <p className="text-gray-300 text-lg leading-relaxed">{prompt.description}</p>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-white font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {prompt.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="border-gray-600 text-gray-400">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Prompt */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Prompt Completo
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyPrompt}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copySuccess ? "Copiado!" : "Copiar"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <code className="text-gray-300 text-sm font-mono whitespace-pre-wrap">{prompt.prompt}</code>
              </div>
            </CardContent>
          </Card>

          {/* Instruções de Uso */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Como Usar</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-3">
              <p>1. Copie o prompt completo acima</p>
              <p>2. Cole no {prompt.category} ou ferramenta de IA de sua escolha</p>
              <p>3. Substitua os parâmetros entre colchetes pelos seus valores</p>
              <p>4. Execute e ajuste conforme necessário</p>
            </CardContent>
          </Card>

          {/* Seção de Avaliações e Comentários */}
          <ReviewsSection promptId={prompt.id} promptTitle={prompt.title} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Compra/Download */}
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {prompt.isFree ? "Gratuito" : `R$ ${prompt.price.toFixed(2).replace(".", ",")}`}
                </div>

                <Button
                  onClick={() => {
                    if (prompt.isFree && user) {
                      simulatePurchase(prompt.id, user.id)
                      alert("Download realizado! Agora você pode avaliar este prompt.")
                    } else if (!prompt.isFree) {
                      alert("Sistema de pagamento em desenvolvimento")
                    } else {
                      alert("Faça login para baixar")
                    }
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  size="lg"
                >
                  {prompt.isFree ? "Baixar Gratuito" : "Comprar Agora"}
                </Button>

                <div className="flex justify-center space-x-4 text-sm">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Heart className="w-4 h-4 mr-1" />
                    Favoritar
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Share2 className="w-4 h-4 mr-1" />
                    Compartilhar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-300">Avaliação</span>
                </div>
                <span className="text-white font-semibold">
                  {ratingStats && ratingStats.totalReviews > 0
                    ? `${ratingStats.averageRating}/5 (${ratingStats.totalReviews})`
                    : "Sem avaliações"}
                </span>
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
            </CardContent>
          </Card>

          {/* Autor */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Autor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold">{prompt.author}</div>
                  <div className="text-gray-400 text-sm flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(prompt.createdAt)}
                  </div>
                </div>
              </div>

              <Link href={`/autor/${prompt.authorId}`}>
                <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                  Ver Perfil
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
