"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, User, ShoppingCart, Settings, Plus, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, logout } from "@/lib/auth"

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
]

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("") // Limpar o campo após a busca
    }
  }

  const handleLogout = () => {
    logout()
    setUser(null)
    router.push("/")
  }

  return (
    <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            Reprompt
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex items-center space-x-2 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
            </div>
            <Button type="submit" size="sm" disabled={!searchQuery.trim()}>
              Buscar
            </Button>
          </form>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/explorar" className="text-gray-300 hover:text-white transition-colors">
              Explorar
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-300 hover:text-white transition-colors">
                  Categorias
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-700">
                {categories.map((category) => (
                  <DropdownMenuItem key={category.slug} asChild>
                    <Link href={`/prompts/${category.slug}`} className="text-gray-300 hover:text-white cursor-pointer">
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/vender" className="text-gray-300 hover:text-white transition-colors">
              Vender
            </Link>
            <Link href="/buscar?priceFilter=free" className="text-gray-300 hover:text-white transition-colors">
              Gratuitos
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-gray-800">
              <ShoppingCart className="w-5 h-5" />
            </Button>

            {user ? (
              <div className="flex items-center space-x-2">
                {user.isAdmin && (
                  <Link href="/admin">
                    <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-gray-800">
                      <Settings className="w-5 h-5" />
                    </Button>
                  </Link>
                )}
                {!user.isAdmin && (
                  <Link href="/dashboard">
                    <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-gray-800">
                      <Plus className="w-5 h-5" />
                    </Button>
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <span className="text-gray-300 text-sm">Olá, {user.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-white hover:bg-gray-800"
                  >
                    Sair
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-gray-800">
                    <User className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Entrar
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
