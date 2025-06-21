
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export interface Prompt {
  id: string
  title: string
  description: string
  content: string
  category: string
  price: number
  is_paid: boolean
  is_free: boolean
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

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  description: string
  count: number
}

// Função para buscar prompts em destaque
export async function getFeaturedPrompts(): Promise<Prompt[]> {
  try {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(6)

    if (error) {
      console.error('Erro ao buscar prompts em destaque:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Erro ao buscar prompts em destaque:', error)
    return []
  }
}

// Função para buscar prompt por slug
export async function getPromptBySlug(category: string, slug: string): Promise<Prompt | null> {
  try {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('category', category)
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Erro ao buscar prompt por slug:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Erro ao buscar prompt por slug:', error)
    return null
  }
}

// Função para buscar prompts por categoria
export async function getPromptsByCategory(category: string): Promise<Prompt[]> {
  try {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar prompts por categoria:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Erro ao buscar prompts por categoria:', error)
    return []
  }
}

// Função para buscar prompts
export async function searchPrompts(query: string): Promise<Prompt[]> {
  try {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .or(`title.ilike.%${query}%, description.ilike.%${query}%, tags.cs.{${query}}`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar prompts:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Erro ao buscar prompts:', error)
    return []
  }
}

// Função para incrementar visualizações
export async function incrementViews(promptId: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_views', { prompt_id: promptId })
    
    if (error) {
      console.error('Erro ao incrementar visualizações:', error)
    }
  } catch (error) {
    console.error('Erro ao incrementar visualizações:', error)
  }
}

// Função para incrementar downloads
export async function incrementDownloads(promptId: string): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_downloads', { prompt_id: promptId })
    
    if (error) {
      console.error('Erro ao incrementar downloads:', error)
    }
  } catch (error) {
    console.error('Erro ao incrementar downloads:', error)
  }
}

// Função para buscar todas as categorias
export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) {
      console.error('Erro ao buscar categorias:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    return []
  }
}

// Função para buscar todos os prompts
export async function getAllPrompts(): Promise<Prompt[]> {
  try {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar todos os prompts:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Erro ao buscar todos os prompts:', error)
    return []
  }
}
