
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Calendar, Eye, User, BookOpen, TrendingUp } from "lucide-react"
import { getBlogPosts, getFeaturedBlogPosts } from "@/lib/database"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import type { DatabaseBlogPost } from "@/lib/database"

export default function BlogPage() {
  const [posts, setPosts] = useState<DatabaseBlogPost[]>([])
  const [featuredPosts, setFeaturedPosts] = useState<DatabaseBlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<DatabaseBlogPost[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")

  useEffect(() => {
    const allPosts = getBlogPosts().filter(p => p.published)
    const featured = getFeaturedBlogPosts()
    setPosts(allPosts)
    setFeaturedPosts(featured)
    setFilteredPosts(allPosts)
  }, [])

  useEffect(() => {
    let filtered = posts

    // Filter by category
    if (selectedCategory !== "Todos") {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    setFilteredPosts(filtered)
  }, [posts, selectedCategory, searchQuery])

  const categories = Array.from(new Set(posts.map(post => post.category)))

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-purple-400" />
            <span className="text-purple-400 font-semibold text-lg">Blog RePrompt</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Insights e 
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Novidades</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Descubra as últimas tendências em IA, tutoriais exclusivos e dicas para maximizar seus resultados com prompts
          </p>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Posts em Destaque</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="bg-gray-900 border-gray-700 hover:border-purple-500/50 transition-all duration-300 h-full group cursor-pointer">
                    <CardHeader className="p-0">
                      <div className="relative h-48 bg-gradient-to-br from-purple-600 to-blue-600 rounded-t-lg">
                        <div className="absolute inset-0 bg-black/20 rounded-t-lg" />
                        <Badge className="absolute top-4 left-4 bg-yellow-500 text-black">
                          Destaque
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="border-gray-600 text-gray-400">
                          {post.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-gray-400 text-sm">
                          <Calendar className="w-4 h-4" />
                          {formatDate(post.createdAt)}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={post.authorAvatar} />
                            <AvatarFallback>
                              <User className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-gray-300 text-sm">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400 text-sm">
                          <Eye className="w-4 h-4" />
                          {post.views.toLocaleString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar artigos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-400 h-12"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "Todos" ? "default" : "outline"}
              onClick={() => setSelectedCategory("Todos")}
              className={selectedCategory === "Todos" 
                ? "bg-purple-600 hover:bg-purple-700 text-white" 
                : "border-gray-600 text-gray-300 hover:bg-gray-800"
              }
            >
              Todos
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category 
                  ? "bg-purple-600 hover:bg-purple-700 text-white" 
                  : "border-gray-600 text-gray-300 hover:bg-gray-800"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* All Posts */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Todos os Artigos</h2>
          
          {filteredPosts.length === 0 ? (
            <Card className="bg-gray-900 border-gray-700 text-center py-12">
              <CardContent>
                <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Nenhum artigo encontrado
                </h3>
                <p className="text-gray-400">
                  Tente ajustar sua busca ou explore outras categorias
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="bg-gray-900 border-gray-700 hover:border-purple-500/50 transition-all duration-300 h-full group cursor-pointer">
                    <CardHeader className="p-0">
                      <div className="relative h-40 bg-gradient-to-br from-gray-700 to-gray-800 rounded-t-lg">
                        <div className="absolute inset-0 bg-black/20 rounded-t-lg" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="border-gray-600 text-gray-400">
                          {post.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-gray-400 text-sm">
                          <Calendar className="w-4 h-4" />
                          {formatDate(post.createdAt)}
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-3 group-hover:text-purple-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={post.authorAvatar} />
                            <AvatarFallback>
                              <User className="w-3 h-3" />
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-gray-300 text-sm">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400 text-sm">
                          <Eye className="w-4 h-4" />
                          {post.views.toLocaleString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
