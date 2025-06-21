"use client"

import type { Prompt } from './types'
import { 
  getPrompts, 
  getFeaturedPrompts, 
  getPromptsByCategory, 
  getPromptBySlug, 
  createPrompt, 
  updatePrompt, 
  deletePrompt, 
  searchPrompts,
  type DatabasePrompt 
} from './database'

// Convert database prompt to frontend prompt format
const convertDbPromptToPrompt = (dbPrompt: DatabasePrompt): Prompt => ({
  id: dbPrompt.id,
  title: dbPrompt.title,
  description: dbPrompt.description,
  content: dbPrompt.content,
  category: dbPrompt.category,
  price: dbPrompt.price,
  isPaid: dbPrompt.is_paid,
  isFree: dbPrompt.is_free,
  isAdminCreated: dbPrompt.is_admin_created,
  featured: dbPrompt.featured,
  authorId: dbPrompt.author_id,
  author: dbPrompt.author,
  authorAvatar: dbPrompt.author_avatar,
  thumbnail: dbPrompt.thumbnail,
  images: dbPrompt.images,
  videoPreview: dbPrompt.video_preview,
  videoUrl: dbPrompt.video_preview,
  tags: dbPrompt.tags,
  rating: dbPrompt.rating,
  downloads: dbPrompt.downloads,
  views: dbPrompt.views,
  slug: dbPrompt.slug,
  createdAt: new Date(dbPrompt.created_at),
  updatedAt: new Date(dbPrompt.updated_at)
})

// Convert frontend prompt to database format
const convertPromptToDbPrompt = (prompt: Partial<Prompt>): Partial<DatabasePrompt> => ({
  title: prompt.title,
  description: prompt.description,
  content: prompt.content,
  category: prompt.category,
  price: prompt.price || 0,
  is_paid: prompt.isPaid || false,
  is_free: prompt.isFree || true,
  is_admin_created: prompt.isAdminCreated || false,
  featured: prompt.featured || false,
  author_id: prompt.authorId || '',
  author: prompt.author || '',
  author_avatar: prompt.authorAvatar || '/placeholder-user.jpg',
  thumbnail: prompt.thumbnail || '/placeholder.svg',
  images: prompt.images || ['/placeholder.svg'],
  video_preview: prompt.videoPreview || prompt.videoUrl,
  tags: prompt.tags || [],
  rating: prompt.rating || 0,
  downloads: prompt.downloads || 0,
  views: prompt.views || 0,
  slug: prompt.slug || ''
})

// Get all prompts
export const getAllPrompts = async (): Promise<Prompt[]> => {
  try {
    const dbPrompts = await getPrompts()
    return dbPrompts.map(convertDbPromptToPrompt)
  } catch (error) {
    console.error('Erro ao carregar prompts:', error)
    return []
  }
}

// Get featured prompts
export const getFeaturedPromptsData = async (): Promise<Prompt[]> => {
  try {
    const dbPrompts = await getFeaturedPrompts()
    return dbPrompts.map(convertDbPromptToPrompt)
  } catch (error) {
    console.error('Erro ao carregar prompts em destaque:', error)
    return []
  }
}

// Get prompts by category
export const getPromptsByCategoryData = async (category: string): Promise<Prompt[]> => {
  try {
    const dbPrompts = await getPromptsByCategory(category)
    return dbPrompts.map(convertDbPromptToPrompt)
  } catch (error) {
    console.error('Erro ao carregar prompts por categoria:', error)
    return []
  }
}

// Get prompt by slug
export const getPromptBySlugData = async (category: string, slug: string): Promise<Prompt | null> => {
  try {
    const dbPrompt = await getPromptBySlug(category, slug)
    return dbPrompt ? convertDbPromptToPrompt(dbPrompt) : null
  } catch (error) {
    console.error('Erro ao carregar prompt por slug:', error)
    return null
  }
}

// Add new prompt
export const addPrompt = async (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>): Promise<Prompt | null> => {
  try {
    const dbPromptData = convertPromptToDbPrompt(prompt)
    const dbPrompt = await createPrompt(dbPromptData as Omit<DatabasePrompt, 'id' | 'created_at' | 'updated_at'>)
    return dbPrompt ? convertDbPromptToPrompt(dbPrompt) : null
  } catch (error) {
    console.error('Erro ao adicionar prompt:', error)
    return null
  }
}

// Update prompt
export const updatePromptData = async (id: string, updates: Partial<Prompt>): Promise<Prompt | null> => {
  try {
    const dbUpdates = convertPromptToDbPrompt(updates)
    const dbPrompt = await updatePrompt(id, dbUpdates)
    return dbPrompt ? convertDbPromptToPrompt(dbPrompt) : null
  } catch (error) {
    console.error('Erro ao atualizar prompt:', error)
    return null
  }
}

// Delete prompt
export const deletePromptData = async (id: string): Promise<boolean> => {
  try {
    return await deletePrompt(id)
  } catch (error) {
    console.error('Erro ao deletar prompt:', error)
    return false
  }
}

// Search prompts
export const searchPromptsData = async (query: string, filters?: {
  category?: string
  priceFilter?: string
  sortBy?: string
}): Promise<Prompt[]> => {
  try {
    const dbPrompts = await searchPrompts(query, filters)
    return dbPrompts.map(convertDbPromptToPrompt)
  } catch (error) {
    console.error('Erro ao buscar prompts:', error)
    return []
  }
}

// Backward compatibility - keep old function names
export { searchPromptsData as searchPrompts }
export { getAllPrompts as getPrompts }
export { getFeaturedPromptsData as getFeaturedPrompts }
export { getPromptsByCategoryData as getPromptsByCategory }
export { getPromptBySlugData as getPromptBySlug }
export { updatePromptData as updatePrompt }
export { deletePromptData as deletePrompt }