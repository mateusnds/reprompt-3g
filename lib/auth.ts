export interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
}

// Usuários de exemplo (em produção, isso viria de um banco de dados)
export const users = [
  {
    id: "admin-1",
    name: "Admin Reprompt",
    email: "admin@reprompt.com",
    password: "admin123",
    isAdmin: true,
  },
  {
    id: "user-1",
    name: "João Silva",
    email: "joao@email.com",
    password: "123456",
    isAdmin: false,
  },
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
