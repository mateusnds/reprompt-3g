"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, Eye, FileText, TrendingUp, Search, LogOut, CheckCircle, Clock } from "lucide-react"
import { getAllPrompts, deletePrompt } from "@/lib/prompts-storage"
import { formatDate } from "@/lib/utils"
import { AuthGuard } from "@/components/auth-guard"
import { getCurrentUser, logout } from "@/lib/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { Prompt } from "@/lib/types"

function DashboardContent() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null)
  const router = useRouter()
  const user = getCurrentUser()

  // Carregar apenas prompts do usuário atual
  useEffect(() => {
    const loadUserPrompts = () => {
      const allPrompts = getAllPrompts()
      const userPrompts = allPrompts.filter((prompt) => prompt.authorId === user?.id && user?.id)
      setPrompts(userPrompts)
    }

    if (user?.id) {
      loadUserPrompts()
    }
  }, [user?.id]) // Apenas recarregar quando o usuário mudar

  // Adicionar função de recarregamento:
  const reloadData = () => {
    if (user?.id) {
      const allPrompts = getAllPrompts()
      const userPrompts = allPrompts.filter((prompt) => prompt.authorId === user?.id)
      setPrompts(userPrompts)
    }
  }

  const stats = {
    totalPrompts: prompts.length,
    activePrompts: prompts.filter((p) => p.isActive).length,
    totalDownloads: prompts.reduce((sum, p) => sum + p.downloads, 0),
    totalViews: prompts.reduce((sum, p) => sum + p.views, 0),
  }

  const filteredPrompts = prompts.filter(
    (prompt) =>
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDeletePrompt = (id: string, title: string) => {
    const prompt = prompts.find((p) => p.id === id)
    if (!prompt || prompt.authorId !== user?.id) {
      setDeleteSuccess("Você só pode deletar seus próprios prompts!")
      setTimeout(() => setDeleteSuccess(null), 3000)
      return
    }

    const success = deletePrompt(id)
    if (success) {
      setDeleteSuccess(`Prompt "${title}" foi excluído com sucesso!`)
      reloadData() // Usar função específica
      setTimeout(() => setDeleteSuccess(null), 3000)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Meu Dashboard</h1>
            <p className="text-gray-400">
              Bem-vindo, <span className="text-purple-400 font-semibold">{user?.name}</span>
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/dashboard/novo-prompt">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Prompt
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* Mensagem de sucesso */}
        {deleteSuccess && (
          <Alert className="mb-6 bg-green-900/20 border-green-500/20">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-300">{deleteSuccess}</AlertDescription>
          </Alert>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Meus Prompts</p>
                  <p className="text-2xl font-bold text-white">{stats.totalPrompts}</p>
                </div>
                <FileText className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Prompts Ativos</p>
                  <p className="text-2xl font-bold text-white">{stats.activePrompts}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Downloads</p>
                  <p className="text-2xl font-bold text-white">{stats.totalDownloads.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Visualizações</p>
                  <p className="text-2xl font-bold text-white">{stats.totalViews.toLocaleString()}</p>
                </div>
                <Eye className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="prompts" className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-700">
            <TabsTrigger value="prompts" className="data-[state=active]:bg-gray-800">
              Meus Prompts ({prompts.length})
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-gray-800">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="earnings" className="data-[state=active]:bg-gray-800">
              Ganhos
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-gray-800">
              Perfil
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prompts">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Gerenciar Meus Prompts</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Buscar meus prompts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredPrompts.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">
                      {searchQuery
                        ? "Nenhum prompt encontrado para sua busca."
                        : "Você ainda não cadastrou nenhum prompt."}
                    </p>
                    {!searchQuery && (
                      <Link href="/dashboard/novo-prompt">
                        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Criar Primeiro Prompt
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredPrompts.map((prompt) => (
                      <div
                        key={prompt.id}
                        className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={prompt.images[0] || "/placeholder.svg"}
                            alt={prompt.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div>
                            <h3 className="text-white font-semibold">{prompt.title}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="border-gray-600 text-gray-400">
                                {prompt.category}
                              </Badge>
                              {prompt.isFree && <Badge className="bg-green-600 text-white">Gratuito</Badge>}
                              {prompt.isActive ? (
                                <Badge className="bg-blue-600 text-white">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Ativo
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="border-yellow-600 text-yellow-400">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Pendente
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-400 text-sm mt-1">
                              {prompt.downloads} downloads • {prompt.views} visualizações •{" "}
                              {formatDate(prompt.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-white font-semibold">
                            {prompt.isFree ? "Gratuito" : `R$ ${prompt.price.toFixed(2).replace(".", ",")}`}
                          </span>
                          <Link
                            href={`/prompt/${prompt.category}/${prompt.title
                              .toLowerCase()
                              .replace(/\s+/g, "-")
                              .replace(/[^\w-]/g, "")}`}
                          >
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-red-400"
                            onClick={() => handleDeletePrompt(prompt.id, prompt.title)}
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
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Analytics dos Prompts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Analytics detalhados em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Meus Ganhos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Sistema de ganhos em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Meu Perfil</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Configurações de perfil em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthGuard requireAdmin={false}>
      <DashboardContent />
    </AuthGuard>
  )
}
