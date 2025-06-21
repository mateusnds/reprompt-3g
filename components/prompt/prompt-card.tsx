"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Download, Eye, Heart, DollarSign, Crown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import type { Prompt } from "@/lib/types"

interface PromptCardProps {
  prompt: Prompt
  size?: "default" | "large"
}

export function PromptCard({ prompt, size = "default" }: PromptCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [imageError, setImageError] = useState(false)

  const cardClasses = size === "large" 
    ? "group cursor-pointer hover:shadow-2xl transition-all duration-300" 
    : "group cursor-pointer hover:shadow-xl transition-all duration-300"

  return (
    <Card className={`${cardClasses} bg-gray-900 border-gray-700 hover:border-gray-600 overflow-hidden`}>
      <div className="relative">
        {/* Image */}
        <div className="relative overflow-hidden">
          <Image
            src={imageError ? "/placeholder.svg" : (prompt.images[0] || "/placeholder.svg")}
            alt={prompt.title}
            width={400}
            height={size === "large" ? 300 : 240}
            className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              size === "large" ? "h-[300px]" : "h-[240px]"
            }`}
            onError={() => setImageError(true)}
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button 
              asChild
              className="bg-white text-black hover:bg-gray-200 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            >
              <Link href={`/prompt/${prompt.category}/${prompt.id}`}>
                Ver Detalhes
              </Link>
            </Button>
          </div>
        </div>

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {prompt.isFree && (
            <Badge className="bg-green-600 text-white border-0 text-xs font-medium">
              Gratuito
            </Badge>
          )}
          {prompt.isAdminCreated && (
            <Badge className="bg-blue-600 text-white border-0 text-xs font-medium flex items-center gap-1">
              <Crown className="w-3 h-3" />
              Oficial
            </Badge>
          )}
        </div>

        {/* Heart button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white"
          onClick={(e) => {
            e.preventDefault()
            setIsLiked(!isLiked)
          }}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
        </Button>

        {/* Price */}
        <div className="absolute bottom-3 right-3">
          <Badge className="bg-black/70 text-white border-0 text-sm font-semibold">
            {prompt.isFree ? "Grátis" : `$${prompt.price}`}
          </Badge>
        </div>
      </div>

      
      <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-white text-lg leading-tight group-hover:text-purple-400 transition-colors line-clamp-2">
                {prompt.title}
              </h3>
              <div className="flex flex-col gap-1 ml-2 flex-shrink-0">
                {prompt.isPaid && (
                  <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">
                    Premium
                  </Badge>
                )}
                {prompt.featured && (
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">
                    ⭐ Destaque
                  </Badge>
                )}
              </div>
            </div>

            <p className="text-gray-400 text-sm mb-3 line-clamp-2">
              {prompt.description}
            </p>

            {/* Quality Indicators */}
            <div className="flex items-center gap-3 mb-3 text-xs">
              <div className="flex items-center gap-1 text-green-400">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Testado</span>
              </div>
              <div className="flex items-center gap-1 text-blue-400">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Aprovado</span>
              </div>
              {prompt.downloads > 1000 && (
                <div className="flex items-center gap-1 text-purple-400">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
                  <span>Popular</span>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {prompt.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-400 hover:border-gray-500 transition-colors">
                  {tag}
                </Badge>
              ))}
              {prompt.tags.length > 3 && (
                <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                  +{prompt.tags.length - 3}
                </Badge>
              )}
            </div>
      

      <CardContent className="p-4">
        {/* Category */}
        <Badge variant="outline" className="border-gray-600 text-gray-300 text-xs mb-3">
          {prompt.category}
        </Badge>

        {/* Title */}
        <Link href={`/prompt/${prompt.category}/${prompt.id}`}>
          <h3 className={`font-semibold text-white mb-2 line-clamp-2 hover:text-purple-300 transition-colors ${
            size === "large" ? "text-lg" : "text-base"
          }`}>
            {prompt.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {prompt.description}
        </p>

        
            {/* Author Info */}
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-700">
              <img 
                src={prompt.authorAvatar} 
                alt={`Avatar de ${prompt.author}`}
                className="w-6 h-6 rounded-full object-cover"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 truncate">
                  Por <span className="text-gray-300 font-medium">{prompt.author}</span>
                </p>
                <p className="text-xs text-gray-500">
                  Especialista em {prompt.category}
                </p>
              </div>
            </div>

            {/* Stats and Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1" title={`Avaliação: ${prompt.rating} de 5 estrelas`}>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-white font-medium">{prompt.rating}</span>
                </div>
                <div className="flex items-center gap-1" title={`${prompt.downloads.toLocaleString()} downloads`}>
                  <Download className="w-4 h-4" />
                  <span>{prompt.downloads > 999 ? `${(prompt.downloads/1000).toFixed(1)}k` : prompt.downloads}</span>
                </div>
                <div className="flex items-center gap-1" title={`${prompt.views.toLocaleString()} visualizações`}>
                  <Eye className="w-4 h-4" />
                  <span>{prompt.views > 999 ? `${(prompt.views/1000).toFixed(1)}k` : prompt.views}</span>
                </div>
              </div>

              <div className="text-right">
                {prompt.isPaid ? (
                  <div>
                    <span className="text-xl font-bold text-white">
                      R$ {prompt.price.toFixed(2)}
                    </span>
                    <p className="text-xs text-gray-500">Licença comercial inclusa</p>
                  </div>
                ) : (
                  <div>
                    <span className="text-lg font-semibold text-green-400">
                      Gratuito
                    </span>
                    <p className="text-xs text-gray-500">Uso pessoal</p>
                  </div>
                )}
              </div>
            </div>
      </CardContent>
    </Card>
  )
}