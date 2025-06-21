
"use client"

import { createClient } from '@/utils/supabase/client'

export interface DatabaseUser {
  id: string
  name: string
  email: string
  password: string
  is_admin: boolean
  avatar?: string
  created_at: string
  updated_at: string
}

export interface DatabasePrompt {
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

export interface DatabaseCategory {
  id: string
  name: string
  slug: string
  icon: string
  description: string
  count: number
  created_at: string
}

export interface DatabaseTag {
  id: string
  name: string
  slug: string
  category: string
  is_active: boolean
  created_at: string
}

export interface DatabaseReview {
  id: string
  prompt_id: string
  user_id: string
  user_name: string
  user_avatar: string
  rating: number
  comment: string
  is_verified_purchase: boolean
  helpful_votes: number
  reported: boolean
  created_at: string
}

export interface DatabasePurchase {
  id: string
  user_id: string
  prompt_id: string
  price: number
  status: "completed" | "pending" | "cancelled"
  created_at: string
}

export interface DatabaseBlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author_id: string
  author: string
  author_avatar: string
  thumbnail: string
  category: string
  tags: string[]
  published: boolean
  featured: boolean
  views: number
  created_at: string
  updated_at: string
}

export interface DatabaseFAQ {
  id: string
  question: string
  answer: string
  category: string
  order_num: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Supabase client
const getSupabase = () => createClient()

// Users
export const getUsers = async (): Promise<DatabaseUser[]> => {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao carregar usuários:', error)
    return []
  }
}

export const getUserById = async (id: string): Promise<DatabaseUser | null> => {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao carregar usuário:', error)
    return null
  }
}

export const getUserByEmail = async (email: string): Promise<DatabaseUser | null> => {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao carregar usuário por email:', error)
    return null
  }
}

export const createUser = async (user: Omit<DatabaseUser, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseUser | null> => {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao criar usuário:', error)
    return null
  }
}

// Categories
export const getCategories = async (): Promise<DatabaseCategory[]> => {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao carregar categorias:', error)
    return []
  }
}

export const createCategory = async (category: Omit<DatabaseCategory, 'id' | 'created_at'>): Promise<DatabaseCategory | null> => {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao criar categoria:', error)
    return null
  }
}

// Prompts
export const getPrompts = async (): Promise<DatabasePrompt[]> => {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao carregar prompts:', error)
    return []
  }
}

export const getFeaturedPrompts = async (): Promise<DatabasePrompt[]> => {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('featured', true)
      .order('views', { ascending: false })
      .limit(6)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao carregar prompts em destaque:', error)
    return []
  }
}

export const getPromptsByCategory = async (category: string): Promise<DatabasePrompt[]> => {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao carregar prompts por categoria:', error)
    return []
  }
}

export const getPromptBySlug = async (category: string, slug: string): Promise<DatabasePrompt | null> => {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('category', category)
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao carregar prompt por slug:', error)
    return null
  }
}

export const createPrompt = async (prompt: Omit<DatabasePrompt, 'id' | 'created_at' | 'updated_at'>): Promise<DatabasePrompt | null> => {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('prompts')
      .insert([prompt])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao criar prompt:', error)
    return null
  }
}

export const updatePrompt = async (id: string, updates: Partial<DatabasePrompt>): Promise<DatabasePrompt | null> => {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('prompts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao atualizar prompt:', error)
    return null
  }
}

export const deletePrompt = async (id: string): Promise<boolean> => {
  try {
    const supabase = getSupabase()
    const { error } = await supabase
      .from('prompts')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Erro ao deletar prompt:', error)
    return false
  }
}

export const searchPrompts = async (query: string, filters?: {
  category?: string
  priceFilter?: string
  sortBy?: string
}): Promise<DatabasePrompt[]> => {
  try {
    const supabase = getSupabase()
    let queryBuilder = supabase
      .from('prompts')
      .select('*')

    // Filtro de busca por texto
    if (query.trim()) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
    }

    // Filtro por categoria
    if (filters?.category) {
      queryBuilder = queryBuilder.eq('category', filters.category)
    }

    // Filtro por preço
    if (filters?.priceFilter === 'free') {
      queryBuilder = queryBuilder.eq('is_free', true)
    } else if (filters?.priceFilter === 'paid') {
      queryBuilder = queryBuilder.eq('is_paid', true)
    }

    // Ordenação
    switch (filters?.sortBy) {
      case 'newest':
        queryBuilder = queryBuilder.order('created_at', { ascending: false })
        break
      case 'oldest':
        queryBuilder = queryBuilder.order('created_at', { ascending: true })
        break
      case 'popular':
        queryBuilder = queryBuilder.order('views', { ascending: false })
        break
      case 'rating':
        queryBuilder = queryBuilder.order('rating', { ascending: false })
        break
      default:
        queryBuilder = queryBuilder.order('created_at', { ascending: false })
    }

    const { data, error } = await queryBuilder

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao buscar prompts:', error)
    return []
  }
}

// Tags
export const getTags = async (): Promise<DatabaseTag[]> => {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao carregar tags:', error)
    return []
  }
}

export const getTagsByCategory = async (category: string): Promise<DatabaseTag[]> => {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao carregar tags por categoria:', error)
    return []
  }
}

// Blog Posts
export const getBlogPosts = async (): Promise<DatabaseBlogPost[]> => {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao carregar posts do blog:', error)
    return []
  }
}

export const getBlogPostBySlug = async (slug: string): Promise<DatabaseBlogPost | null> => {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao carregar post do blog por slug:', error)
    return null
  }
}

export const getFeaturedBlogPosts = async (): Promise<DatabaseBlogPost[]> => {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .eq('featured', true)
      .order('views', { ascending: false })
      .limit(3)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao carregar posts em destaque:', error)
    return []
  }
}

// FAQs
export const getFAQs = async (): Promise<DatabaseFAQ[]> => {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('is_active', true)
      .order('order_num', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao carregar FAQs:', error)
    return []
  }
}

export const getFAQsByCategory = async (category: string): Promise<DatabaseFAQ[]> => {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('order_num', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao carregar FAQs por categoria:', error)
    return []
  }
}

// Reviews
export const getReviewsByPrompt = async (promptId: string): Promise<DatabaseReview[]> => {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('prompt_id', promptId)
      .eq('reported', false)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Erro ao carregar reviews:', error)
    return []
  }
}

export const createReview = async (review: Omit<DatabaseReview, 'id' | 'created_at'>): Promise<DatabaseReview | null> => {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('reviews')
      .insert([review])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Erro ao criar review:', error)
    return null
  }
}

// Initialize database with seed data if needed
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Check if we need to seed data
    const categories = await getCategories()
    if (categories.length === 0) {
      console.log('Seeding initial data...')
      
      // Create initial categories
      const initialCategories = [
        {
          name: "Midjourney",
          slug: "midjourney",
          icon: "🎨",
          description: "Prompts para geração de imagens com Midjourney",
          count: 0
        },
        {
          name: "DALL-E",
          slug: "dalle",
          icon: "🖼️",
          description: "Prompts para criação de imagens com DALL-E",
          count: 0
        },
        {
          name: "Stable Diffusion",
          slug: "stable-diffusion",
          icon: "⚡",
          description: "Prompts para Stable Diffusion e derivados",
          count: 0
        },
        {
          name: "ChatGPT",
          slug: "chatgpt",
          icon: "💬",
          description: "Prompts para conversas e assistência com ChatGPT",
          count: 0
        }
      ]

      for (const category of initialCategories) {
        await createCategory(category)
      }
    }
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error)
  }
}
