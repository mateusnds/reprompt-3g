"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, Eye, Palette, Zap } from "lucide-react"
import Image from "next/image"

export function AddPromptForm() {
  const [promptData, setPromptData] = useState({
    title: "Onça-Pintada Amazônica Cinematográfica",
    description:
      "Prompt profissional para gerar imagens ultra-realistas de onças-pintadas na floresta amazônica com qualidade cinematográfica. Perfeito para projetos de natureza, documentários e arte digital.",
    category: "Midjourney",
    price: "34.90",
    prompt:
      "[Jaguar with green eyes stalking prey]::7 [detailed vegetation and waterfall in amazon rainforest background, cinematic shoot, ultrareal, morning light]::3 --ar 16:9 --s 400",
    tags: ["natureza", "animais", "floresta", "amazônia", "cinematográfico", "ultra-realista", "onça", "jaguar"],
    resultImage: "/images/jaguar-prompt-result.png",
  })

  const [newTag, setNewTag] = useState("")

  const addTag = () => {
    if (newTag && !promptData.tags.includes(newTag)) {
      setPromptData({
        ...promptData,
        tags: [...promptData.tags, newTag],
      })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setPromptData({
      ...promptData,
      tags: promptData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Cadastrar Novo Prompt</h1>
          <p className="text-gray-400">Compartilhe seu prompt com a comunidade e comece a vender</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-400" />
                Detalhes do Prompt
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-white">
                  Título do Prompt
                </Label>
                <Input
                  id="title"
                  value={promptData.title}
                  onChange={(e) => setPromptData({ ...promptData, title: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-white">
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  value={promptData.description}
                  onChange={(e) => setPromptData({ ...promptData, description: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white mt-2 min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category" className="text-white">
                    Categoria
                  </Label>
                  <Select
                    value={promptData.category}
                    onValueChange={(value) => setPromptData({ ...promptData, category: value })}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="Midjourney">Midjourney</SelectItem>
                      <SelectItem value="DALL-E">DALL-E</SelectItem>
                      <SelectItem value="Stable Diffusion">Stable Diffusion</SelectItem>
                      <SelectItem value="Leonardo AI">Leonardo AI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="price" className="text-white">
                    Preço (R$)
                  </Label>
                  <Input
                    id="price"
                    value={promptData.price}
                    onChange={(e) => setPromptData({ ...promptData, price: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white mt-2"
                    placeholder="29.90"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="prompt" className="text-white">
                  Prompt Completo
                </Label>
                <Textarea
                  id="prompt"
                  value={promptData.prompt}
                  onChange={(e) => setPromptData({ ...promptData, prompt: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white mt-2 min-h-[120px] font-mono text-sm"
                />
              </div>

              <div>
                <Label className="text-white">Tags</Label>
                <div className="flex gap-2 mt-2 mb-3">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Adicionar tag..."
                    className="bg-gray-800 border-gray-700 text-white"
                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                  />
                  <Button onClick={addTag} size="sm" className="bg-purple-600 hover:bg-purple-700">
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {promptData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-300">
                      {tag}
                      <X className="w-3 h-3 ml-1 cursor-pointer hover:text-red-400" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Publicar Prompt
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-blue-400" />
                  Preview do Prompt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Imagem de resultado */}
                  <div className="relative overflow-hidden rounded-lg">
                    <Image
                      src={promptData.resultImage || "/placeholder.svg"}
                      alt="Resultado do prompt"
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover"
                    />
                    <Badge className="absolute top-3 left-3 bg-gray-900/80 text-white border border-gray-600">
                      {promptData.category}
                    </Badge>
                  </div>

                  {/* Detalhes */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <div className="flex text-yellow-400">{"★".repeat(5)}</div>
                        <span className="text-sm font-medium text-white">Novo</span>
                      </div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        R$ {promptData.price}
                      </div>
                    </div>

                    <h3 className="font-bold text-lg text-white">{promptData.title}</h3>
                    <p className="text-gray-400 text-sm">{promptData.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {promptData.tags.slice(0, 4).map((tag, index) => (
                        <Badge key={index} variant="outline" className="border-gray-600 text-gray-400">
                          {tag}
                        </Badge>
                      ))}
                      {promptData.tags.length > 4 && (
                        <Badge variant="outline" className="border-gray-600 text-gray-400">
                          +{promptData.tags.length - 4}
                        </Badge>
                      )}
                    </div>

                    {/* Prompt preview */}
                    <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                      <Label className="text-gray-400 text-xs">PROMPT:</Label>
                      <p className="text-gray-300 text-sm font-mono mt-1 line-clamp-3">{promptData.prompt}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas esperadas */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Potencial de Vendas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-400">Alta</div>
                    <div className="text-sm text-gray-400">Demanda</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">8.5/10</div>
                    <div className="text-sm text-gray-400">Qualidade</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">15K+</div>
                    <div className="text-sm text-gray-400">Categoria</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-400">R$ 200+</div>
                    <div className="text-sm text-gray-400">Potencial/mês</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
