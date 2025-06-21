export interface Prompt {
  id: string
  title: string
  description: string
  prompt: string
  price: number
  isFree: boolean
  category: string
  tags: string[]
  author: string
  authorId: string
  rating: number
  downloads: number
  views: number
  images: string[]
  videoUrl?: string // Adicionar este campo opcional
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  isAdminCreated: boolean
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  isAdmin: boolean
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  count: number
}
