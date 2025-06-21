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

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{prompt.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              <span>{prompt.downloads}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{prompt.views}</span>
            </div>
          </div>
        </div>

        {/* Author */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="text-xs bg-gray-700 text-gray-300">
                {prompt.author.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-400">
              por {prompt.author}
            </span>
          </div>

          {!prompt.isFree && (
            <div className="flex items-center gap-1 text-green-400">
              <DollarSign className="w-3 h-3" />
              <span className="text-xs font-medium">{prompt.price}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}