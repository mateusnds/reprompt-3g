
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getCategories } from "@/lib/database"

interface Category {
  id: string
  name: string
  slug: string
  count?: number
}

interface CategoryNavProps {
  showCounts?: boolean
}

export function CategoryNav({ showCounts = false }: CategoryNavProps) {
  const pathname = usePathname()
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (error) {
        console.error('Erro ao carregar categorias:', error)
      }
    }
    loadCategories()
  }, [])

  return (
    <div className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <ScrollArea className="w-full">
          <div className="flex items-center space-x-4 py-4">
            <Link href="/buscar">
              <Button
                variant={pathname === "/buscar" ? "default" : "ghost"}
                size="sm"
                className="text-white whitespace-nowrap"
              >
                Todos
                {showCounts && <Badge variant="secondary" className="ml-2">1000+</Badge>}
              </Button>
            </Link>
            
            {categories.map((category) => {
              const isActive = pathname === `/prompts/${category.slug}`
              
              return (
                <Link key={category.slug} href={`/prompts/${category.slug}`}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="text-white whitespace-nowrap"
                  >
                    {category.name}
                    {showCounts && category.count && (
                      <Badge variant="secondary" className="ml-2">
                        {category.count}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
