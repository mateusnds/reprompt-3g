"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from "lucide-react"
import Link from "next/link"
import { authenticate, login } from "@/lib/auth"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isLogin) {
        // Login
        const user = authenticate(formData.email, formData.password)
        if (user) {
          login(user)
          if (user.isAdmin) {
            router.push("/admin")
          } else {
            router.push("/")
          }
        } else {
          setError("E-mail ou senha incorretos")
        }
      } else {
        // Cadastro (simulação)
        if (formData.password !== formData.confirmPassword) {
          setError("As senhas não coincidem")
          return
        }
        // Aqui você implementaria o cadastro real
        setError("Cadastro ainda não implementado. Use as credenciais existentes para testar.")
      }
    } catch (err) {
      setError("Erro interno. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">{isLogin ? "Entrar" : "Criar Conta"}</CardTitle>
          <p className="text-gray-400">
            {isLogin ? "Entre na sua conta para acessar seus prompts" : "Crie sua conta e comece a vender prompts"}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert className="bg-red-900/20 border-red-500/20">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="name" className="text-white">
                  Nome Completo
                </Label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-white">
                E-mail
              </Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-white">
                Senha
              </Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <Label htmlFor="confirmPassword" className="text-white">
                  Confirmar Senha
                </Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirme sua senha"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {loading ? "Carregando..." : isLogin ? "Entrar" : "Criar Conta"}
            </Button>
          </form>

          {isLogin && (
            <div className="text-center">
              <Link href="/recuperar-senha" className="text-purple-400 hover:text-purple-300 text-sm">
                Esqueceu sua senha?
              </Link>
            </div>
          )}

          <Separator className="bg-gray-700" />

          <div className="text-center">
            <p className="text-gray-400 text-sm">{isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}</p>
            <Button
              variant="ghost"
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-400 hover:text-purple-300 hover:bg-gray-800"
            >
              {isLogin ? "Criar conta gratuita" : "Fazer login"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
