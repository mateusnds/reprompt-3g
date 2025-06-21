
export interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
  avatar?: string
}

// Usuários do sistema integrados com o banco de dados
export const users = [
  {
    id: "admin-1",
    name: "Admin RePrompt",
    email: "admin@reprompt.com",
    password: "admin123",
    isAdmin: true,
    avatar: "/placeholder-user.jpg"
  },
  {
    id: "user-1",
    name: "Maria Silva",
    email: "maria@reprompt.com",
    password: "maria123",
    isAdmin: false,
    avatar: "/placeholder-user.jpg"
  },
  {
    id: "user-2",
    name: "Carlos Otaku",
    email: "carlos@reprompt.com",
    password: "carlos123",
    isAdmin: false,
    avatar: "/placeholder-user.jpg"
  },
  {
    id: "user-3",
    name: "Ana Fantasy",
    email: "ana@reprompt.com",
    password: "ana123",
    isAdmin: false,
    avatar: "/placeholder-user.jpg"
  },
  {
    id: "user-4",
    name: "Pedro Natura",
    email: "pedro@reprompt.com",
    password: "pedro123",
    isAdmin: false,
    avatar: "/placeholder-user.jpg"
  }
]

// Simulação de autenticação (em produção, use JWT, NextAuth, etc.)
export const authenticate = (email: string, password: string) => {
  const user = users.find((u) => u.email === email && u.password === password)
  if (user) {
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  return null
}

// Verificar se o usuário está logado (simulação)
export const getCurrentUser = (): User | null => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("currentUser")
    return userData ? JSON.parse(userData) : null
  }
  return null
}

// Login
export const login = (user: User) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("currentUser", JSON.stringify(user))
  }
}

// Logout
export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentUser")
  }
}

// Verificar se é admin
export const isAdmin = (): boolean => {
  const user = getCurrentUser()
  return user?.isAdmin === true
}

// Criar conta (simulação)
export const register = (userData: { name: string; email: string; password: string }) => {
  // Em produção, isso faria uma chamada para API
  const newUser = {
    id: `user-${Date.now()}`,
    name: userData.name,
    email: userData.email,
    isAdmin: false,
    avatar: "/placeholder-user.jpg"
  }
  
  // Aqui você salvaria no banco de dados real
  return newUser
}
