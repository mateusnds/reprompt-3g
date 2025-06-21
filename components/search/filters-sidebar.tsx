
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X } from "lucide-react"

interface FiltersSidebarProps {
  categories: string[]
  selectedCategories: string[]
  priceRange: [number, number]
  selectedTags: string[]
  availableTags: string[]
  onCategoryChange: (category: string) => void
  onPriceRangeChange: (range: [number, number]) => void
  onTagChange: (tag: string) => void
  onClearFilters: () => void
}

export function FiltersSidebar({
  categories,
  selectedCategories,
  priceRange,
  selectedTags,
  availableTags,
  onCategoryChange,
  onPriceRangeChange,
  onTagChange,
  onClearFilters
}: FiltersSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {(selectedCategories.length > 0 || selectedTags.length > 0) && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-sm">Filtros Ativos</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-gray-400 hover:text-white"
              >
                Limpar Tudo
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {selectedCategories.map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="bg-purple-600 text-white flex items-center gap-1 w-fit"
              >
                {category}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-gray-300"
                  onClick={() => onCategoryChange(category)}
                />
              </Badge>
            ))}
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-gray-300 border-gray-600 flex items-center gap-1 w-fit"
              >
                {tag}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-gray-500"
                  onClick={() => onTagChange(tag)}
                />
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Categories */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-sm">Categorias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => onCategoryChange(category)}
              />
              <label
                htmlFor={category}
                className="text-gray-300 text-sm cursor-pointer flex-1"
              >
                {category}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-sm">Faixa de Preço</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={onPriceRangeChange}
              max={100}
              min={0}
              step={1}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPriceRangeChange([0, 0])}
              className="text-xs"
            >
              Gratuito
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPriceRangeChange([1, 100])}
              className="text-xs"
            >
              Pago
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Popular Tags */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-sm">Tags Populares</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {availableTags.slice(0, 15).map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className={`cursor-pointer text-xs ${
                  selectedTags.includes(tag)
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 border-gray-600 hover:border-gray-500"
                }`}
                onClick={() => onTagChange(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
