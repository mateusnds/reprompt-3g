
"use client"

import { 
  getFeaturedPrompts as getFeaturedPromptsDB,
  getPromptBySlug as getPromptBySlugDB,
  getPromptsByCategory as getPromptsByCategoryDB,
  searchPrompts as searchPromptsDB,
  getPrompts as getPromptsDB,
  createPrompt as createPromptDB,
  updatePrompt as updatePromptDB,
  deletePrompt as deletePromptDB,
  type DatabasePrompt
} from '@/lib/database'

// Tipos exportados
export interface Prompt {
  id: string
  title: string
  description: string
  content: string
  category: string
  price: number
  isPaid: boolean
  isFree: boolean
  featured: boolean
  author: string
  authorAvatar: string
  thumbnail: string
  images: string[]
  videoPreview?: string
  tags: string[]
  rating: number
  downloads: number
  views: number
  slug: string
  createdAt: string
  updatedAt: string
}

// Função para converter DatabasePrompt para Prompt
const convertDatabasePrompt = (dbPrompt: DatabasePrompt): Prompt => ({
  id: dbPrompt.id,
  title: dbPrompt.title,
  description: dbPrompt.description,
  content: dbPrompt.content,
  category: dbPrompt.category,
  price: dbPrompt.price,
  isPaid: dbPrompt.is_paid,
  isFree: dbPrompt.is_free,
  featured: dbPrompt.featured,
  author: dbPrompt.author,
  authorAvatar: dbPrompt.author_avatar,
  thumbnail: dbPrompt.thumbnail,
  images: dbPrompt.images || [],
  videoPreview: dbPrompt.video_preview,
  tags: dbPrompt.tags || [],
  rating: dbPrompt.rating,
  downloads: dbPrompt.downloads,
  views: dbPrompt.views,
  slug: dbPrompt.slug,
  createdAt: dbPrompt.created_at,
  updatedAt: dbPrompt.updated_at
})

// Funções principais
export const getFeaturedPrompts = async (): Promise<Prompt[]> => {
  try {
    const dbPrompts = await getFeaturedPromptsDB()
    return dbPrompts.map(convertDatabasePrompt)
  } catch (error) {
    console.error('Erro ao carregar prompts em destaque:', error)
    return []
  }
}

export const getPromptBySlug = async (category: string, slug: string): Promise<Prompt | null> => {
  try {
    const dbPrompt = await getPromptBySlugDB(category, slug)
    return dbPrompt ? convertDatabasePrompt(dbPrompt) : null
  } catch (error) {
    console.error('Erro ao carregar prompt por slug:', error)
    return null
  }
}

export const getPromptsByCategory = async (category: string): Promise<Prompt[]> => {
  try {
    const dbPrompts = await getPromptsByCategoryDB(category)
    return dbPrompts.map(convertDatabasePrompt)
  } catch (error) {
    console.error('Erro ao carregar prompts por categoria:', error)
    return []
  }
}

export const searchPrompts = async (query: string, filters?: {
  category?: string
  priceFilter?: string
  sortBy?: string
}): Promise<Prompt[]> => {
  try {
    const dbPrompts = await searchPromptsDB(query, filters)
    return dbPrompts.map(convertDatabasePrompt)
  } catch (error) {
    console.error('Erro ao buscar prompts:', error)
    return []
  }
}

export const getAllPrompts = async (): Promise<Prompt[]> => {
  try {
    const dbPrompts = await getPromptsDB()
    return dbPrompts.map(convertDatabasePrompt)
  } catch (error) {
    console.error('Erro ao carregar todos os prompts:', error)
    return []
  }
}

export const createPrompt = async (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>): Promise<Prompt | null> => {
  try {
    const dbPromptData = {
      title: promptData.title,
      description: promptData.description,
      content: promptData.content,
      category: promptData.category,
      price: promptData.price,
      is_paid: promptData.isPaid,
      is_free: promptData.isFree,
      is_admin_created: false,
      featured: promptData.featured,
      author_id: '1',
      author: promptData.author,
      author_avatar: promptData.authorAvatar,
      thumbnail: promptData.thumbnail,
      images: promptData.images,
      video_preview: promptData.videoPreview,
      tags: promptData.tags,
      rating: promptData.rating,
      downloads: promptData.downloads,
      views: promptData.views,
      slug: promptData.slug
    }

    const dbPrompt = await createPromptDB(dbPromptData)
    return dbPrompt ? convertDatabasePrompt(dbPrompt) : null
  } catch (error) {
    console.error('Erro ao criar prompt:', error)
    return null
  }
}

export const updatePrompt = async (id: string, updates: Partial<Prompt>): Promise<Prompt | null> => {
  try {
    const dbUpdates: any = {}
    
    if (updates.title !== undefined) dbUpdates.title = updates.title
    if (updates.description !== undefined) dbUpdates.description = updates.description
    if (updates.content !== undefined) dbUpdates.content = updates.content
    if (updates.category !== undefined) dbUpdates.category = updates.category
    if (updates.price !== undefined) dbUpdates.price = updates.price
    if (updates.isPaid !== undefined) dbUpdates.is_paid = updates.isPaid
    if (updates.isFree !== undefined) dbUpdates.is_free = updates.isFree
    if (updates.featured !== undefined) dbUpdates.featured = updates.featured
    if (updates.author !== undefined) dbUpdates.author = updates.author
    if (updates.authorAvatar !== undefined) dbUpdates.author_avatar = updates.authorAvatar
    if (updates.thumbnail !== undefined) dbUpdates.thumbnail = updates.thumbnail
    if (updates.images !== undefined) dbUpdates.images = updates.images
    if (updates.videoPreview !== undefined) dbUpdates.video_preview = updates.videoPreview
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags
    if (updates.rating !== undefined) dbUpdates.rating = updates.rating
    if (updates.downloads !== undefined) dbUpdates.downloads = updates.downloads
    if (updates.views !== undefined) dbUpdates.views = updates.views
    if (updates.slug !== undefined) dbUpdates.slug = updates.slug

    const dbPrompt = await updatePromptDB(id, dbUpdates)
    return dbPrompt ? convertDatabasePrompt(dbPrompt) : null
  } catch (error) {
    console.error('Erro ao atualizar prompt:', error)
    return null
  }
}

export const deletePrompt = async (id: string): Promise<boolean> => {
  try {
    return await deletePromptDB(id)
  } catch (error) {
    console.error('Erro ao deletar prompt:', error)
    return false
  }
}

// Funções de incremento
export const incrementViews = async (promptId: string): Promise<void> => {
  try {
    const prompt = await getPromptBySlugDB('', '')
    if (prompt) {
      await updatePromptDB(promptId, { views: prompt.views + 1 })
    }
  } catch (error) {
    console.error('Erro ao incrementar visualizações:', error)
  }
}

export const incrementDownloads = async (promptId: string): Promise<void> => {
  try {
    const prompt = await getPromptBySlugDB('', '')
    if (prompt) {
      await updatePromptDB(promptId, { downloads: prompt.downloads + 1 })
    }
  } catch (error) {
    console.error('Erro ao incrementar downloads:', error)
  }
}

// Dados mock para fallback se o banco falhar
const mockPrompts: Prompt[] = [
  {
    id: "1",
    title: "Retrato Fotorrealista Profissional",
    description: "Crie retratos incrivelmente realistas com detalhes profissionais usando este prompt otimizado para Midjourney.",
    content: "professional portrait of a [person], ultra realistic, detailed facial features, perfect lighting, 8k resolution, photographic quality --ar 2:3 --v 6",
    category: "midjourney",
    price: 15.99,
    isPaid: true,
    isFree: false,
    featured: true,
    author: "Maria Silva",
    authorAvatar: "/placeholder-user.jpg",
    thumbnail: "/images/woman-portrait-preview.jpg",
    images: ["/images/woman-portrait-preview.jpg"],
    tags: ["retrato", "fotorrealista", "profissional"],
    rating: 4.8,
    downloads: 150,
    views: 1200,
    slug: "retrato-fotorrealista-profissional",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    title: "Paisagem Fantástica Épica",
    description: "Gere paisagens fantásticas de tirar o fôlego com este prompt especializado em cenários épicos.",
    content: "epic fantasy landscape, mystical mountains, magical atmosphere, dramatic lighting, cinematic composition, highly detailed --ar 16:9 --v 6",
    category: "dalle",
    price: 12.50,
    isPaid: true,
    isFree: false,
    featured: true,
    author: "João Santos",
    authorAvatar: "/placeholder-user.jpg",
    thumbnail: "/placeholder.jpg",
    images: ["/placeholder.jpg"],
    tags: ["paisagem", "fantasia", "épico"],
    rating: 4.6,
    downloads: 89,
    views: 856,
    slug: "paisagem-fantastica-epica",
    createdAt: "2024-01-14T09:00:00Z",
    updatedAt: "2024-01-14T09:00:00Z"
  },
  {
    id: "3",
    title: "Assistente de Programação IA",
    description: "Prompt especializado para assistente de programação com foco em código limpo e boas práticas.",
    content: "You are an expert programming assistant. Help with code review, debugging, and optimization. Provide clear explanations and best practices. Focus on clean, maintainable code.",
    category: "chatgpt",
    price: 0,
    isPaid: false,
    isFree: true,
    featured: true,
    author: "Ana Costa",
    authorAvatar: "/placeholder-user.jpg",
    thumbnail: "/placeholder.jpg",
    images: ["/placeholder.jpg"],
    tags: ["programação", "código", "assistente"],
    rating: 4.9,
    downloads: 245,
    views: 1580,
    slug: "assistente-programacao-ia",
    createdAt: "2024-01-13T08:00:00Z",
    updatedAt: "2024-01-13T08:00:00Z"
  }
]

// Função para obter prompts com fallback
export const getPromptsWithFallback = async (): Promise<Prompt[]> => {
  try {
    const prompts = await getAllPrompts()
    return prompts.length > 0 ? prompts : mockPrompts
  } catch (error) {
    console.error('Erro ao carregar prompts, usando dados mock:', error)
    return mockPrompts
  }
}

export const getFeaturedPromptsWithFallback = async (): Promise<Prompt[]> => {
  try {
    const prompts = await getFeaturedPrompts()
    return prompts.length > 0 ? prompts : mockPrompts.filter(p => p.featured)
  } catch (error) {
    console.error('Erro ao carregar prompts em destaque, usando dados mock:', error)
    return mockPrompts.filter(p => p.featured)
  }
}
