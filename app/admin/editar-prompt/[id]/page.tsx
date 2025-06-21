"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Eye, CheckCircle, AlertCircle, X } from "lucide-react"
import Link from "next/link"
import { getPromptById, updatePrompt } from "@/lib/prompts-storage"
import { AuthGuard } from "@/components/auth-guard"
import type { Prompt } from "@/lib/types"

const categories = [
  "Midjourney",
  "DALL-E",
  "Stable Diffusion",
  "ChatGPT",
  "Claude",
  "Leonardo AI",
  "Runway ML",
  "Outros",
]

function EditPromptContent() {
  const router = useRouter()
  const params = useParams()
  const promptId = params.id as string

  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    prompt: "",
    category: "",
    price: 0,
    isFree: false,
    isActive: true,
    tags: [] as string[],
    images: [] as string[],
    videoUrl: "",
  })

  const [newTag, setNewTag] = useState("")

  useEffect(() => {
    if (promptId) {
      const foundPrompt = getPromptById(promptId)
      if (foundPrompt) {
        setPrompt(foundPrompt)
        setFormData({
          title: foundPrompt.title,
          description: foundPrompt.description,
          prompt: foundPrompt.prompt,
          category: foundPrompt.category,
          price: foundPrompt.price,
          isFree: foundPrompt.isFree,
          isActive: foundPrompt.isActive,
          tags: foundPrompt.tags,
          images: foundPrompt.images,
          videoUrl: foundPrompt.videoUrl || "",
        })
      } else {
        setError("Prompt não encontrado")
      }
      setLoading(false)
    }
  }, [promptId])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      if (!formData.title.trim() || !formData.description.trim() || !formData.prompt.trim()) {
        throw new Error("Título, descrição e prompt são obrigatórios")
      }

      const updatedPrompt = updatePrompt(promptId, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        prompt: formData.prompt.trim(),
        category: formData.category,
        price: formData.isFree ? 0 : formData.price,
        isFree: formData.isFree,
        isActive: formData.isActive,
        tags: formData.tags,
        images: formData.images,
        videoUrl: formData.videoUrl.trim() || undefined,
      })

      if (updatedPrompt) {
        setSuccess("Prompt atualizado com sucesso!")
        setTimeout(() => {
          router.push("/admin")
        }, 2000)
      } else {
        throw new Error("Erro ao atualizar prompt")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Prompt não encontrado</h1>
          <Link href="/admin">
            <Button>Voltar ao Admin</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Editar Prompt</h1>
              <p className="text-gray-400">Editando: {prompt.title}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href={`/prompt/${prompt.category}/${prompt.title
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^\w-]/g, "")}`}
              target="_blank"
            >
              <Button variant="outline" className="border-gray-600 text-gray-300">
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </Button>
            </Link>
          </div>
        </div>

        {/* Alerts */}
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-white">
                      Título *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Digite o título do prompt"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-white">
                      Descrição *
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                      placeholder="Descreva o que este prompt faz"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="prompt" className="text-white">
                      Prompt *
                    </Label>
                    <Textarea
                      id="prompt"
                      value={formData.prompt}
                      onChange={(e) => handleInputChange("prompt", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white min-h-[150px]"
                      placeholder="Cole aqui o prompt completo"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category" className="text-white">
                        Categoria *
                      </Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {categories.map((category) => (
                            <SelectItem key={category} value={category} className="text-white">
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="videoUrl" className="text-white">
                        URL do Vídeo (opcional)
                      </Label>
                      <Input
                        id="videoUrl"
                        value={formData.videoUrl}
                        onChange={(e) => handleInputChange("videoUrl", e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="https://exemplo.com/video.mp4"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-gray-700 text-white">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-gray-400 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Adicionar tag"
                    />
                    <Button type="button" onClick={handleAddTag} variant="outline" className="border-gray-600">
                      Adicionar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Preview */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  {formData.images[0] && (
                    <img
                      src={formData.images[0] || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-white font-semibold mb-2">{formData.title || "Título do prompt"}</h3>
                  <p className="text-gray-400 text-sm mb-4">{formData.description || "Descrição do prompt"}</p>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-purple-600">{formData.category || "Categoria"}</Badge>
                    <span className="text-white font-semibold">
                      {formData.isFree ? "Gratuito" : `R$ ${formData.price.toFixed(2).replace(".", ",")}`}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Settings */}
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Configurações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isFree" className="text-white">
                      Prompt Gratuito
                    </Label>
                    <Switch
                      id="isFree"
                      checked={formData.isFree}
                      onCheckedChange={(checked) => handleInputChange("isFree", checked)}
                    />
                  </div>

                  {!formData.isFree && (
                    <div>
                      <Label htmlFor="price" className="text-white">
                        Preço (R$)
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Label htmlFor="isActive" className="text-white">
                      Prompt Ativo
                    </Label>
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="pt-6">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {saving ? (
                      "Salvando..."
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar Alterações
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function EditPromptPage() {
  return (
    <AuthGuard requireAdmin={true}>
      <EditPromptContent />
    </AuthGuard>
  )
}
