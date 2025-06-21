
"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Star, Download, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface PromptCardProps {
  id: string
  title: string
  description: string
  price: number
  category: string
  author: {
    name: string
    avatar?: string
    username: string
  }
  preview: string
  rating: number
  downloads: number
  views: number
  tags: string[]
  isFavorited?: boolean
  onFavorite?: (id: string) => void
}

export function PromptCard({
  id,
  title,
  description,
  price,
  category,
  author,
  preview,
  rating,
  downloads,
  views,
  tags,
  isFavorited = false,
  onFavorite
}: PromptCardProps) {
  const [isLiked, setIsLiked] = useState(isFavorited)

  const handleFavorite = () => {
    setIsLiked(!isLiked)
    onFavorite?.(id)
  }

  return (
    <Card className="group bg-gray-800 border-gray-700 hover:border-purple-500 transition-all duration-300 overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={preview}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        
        {/* Price Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={price === 0 ? "secondary" : "default"} className="bg-black/70 text-white">
            {price === 0 ? "Gratuito" : `$${price}`}
          </Badge>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-black/70 text-white border-white/20">
            {category}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            className="bg-black/70 hover:bg-black/90 text-white"
            onClick={handleFavorite}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="bg-black/70 hover:bg-black/90 text-white"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={author.avatar} />
            <AvatarFallback>{author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm truncate">{title}</h3>
            <p className="text-gray-400 text-xs">por {author.name}</p>
          </div>
        </div>

        <p className="text-gray-300 text-sm line-clamp-2 mb-3">{description}</p>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
            <span>{rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            <span>{downloads}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{views}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
              +{tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={`/prompt/${category}/${id}`} className="w-full">
          <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            {price === 0 ? "Baixar Gratuito" : `Comprar por $${price}`}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
