"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Download, Eye, ArrowRight } from "lucide-react"
import Link from "next/link"
import { getAllPrompts } from "@/lib/prompts-storage"
import type { Prompt } from "@/lib/types"
import { VideoPreview } from "@/components/video-preview"

export function FeaturedPrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)

  const loadPrompts = () => {
    try {
      const allPrompts = getAllPrompts()
      // Enhanced sorting to prioritize video prompts and official content
      const featured = allPrompts
        .filter((prompt) => prompt.isActive)
        .sort((a, b) => {
          // First priority: Video prompts
          if (a.videoUrl && !b.videoUrl) return -1
          if (!a.videoUrl && b.videoUrl) return 1

          // Second priority: Official prompts
          if (a.isAdminCreated && !b.isAdminCreated) return -1
          if (!a.isAdminCreated && b.isAdminCreated) return 1

          // Third priority: Rating
          if (Math.abs(a.rating - b.rating) > 0.1) return b.rating - a.rating

          // Fourth priority: Recent creation date
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })
        .slice(0, 12) // Exactly 12 prompts

      setPrompts(featured)
    } catch (error) {
      console.error("Erro ao carregar prompts em destaque:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPrompts()

    // Listen for prompt updates
    const handlePromptsUpdate = () => {
      loadPrompts()
    }

    window.addEventListener("promptsUpdated", handlePromptsUpdate)

    return () => {
      window.removeEventListener("promptsUpdated", handlePromptsUpdate)
    }
  }, [])

  if (loading) {
    return (
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center text-white">Carregando prompts em destaque...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="px-4 py-0">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          
          
        </div>

        {/* 12 Featured Prompts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {prompts.map((prompt) => (
            <Link
              key={prompt.id}
              href={`/prompt/${prompt.category}/${prompt.title
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^\w-]/g, "")}`}
            >
              <Card className="hover:shadow-xl transition-all duration-300 group bg-gray-800 border-gray-700 cursor-pointer hover:border-purple-500/50 h-full">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    {prompt.videoUrl ? (
                      <VideoPreview
                        videoUrl={prompt.videoUrl}
                        thumbnailUrl={prompt.images[0] || "/placeholder.svg"}
                        title={prompt.title}
                        className="w-full h-40"
                      />
                    ) : (
                      <img
                        src={prompt.images[0] || "/placeholder.svg"}
                        alt={prompt.title}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <div className="absolute top-2 left-2 flex gap-1">
                      <Badge className="bg-gray-900/90 text-white border border-gray-600 text-xs px-2 py-1">
                        {prompt.category}
                      </Badge>
                      {prompt.isFree && <Badge className="bg-green-600 text-white text-xs px-2 py-1">Gratuito</Badge>}
                      {prompt.isAdminCreated && (
                        <Badge className="bg-blue-600 text-white text-xs px-2 py-1">Oficial</Badge>
                      )}
                      {prompt.videoUrl && <Badge className="bg-purple-600 text-white text-xs px-2 py-1">VÍDEO</Badge>}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    {/* Title - Main Focus */}
                    <h3 className="font-bold text-base mb-3 group-hover:text-purple-400 transition-colors text-white line-clamp-2 min-h-[3rem]">
                      {prompt.title}
                    </h3>

                    {/* Rating and Price */}
                    

                    {/* Stats */}
                    
                  </div>

                  {/* Bottom Section */}
                  <div className="flex items-center justify-between mt-auto">
                    
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-xs px-3 py-1"
                    >
                      {prompt.isFree ? "Baixar" : "Comprar"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/explorar">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-3"
            >
              Ver Todos os Prompts
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
