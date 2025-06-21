
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Filter, X, Star, DollarSign, Calendar, TrendingUp } from "lucide-react"
import { useState } from "react"

interface FiltersSidebarProps {
  onFiltersChange: (filters: any) => void
  className?: string
}

export function FiltersSidebar({ onFiltersChange, className }: FiltersSidebarProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 100])
  const [selectedPriceType, setSelectedPriceType] = useState<string>("all")
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState("newest")

  const categories = [
    { name: "Midjourney", count: 15800 },
    { name: "ChatGPT", count: 22400 },
    { name: "DALL-E", count: 11200 },
    { name: "Claude", count: 9700 },
    { name: "Stable Diffusion", count: 13500 },
    { name: "Leonardo AI", count: 7900 },
    { name: "Gemini", count: 6500 },
    { name: "Grok", count: 4200 },
  ]

  const handleCategoryToggle = (category: string) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category]
    setSelectedCategories(updated)
    updateFilters({ categories: updated })
  }

  const updateFilters = (updates: any) => {
    onFiltersChange({
      categories: selectedCategories,
      priceRange,
      priceType: selectedPriceType,
      minRating,
      sortBy,
      ...updates
    })
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 100])
    setSelectedPriceType("all")
    setMinRating(0)
    setSortBy("newest")
    onFiltersChange({})
  }

  const activeFiltersCount = 
    selectedCategories.length + 
    (selectedPriceType !== "all" ? 1 : 0) + 
    (minRating > 0 ? 1 : 0)

  return (
    <Card className={`bg-gray-900 border-gray-700 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Sort By */}
        <div>
          <Label className="text-white font-medium mb-3 block">Ordenar por</Label>
          <div className="space-y-2">
            {[
              { value: "newest", label: "Mais Recentes", icon: Calendar },
              { value: "rating", label: "Melhor Avaliados", icon: Star },
              { value: "downloads", label: "Mais Baixados", icon: TrendingUp },
              { value: "price-low", label: "Menor Preço", icon: DollarSign },
              { value: "price-high", label: "Maior Preço", icon: DollarSign },
            ].map((option) => {
              const Icon = option.icon
              return (
                <Button
                  key={option.value}
                  variant={sortBy === option.value ? "default" : "ghost"}
                  className={`w-full justify-start text-left ${
                    sortBy === option.value 
                      ? "bg-purple-600 text-white" 
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                  onClick={() => {
                    setSortBy(option.value)
                    updateFilters({ sortBy: option.value })
                  }}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {option.label}
                </Button>
              )
            })}
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* Price Type */}
        <div>
          <Label className="text-white font-medium mb-3 block">Tipo de Preço</Label>
          <div className="space-y-2">
            {[
              { value: "all", label: "Todos" },
              { value: "free", label: "Gratuitos" },
              { value: "paid", label: "Pagos" },
            ].map((option) => (
              <Button
                key={option.value}
                variant={selectedPriceType === option.value ? "default" : "ghost"}
                className={`w-full justify-start ${
                  selectedPriceType === option.value 
                    ? "bg-purple-600 text-white" 
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
                onClick={() => {
                  setSelectedPriceType(option.value)
                  updateFilters({ priceType: option.value })
                }}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* Price Range */}
        {selectedPriceType === "paid" && (
          <>
            <div>
              <Label className="text-white font-medium mb-3 block">
                Faixa de Preço: ${priceRange[0]} - ${priceRange[1]}
              </Label>
              <Slider
                value={priceRange}
                onValueChange={(value) => {
                  setPriceRange(value)
                  updateFilters({ priceRange: value })
                }}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>$0</span>
                <span>$100+</span>
              </div>
            </div>
            <Separator className="bg-gray-700" />
          </>
        )}

        {/* Rating */}
        <div>
          <Label className="text-white font-medium mb-3 block">
            Avaliação Mínima
          </Label>
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <Button
                key={rating}
                variant={minRating === rating ? "default" : "ghost"}
                className={`w-full justify-start ${
                  minRating === rating 
                    ? "bg-purple-600 text-white" 
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
                onClick={() => {
                  const newRating = minRating === rating ? 0 : rating
                  setMinRating(newRating)
                  updateFilters({ minRating: newRating })
                }}
              >
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 mr-1 ${
                        i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                      }`}
                    />
                  ))}
                  <span className="ml-2">& mais</span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <Separator className="bg-gray-700" />

        {/* Categories */}
        <div>
          <Label className="text-white font-medium mb-3 block">Categorias</Label>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {categories.map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={category.name}
                    checked={selectedCategories.includes(category.name)}
                    onCheckedChange={() => handleCategoryToggle(category.name)}
                    className="border-gray-600"
                  />
                  <Label
                    htmlFor={category.name}
                    className="text-gray-300 cursor-pointer hover:text-white flex-1"
                  >
                    {category.name}
                  </Label>
                </div>
                <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                  {category.count.toLocaleString()}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
