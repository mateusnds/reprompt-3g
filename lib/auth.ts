
"use client"

import { createClient } from '@/utils/supabase/client'
import { getUserByEmail, createUser, type DatabaseUser } from './database'

export interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
  avatar?: string
}

// Autenticação com Supabase
export const authenticate = async (email: string, password: string): Promise<User | null> => {
  try {
    const supabase = createClient()
    
    // Tentar fazer login com Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError || !authData.user) {
      // Fallback para autenticação local
      const user = await getUserByEmail(email)
      if (user && user.password === password) {
        const userWithoutPassword = {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.is_admin,
          avatar: user.avatar
        }
        return userWithoutPassword
      }
      return null
    }

    // Se login com Supabase foi bem-sucedido, buscar dados do usuário na nossa tabela
    const user = await getUserByEmail(email)
    if (user) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.is_admin,
        avatar: user.avatar
      }
    }

    return null
  } catch (error) {
    console.error('Erro na autenticação:', error)
    return null
  }
}

// Verificar se o usuário está logado
export const getCurrentUser = (): User | null => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("currentUser")
    return userData ? JSON.parse(userData) : null
  }
  return null
}

// Login
export const login = (user: User): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("currentUser", JSON.stringify(user))
  }
}

// Logout
export const logout = async (): Promise<void> => {
  try {
    const supabase = createClient()
    await supabase.auth.signOut()
    
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser")
    }
  } catch (error) {
    console.error('Erro no logout:', error)
  }
}

// Verificar se é admin
export const isAdmin = (): boolean => {
  const user = getCurrentUser()
  return user?.isAdmin === true
}

// Criar conta
export const register = async (userData: { 
  name: string
  email: string 
  password: string 
}): Promise<User | null> => {
  try {
    const supabase = createClient()
    
    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password
    })

    if (authError || !authData.user) {
      console.error('Erro ao criar conta no Supabase Auth:', authError)
    }

    // Criar usuário na nossa tabela
    const newUserData = {
      name: userData.name,
      email: userData.email,
      password: userData.password, // Em produção, use hash
      is_admin: false,
      avatar: "/placeholder-user.jpg"
    }

    const createdUser = await createUser(newUserData)
    
    if (createdUser) {
      return {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        isAdmin: createdUser.is_admin,
        avatar: createdUser.avatar
      }
    }

    return null
  } catch (error) {
    console.error('Erro ao registrar usuário:', error)
    return null
  }
}

// Verificar sessão do Supabase
export const checkSupabaseSession = async (): Promise<User | null> => {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.user?.email) {
      const user = await getUserByEmail(session.user.email)
      if (user) {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.is_admin,
          avatar: user.avatar
        }
      }
    }
    
    return null
  } catch (error) {
    console.error('Erro ao verificar sessão:', error)
    return null
  }
}
