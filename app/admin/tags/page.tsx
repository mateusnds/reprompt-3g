"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Search, CheckCircle, AlertCircle, ArrowLeft, TagIcon } from "lucide-react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { getAllTags, addTag, updateTag, deleteTag } from "@/lib/tags-storage"
import type { Tag } from "@/lib/tags-storage"

function TagsManagementContent() {
  const [tags, setTags] = useState<Tag[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    category: "geral",
    isActive: true,
  })

  useEffect(() => {
    loadTags()
  }, [])

  const loadTags = () => {
    const allTags = getAllTags()
    setTags(allTags)
  }

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      if (!formData.name.trim()) {
        throw new Error("Nome da tag é obrigatório")
      }

      // Verificar se já existe uma tag com o mesmo nome
      const existingTag = tags.find(
        (tag) =>
          tag.name.toLowerCase() === formData.name.trim().toLowerCase() && (!editingTag || tag.id !== editingTag.id),
      )

      if (existingTag) {
        throw new Error("Já existe uma tag com este nome")
      }

      if (editingTag) {
        // Atualizar tag existente
        const updatedTag = updateTag(editingTag.id, {
          name: formData.name.trim(),
          category: formData.category,
          isActive: formData.isActive,
          slug: formData.name.trim().toLowerCase().replace(/\s+/g, "-"),
        })

        if (updatedTag) {
          setSuccess("Tag atualizada com sucesso!")
          setEditingTag(null)
        }
      } else {
        // Criar nova tag
        const newTag = addTag({
          name: formData.name.trim(),
          category: formData.category,
          isActive: formData.isActive,
          slug: formData.name.trim().toLowerCase().replace(/\s+/g, "-"),
        })

        setSuccess("Tag criada com sucesso!")
      }

      // Limpar formulário
      setFormData({
        name: "",
        category: "geral",
        isActive: true,
      })
      setShowAddForm(true)
      loadTags()

      // Limpar mensagem após 3 segundos
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag)
    setFormData({
      name: tag.name,
      category: tag.category,
      isActive: tag.isActive,
    })
    setShowAddForm(true)
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir a tag "${name}"?`)) {
      const success = deleteTag(id)
      if (success) {
        setSuccess(`Tag "${name}" excluída com sucesso!`)
        loadTags()
        setTimeout(() => setSuccess(null), 3000)
      }
    }
  }

  const handleToggleActive = (tag: Tag) => {
    const updatedTag = updateTag(tag.id, { isActive: !tag.isActive })
    if (updatedTag) {
      loadTags()
    }
  }

  const cancelEdit = () => {
    setEditingTag(null)
    setShowAddForm(false)
    setFormData({
      name: "",
      category: "geral",
      isActive: true,
    })
    setError(null)
  }

  const categoryStats = {
    geral: tags.filter((t) => t.category === "geral").length,
    design: tags.filter((t) => t.category === "design").length,
    negócios: tags.filter((t) => t.category === "negócios").length,
    entretenimento: tags.filter((t) => t.category === "entretenimento").length,
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center mb-8">
          <Link href="/admin">
            <Button variant="ghost" className="text-gray-400 hover:text-white mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Admin
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Tags</h1>
            <p className="text-gray-400">Gerencie as tags disponíveis para os usuários</p>
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

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{tags.length}</div>
              <div className="text-gray-400 text-sm">Total de Tags</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{tags.filter((t) => t.isActive).length}</div>
              <div className="text-gray-400 text-sm">Tags Ativas</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{categoryStats.design}</div>
              <div className="text-gray-400 text-sm">Design</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{categoryStats.geral}</div>
              <div className="text-gray-400 text-sm">Geral</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lista de Tags */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Tags Cadastradas</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Buscar tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <Button
                      onClick={() => setShowAddForm(true)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Tag
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredTags.length === 0 ? (
                  <div className="text-center py-8">
                    <TagIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">
                      {searchQuery ? "Nenhuma tag encontrada." : "Nenhuma tag cadastrada."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredTags.map((tag) => (
                      <div
                        key={tag.id}
                        className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700"
                      >
                        <div className="flex items-center space-x-3">
                          <Badge
                            variant={tag.isActive ? "default" : "secondary"}
                            className={tag.isActive ? "bg-green-600" : "bg-gray-600"}
                          >
                            {tag.name}
                          </Badge>
                          <span className="text-gray-400 text-sm capitalize">{tag.category}</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch checked={tag.isActive} onCheckedChange={() => handleToggleActive(tag)} />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(tag)}
                            className="text-gray-400 hover:text-white"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(tag.id, tag.name)}
                            className="text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Formulário */}
          {showAddForm && (
            <div>
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">{editingTag ? "Editar Tag" : "Nova Tag"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-white">
                        Nome da Tag *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white mt-2"
                        placeholder="Ex: Arte Digital"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="category" className="text-white">
                        Categoria
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-700 text-white mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="geral">Geral</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="negócios">Negócios</SelectItem>
                          <SelectItem value="entretenimento">Entretenimento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                      />
                      <Label className="text-white">Tag ativa</Label>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        {editingTag ? "Atualizar" : "Criar Tag"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={cancelEdit}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TagsManagementPage() {
  return (
    <AuthGuard requireAdmin={true}>
      <TagsManagementContent />
    </AuthGuard>
  )
}