"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { X, Eye, Palette, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { getCurrentUser } from "@/lib/auth"
import { addPrompt } from "@/lib/prompts-storage"
import { getActiveTags } from "@/lib/tags-storage"
import type { Tag } from "@/lib/tags-storage"
import type { Prompt } from "@/lib/types"

function NovoPromptContent() {
  const [promptData, setPromptData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    prompt: "",
    tags: [] as string[],
    isFree: true,
    resultImage: "",
  })

  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const user = getCurrentUser()

  useEffect(() => {
    // Carregar tags disponíveis
    const tags = getActiveTags()
    setAvailableTags(tags)
  }, [])

  const addTag = (tagName: string) => {
    if (tagName && !selectedTags.includes(tagName)) {
      setSelectedTags([...selectedTags, tagName])
    }
  }

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validações
      if (!promptData.title.trim()) {
        throw new Error("Título é obrigatório")
      }
      if (!promptData.description.trim()) {
        throw new Error("Descrição é obrigatória")
      }
      if (!promptData.category) {
        throw new Error("Categoria é obrigatória")
      }
      if (!promptData.prompt.trim()) {
        throw new Error("Prompt é obrigatório")
      }
      if (!promptData.isFree && (!promptData.price || Number.parseFloat(promptData.price) <= 0)) {
        throw new Error("Preço é obrigatório para prompts pagos")
      }
      if (selectedTags.length === 0) {
        throw new Error("Selecione pelo menos uma tag")
      }

      // Criar prompt
      const newPrompt: Omit<Prompt, "id"> = {
        title: promptData.title.trim(),
        description: promptData.description.trim(),
        prompt: promptData.prompt.trim(),
        price: promptData.isFree ? 0 : Number.parseFloat(promptData.price),
        isFree: promptData.isFree,
        category: promptData.category,
        tags: selectedTags,
        author: user?.name || "Usuário",
        authorId: user?.id || "unknown",
        rating: 0,
        downloads: 0,
        views: 0,
        images: [promptData.resultImage || "/placeholder.svg?height=200&width=300"],
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: false, // Prompts de usuários ficam pendentes de aprovação
        isAdminCreated: false,
      }

      addPrompt(newPrompt)

      setSuccess("Prompt cadastrado com sucesso! Ele será analisado pela nossa equipe antes de ser publicado.")

      // Limpar formulário
      setPromptData({
        title: "",
        description: "",
        category: "",
        price: "",
        prompt: "",
        tags: [],
        isFree: true,
        resultImage: "",
      })
      setSelectedTags([])

      // Redirecionar após 3 segundos
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-gray-400 hover:text-white mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Cadastrar Novo Prompt</h1>
            <p className="text-gray-400">Compartilhe seu prompt com a comunidade</p>
          </div>
        </div>

        {/* Mensagens */}
        {success && (
          <Alert className="mb-6 bg-green-900/20 border-green-500/20">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-300">{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="mb-6 bg-red-900/20 border-red-500/20">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-300">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
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
                    Título do Prompt *
                  </Label>
                  <Input
                    id="title"
                    value={promptData.title}
                    onChange={(e) => setPromptData({ ...promptData, title: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white mt-2"
                    placeholder="Ex: Logo Minimalista para Startups"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">
                    Descrição *
                  </Label>
                  <Textarea
                    id="description"
                    value={promptData.description}
                    onChange={(e) => setPromptData({ ...promptData, description: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white mt-2 min-h-[100px]"
                    placeholder="Descreva o que seu prompt faz e quais resultados esperar..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category" className="text-white">
                      Categoria *
                    </Label>
                    <Select
                      value={promptData.category}
                      onValueChange={(value) => setPromptData({ ...promptData, category: value })}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-2">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="midjourney">Midjourney</SelectItem>
                        <SelectItem value="dalle">DALL-E</SelectItem>
                        <SelectItem value="stable-diffusion">Stable Diffusion</SelectItem>
                        <SelectItem value="leonardo-ai">Leonardo AI</SelectItem>
                        <SelectItem value="chatgpt">ChatGPT</SelectItem>
                        <SelectItem value="claude">Claude</SelectItem>
                        <SelectItem value="gemini">Gemini</SelectItem>
                        <SelectItem value="videos">Vídeos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Tipo de Prompt</Label>
                    <div className="flex items-center space-x-2 mt-3">
                      <Switch
                        checked={promptData.isFree}
                        onCheckedChange={(checked) => setPromptData({ ...promptData, isFree: checked })}
                      />
                      <span className="text-gray-300">{promptData.isFree ? "Gratuito" : "Pago"}</span>
                    </div>
                  </div>
                </div>

                {!promptData.isFree && (
                  <div>
                    <Label htmlFor="price" className="text-white">
                      Preço (R$) *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={promptData.price}
                      onChange={(e) => setPromptData({ ...promptData, price: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white mt-2"
                      placeholder="29.90"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="prompt" className="text-white">
                    Prompt Completo *
                  </Label>
                  <Textarea
                    id="prompt"
                    value={promptData.prompt}
                    onChange={(e) => setPromptData({ ...promptData, prompt: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white mt-2 min-h-[120px] font-mono text-sm"
                    placeholder="Cole aqui o prompt completo..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="imageUrl" className="text-white">
                    URL da Imagem do Resultado
                  </Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={promptData.resultImage}
                    onChange={(e) => setPromptData({ ...promptData, resultImage: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white mt-2"
                    placeholder="https://exemplo.com/imagem-resultado.jpg"
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Cole aqui a URL de uma imagem que mostra o resultado do seu prompt
                  </p>
                </div>

                <div>
                  <Label className="text-white">Tags *</Label>
                  <div className="mt-2 mb-3">
                    <Select onValueChange={addTag}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Selecione tags..." />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {availableTags
                          .filter((tag) => !selectedTags.includes(tag.name))
                          .map((tag) => (
                            <SelectItem key={tag.id} value={tag.name}>
                              {tag.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-300">
                        {tag}
                        <X className="w-3 h-3 ml-1 cursor-pointer hover:text-red-400" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                  {selectedTags.length === 0 && (
                    <p className="text-gray-500 text-sm mt-2">Selecione pelo menos uma tag</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {loading ? "Cadastrando..." : "Cadastrar Prompt"}
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
                      <img
                        src={promptData.resultImage || "/placeholder.svg?height=300&width=400"}
                        alt="Preview"
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=300&width=400"
                        }}
                      />
                      <Badge className="absolute top-3 left-3 bg-gray-900/80 text-white border border-gray-600">
                        {promptData.category || "Categoria"}
                      </Badge>
                      {promptData.isFree && (
                        <Badge className="absolute top-3 right-3 bg-green-600 text-white">Gratuito</Badge>
                      )}
                    </div>

                    {/* Detalhes */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <div className="flex text-yellow-400">{"★".repeat(5)}</div>
                          <span className="text-sm font-medium text-white">Novo</span>
                        </div>
                        <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                          {promptData.isFree ? "Gratuito" : `R$ ${promptData.price || "0,00"}`}
                        </div>
                      </div>

                      <h3 className="font-bold text-lg text-white">{promptData.title || "Título do Prompt"}</h3>
                      <p className="text-gray-400 text-sm">
                        {promptData.description || "Descrição do prompt aparecerá aqui..."}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {selectedTags.slice(0, 4).map((tag, index) => (
                          <Badge key={index} variant="outline" className="border-gray-600 text-gray-400">
                            {tag}
                          </Badge>
                        ))}
                        {selectedTags.length > 4 && (
                          <Badge variant="outline" className="border-gray-600 text-gray-400">
                            +{selectedTags.length - 4}
                          </Badge>
                        )}
                      </div>

                      {/* Prompt preview */}
                      {promptData.prompt && (
                        <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
                          <Label className="text-gray-400 text-xs">PROMPT:</Label>
                          <p className="text-gray-300 text-sm font-mono mt-1 line-clamp-3">{promptData.prompt}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informações importantes */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    Informações Importantes
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-3 text-sm">
                  <p>• Seu prompt será analisado pela nossa equipe antes de ser publicado</p>
                  <p>• Certifique-se de que o prompt funciona corretamente</p>
                  <p>• Use tags relevantes para facilitar a descoberta</p>
                  <p>• Adicione uma imagem que demonstre o resultado do prompt</p>
                  <p>• Prompts de qualidade têm maior chance de aprovação</p>
                  <p>• Você será notificado sobre o status da análise</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function NovoPromptPage() {
  return (
    <AuthGuard requireAdmin={false}>
      <NovoPromptContent />
    </AuthGuard>
  )
}
