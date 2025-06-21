
import { getPrompts, getFeaturedPrompts, getPromptsByCategory, getPromptBySlug } from './database'

export interface Prompt {
  id: string
  title: string
  description: string
  content: string
  category: string
  price: number
  is_paid: boolean
  is_free: boolean
  is_admin_created: boolean
  featured: boolean
  author_id: string
  author: string
  author_avatar: string
  thumbnail: string
  images: string[]
  video_preview?: string
  tags: string[]
  rating: number
  downloads: number
  views: number
  slug: string
  created_at: string
  updated_at: string
}

interface DatabasePrompt {
  id: string
  title: string
  description: string
  content: string
  category: string
  price: number
  is_paid: boolean
  is_free: boolean
  is_admin_created: boolean
  featured: boolean
  author_id: string
  author: string
  author_avatar: string
  thumbnail: string
  images: string[]
  video_preview?: string
  tags: string[]
  rating: number
  downloads: number
  views: number
  slug: string
  created_at: string
  updated_at: string
}

const convertDatabasePrompt = (dbPrompt: DatabasePrompt): Prompt => ({
  id: dbPrompt.id,
  title: dbPrompt.title,
  description: dbPrompt.description,
  content: dbPrompt.content,
  category: dbPrompt.category,
  price: dbPrompt.price,
  is_paid: dbPrompt.is_paid,
  is_free: dbPrompt.is_free,
  is_admin_created: dbPrompt.is_admin_created,
  featured: dbPrompt.featured,
  author_id: dbPrompt.author_id,
  author: dbPrompt.author,
  author_avatar: dbPrompt.author_avatar,
  thumbnail: dbPrompt.thumbnail,
  images: dbPrompt.images,
  video_preview: dbPrompt.video_preview,
  tags: dbPrompt.tags,
  rating: dbPrompt.rating,
  downloads: dbPrompt.downloads,
  views: dbPrompt.views,
  slug: dbPrompt.slug,
  created_at: dbPrompt.created_at,
  updated_at: dbPrompt.updated_at
})

// Função principal para carregar todos os prompts
export const getAllPrompts = async (): Promise<Prompt[]> => {
  try {
    const dbPrompts = await getPrompts()
    return dbPrompts.map(convertDatabasePrompt)
  } catch (error) {
    console.error('Erro ao carregar prompts:', error)
    return []
  }
}

// Função para carregar prompts em destaque
export const getFeaturedPromptsData = async (): Promise<Prompt[]> => {
  try {
    const dbPrompts = await getFeaturedPrompts()
    return dbPrompts.map(convertDatabasePrompt)
  } catch (error) {
    console.error('Erro ao carregar prompts em destaque:', error)
    return []
  }
}

// Função para carregar prompts por categoria
export const getPromptsByCategoryData = async (category: string): Promise<Prompt[]> => {
  try {
    const dbPrompts = await getPromptsByCategory(category)
    return dbPrompts.map(convertDatabasePrompt)
  } catch (error) {
    console.error('Erro ao carregar prompts por categoria:', error)
    return []
  }
}

// Função para carregar prompt específico por slug
export const getPromptBySlugData = async (category: string, slug: string): Promise<Prompt | null> => {
  try {
    const dbPrompt = await getPromptBySlug(category, slug)
    return dbPrompt ? convertDatabasePrompt(dbPrompt) : null
  } catch (error) {
    console.error('Erro ao carregar prompt por slug:', error)
    return null
  }
}

// Função para buscar prompts
export const searchPromptsData = async (query: string, category?: string): Promise<Prompt[]> => {
  try {
    const allPrompts = await getAllPrompts()
    return allPrompts.filter(prompt => {
      const matchesQuery = prompt.title.toLowerCase().includes(query.toLowerCase()) ||
                          prompt.description.toLowerCase().includes(query.toLowerCase()) ||
                          prompt.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))

      const matchesCategory = !category || prompt.category === category

      return matchesQuery && matchesCategory
    })
  } catch (error) {
    console.error('Erro ao buscar prompts:', error)
    return []
  }
}

// Funções de incremento (placeholder - implementar depois)
export const incrementViews = async (promptId: string): Promise<void> => {
  console.log('Incrementing views for:', promptId)
}

export const incrementDownloads = async (promptId: string): Promise<void> => {
  console.log('Incrementing downloads for:', promptId)
}

// Aliases para compatibilidade (remover exportações duplicadas)
export { getFeaturedPromptsData as getFeaturedPrompts }
export { getPromptsByCategoryData as getPromptsByCategory }
export { getPromptBySlugData as getPromptBySlug }
export { searchPromptsData as searchPrompts }
