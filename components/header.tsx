
"use client"

import { useState } from "react"
import { Search, Menu, User, LogOut, Settings, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getCurrentUser, logout } from "@/lib/auth"

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const user = getCurrentUser()
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const navLinks = [
    { href: "/", label: "Início" },
    { href: "/explorar", label: "Explorar" },
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
  ]

  return (
    <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <span className="text-white font-bold text-xl">RePrompt</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-gray-300 hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center max-w-md mx-4 flex-1">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Buscar prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-400 focus:border-purple-500"
            />
          </div>
          <Button type="submit" size="sm" className="ml-2 bg-purple-600 hover:bg-purple-700">
            Buscar
          </Button>
        </form>

        {/* User Menu / Auth */}
        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-white">{user.name}</p>
                    <p className="w-[200px] truncate text-sm text-gray-400">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem asChild className="text-gray-300 hover:text-white hover:bg-gray-800">
                  <Link href="/dashboard" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                {user.isAdmin && (
                  <DropdownMenuItem asChild className="text-gray-300 hover:text-white hover:bg-gray-800">
                    <Link href="/admin" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-gray-800">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild className="text-gray-300 hover:text-white">
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Link href="/login">Cadastrar</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-gray-300">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-gray-900 border-gray-700">
              <div className="flex flex-col space-y-4 mt-4">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Buscar prompts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <Button type="submit" size="sm" className="bg-purple-600 hover:bg-purple-700">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>

                {/* Mobile Navigation */}
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-gray-300 hover:text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}

                {user && (
                  <>
                    <div className="border-t border-gray-700 pt-4">
                      <Link
                        href="/dashboard"
                        className="text-gray-300 hover:text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                      {user.isAdmin && (
                        <Link
                          href="/admin"
                          className="text-gray-300 hover:text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center"
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Admin
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="text-red-400 hover:text-red-300 py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center w-full text-left"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                      </button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Header
