"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  FileText,
  TrendingUp,
  DollarSign,
  Search,
  Filter,
  LogOut,
  CheckCircle,
  TagIcon,
  Settings,
} from "lucide-react"
import { getAllPrompts, deletePrompt, searchPrompts } from "@/lib/prompts-storage"
import { formatDate } from "@/lib/utils"
import { AuthGuard } from "@/components/auth-guard"
import { getCurrentUser, logout } from "@/lib/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { Prompt } from "@/lib/types"

function AdminContent() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteSuccess, setDeleteSuccess] = useState<string | null>(null)
  const router = useRouter()
  const user = getCurrentUser()

  // Carregar prompts do localStorage
  useEffect(() => {
    const loadPrompts = () => {
      const allPrompts = getAllPrompts()
      setPrompts(allPrompts)
    }

    loadPrompts()

    // Escutar mudanças no localStorage de forma simples
    const handleStorageChange = () => {
      loadPrompts()
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const stats = {
    totalPrompts: prompts.length,
    totalUsers: 1247,
    totalSales: 15680,
    revenue: 45230.5,
  }

  const filteredPrompts = searchPrompts(searchQuery)

  const reloadData = () => {
    const allPrompts = getAllPrompts()
    setPrompts(allPrompts)
  }

  const handleDeletePrompt = (id: string, title: string) => {
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
            <h1 className="text-3xl font-bold text-white mb-2">Painel Administrativo</h1>
            <p className="text-gray-400">
              Bem-vindo, <span className="text-purple-400 font-semibold">{user?.name}</span>
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/admin/novo-prompt">
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
                  <p className="text-gray-400 text-sm">Total de Prompts</p>
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
                  <p className="text-gray-400 text-sm">Usuários Ativos</p>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total de Vendas</p>
                  <p className="text-2xl font-bold text-white">{stats.totalSales.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Receita Total</p>
                  <p className="text-2xl font-bold text-white">
                    R$ {stats.revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="prompts" className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-700">
            <TabsTrigger value="prompts" className="data-[state=active]:bg-gray-800">
              Prompts ({prompts.length})
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-gray-800">
              Usuários
            </TabsTrigger>
            <TabsTrigger value="sales" className="data-[state=active]:bg-gray-800">
              Vendas
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-gray-800">
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prompts">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Gerenciar Prompts</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Buscar prompts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredPrompts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">
                      {searchQuery ? "Nenhum prompt encontrado para sua busca." : "Nenhum prompt cadastrado."}
                    </p>
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
                              {prompt.isAdminCreated && <Badge className="bg-blue-600 text-white">Oficial</Badge>}
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
                          <Link href={`/admin/editar-prompt/${prompt.id}`}>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
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

          <TabsContent value="users">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Gerenciar Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Funcionalidade de gerenciamento de usuários em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Relatório de Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Relatórios de vendas em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Configurações do Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/admin/tags">
                    <Card className="bg-gray-800 border-gray-600 hover:bg-gray-700 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                            <TagIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">Gerenciar Tags</h3>
                            <p className="text-gray-400 text-sm">Criar e editar tags do sistema</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <Card className="bg-gray-800 border-gray-600 opacity-50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                          <Settings className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-gray-400 font-semibold">Configurações Gerais</h3>
                          <p className="text-gray-500 text-sm">Em desenvolvimento</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <AuthGuard requireAdmin={true}>
      <AdminContent />
    </AuthGuard>
  )
}
