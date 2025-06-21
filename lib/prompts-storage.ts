
"use client"

import { 
  getPrompts, 
  getFeaturedPrompts, 
  getPromptsByCategory as getPromptsByCategoryFromDB, 
  getPromptBySlug as getPromptBySlugFromDB,
  createPrompt,
  updatePrompt,
  deletePrompt,
  searchPrompts as searchPromptsFromDB,
  type DatabasePrompt 
} from './database'

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

// Converter DatabasePrompt para Prompt
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

// Exportar todas as funções necessárias
export const getAllPrompts = async (): Promise<Prompt[]> => {
  try {
    const dbPrompts = await getPrompts()
    return dbPrompts.map(convertDatabasePrompt)
  } catch (error) {
    console.error('Erro ao carregar prompts:', error)
    return []
  }
}

export const getFeaturedPromptsData = async (): Promise<Prompt[]> => {
  try {
    const dbPrompts = await getFeaturedPrompts()
    return dbPrompts.map(convertDatabasePrompt)
  } catch (error) {
    console.error('Erro ao carregar prompts em destaque:', error)
    return []
  }
}

export const getPromptsByCategory = async (category: string): Promise<Prompt[]> => {
  try {
    const dbPrompts = await getPromptsByCategoryFromDB(category)
    return dbPrompts.map(convertDatabasePrompt)
  } catch (error) {
    console.error('Erro ao carregar prompts por categoria:', error)
    return []
  }
}

export const getPromptBySlug = async (category: string, slug: string): Promise<Prompt | null> => {
  try {
    const dbPrompt = await getPromptBySlugFromDB(category, slug)
    return dbPrompt ? convertDatabasePrompt(dbPrompt) : null
  } catch (error) {
    console.error('Erro ao carregar prompt por slug:', error)
    return null
  }
}

export const searchPrompts = async (
  query: string, 
  filters?: {
    category?: string
    priceFilter?: string
    sortBy?: string
  }
): Promise<Prompt[]> => {
  try {
    const dbPrompts = await searchPromptsFromDB(query, filters)
    return dbPrompts.map(convertDatabasePrompt)
  } catch (error) {
    console.error('Erro ao buscar prompts:', error)
    return []
  }
}

export const addPrompt = async (promptData: Omit<Prompt, 'id' | 'created_at' | 'updated_at'>): Promise<Prompt | null> => {
  try {
    const dbPrompt = await createPrompt(promptData)
    return dbPrompt ? convertDatabasePrompt(dbPrompt) : null
  } catch (error) {
    console.error('Erro ao adicionar prompt:', error)
    return null
  }
}

export const updatePromptData = async (id: string, updates: Partial<Prompt>): Promise<Prompt | null> => {
  try {
    const dbPrompt = await updatePrompt(id, updates)
    return dbPrompt ? convertDatabasePrompt(dbPrompt) : null
  } catch (error) {
    console.error('Erro ao atualizar prompt:', error)
    return null
  }
}

export const deletePromptData = async (id: string): Promise<boolean> => {
  try {
    return await deletePrompt(id)
  } catch (error) {
    console.error('Erro ao deletar prompt:', error)
    return false
  }
}

// Funções para incrementar views e downloads
export const incrementViews = async (id: string): Promise<boolean> => {
  try {
    // Importar getPromptById do database
    const { getPromptById } = await import('./database')
    const prompt = await getPromptById(id)
    if (!prompt) return false
    
    const updated = await updatePrompt(id, { 
      views: prompt.views + 1 
    })
    return !!updated
  } catch (error) {
    console.error('Erro ao incrementar views:', error)
    return false
  }
}

export const incrementDownloads = async (id: string): Promise<boolean> => {
  try {
    // Importar getPromptById do database
    const { getPromptById } = await import('./database')
    const prompt = await getPromptById(id)
    if (!prompt) return false
    
    const updated = await updatePrompt(id, { 
      downloads: prompt.downloads + 1 
    })
    return !!updated
  } catch (error) {
    console.error('Erro ao incrementar downloads:', error)
    return false
  }
}

// Re-exportar getFeaturedPrompts diretamente
export { getFeaturedPrompts }
