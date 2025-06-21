
import { createClient } from '@/utils/supabase/client'
import { getConfig } from './config'

export interface Prompt {
  id: string
  title: string
  description: string
  content: string
  category: string
  tags: string[]
  price: number
  aiTool: string
  author: string
  authorId: string
  createdAt: string
  updatedAt: string
  views: number
  downloads: number
  rating: number
  reviewCount: number
  featured: boolean
  verified: boolean
  slug: string
  previewImages: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  license: 'personal' | 'commercial' | 'extended'
}

export async function getFeaturedPromptsData(): Promise<Prompt[]> {
  try {
    const config = getConfig()
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('featured', true)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(6)

    if (error) {
      console.error('Erro ao buscar prompts em destaque:', error)
      return getFallbackFeaturedPrompts()
    }

    return data?.map(transformPromptData) || getFallbackFeaturedPrompts()
  } catch (error) {
    console.error('Erro ao carregar prompts:', error)
    return getFallbackFeaturedPrompts()
  }
}

export async function getPromptsByCategoryData(category: string): Promise<Prompt[]> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('category', category)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar prompts por categoria:', error)
      return []
    }

    return data?.map(transformPromptData) || []
  } catch (error) {
    console.error('Erro ao carregar prompts por categoria:', error)
    return []
  }
}

export async function getPromptBySlug(category: string, slug: string): Promise<Prompt | null> {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('category', category)
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error) {
      console.error('Erro ao buscar prompt por slug:', error)
      return null
    }

    return data ? transformPromptData(data) : null
  } catch (error) {
    console.error('Erro ao carregar prompt por slug:', error)
    return null
  }
}

export async function searchPromptsData(query: string, filters?: any): Promise<Prompt[]> {
  try {
    const supabase = createClient()
    
    let queryBuilder = supabase
      .from('prompts')
      .select('*')
      .eq('status', 'published')

    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
    }

    if (filters?.category) {
      queryBuilder = queryBuilder.eq('category', filters.category)
    }

    if (filters?.aiTool) {
      queryBuilder = queryBuilder.eq('ai_tool', filters.aiTool)
    }

    const { data, error } = await queryBuilder
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Erro ao buscar prompts:', error)
      return []
    }

    return data?.map(transformPromptData) || []
  } catch (error) {
    console.error('Erro ao buscar prompts:', error)
    return []
  }
}

export async function incrementViews(promptId: string): Promise<void> {
  try {
    const supabase = createClient()
    
    const { error } = await supabase.rpc('increment_views', {
      prompt_id: promptId
    })

    if (error) {
      console.error('Erro ao incrementar visualizações:', error)
    }
  } catch (error) {
    console.error('Erro ao incrementar visualizações:', error)
  }
}

export async function incrementDownloads(promptId: string): Promise<void> {
  try {
    const supabase = createClient()
    
    const { error } = await supabase.rpc('increment_downloads', {
      prompt_id: promptId
    })

    if (error) {
      console.error('Erro ao incrementar downloads:', error)
    }
  } catch (error) {
    console.error('Erro ao incrementar downloads:', error)
  }
}

function transformPromptData(data: any): Prompt {
  return {
    id: data.id || '',
    title: data.title || '',
    description: data.description || '',
    content: data.content || '',
    category: data.category || '',
    tags: data.tags || [],
    price: data.price || 0,
    aiTool: data.ai_tool || '',
    author: data.author_name || 'Autor Desconhecido',
    authorId: data.author_id || '',
    createdAt: data.created_at || new Date().toISOString(),
    updatedAt: data.updated_at || new Date().toISOString(),
    views: data.views || 0,
    downloads: data.downloads || 0,
    rating: data.rating || 0,
    reviewCount: data.review_count || 0,
    featured: data.featured || false,
    verified: data.verified || false,
    slug: data.slug || '',
    previewImages: data.preview_images || [],
    difficulty: data.difficulty || 'beginner',
    license: data.license || 'personal'
  }
}

function getFallbackFeaturedPrompts(): Prompt[] {
  return [
    {
      id: '1',
      title: 'Retrato Profissional de Mulher',
      description: 'Prompt avançado para criar retratos profissionais femininos com iluminação cinematográfica',
      content: 'professional portrait of a woman, cinematic lighting, high quality, detailed',
      category: 'midjourney',
      tags: ['retrato', 'profissional', 'mulher', 'fotografia'],
      price: 15.99,
      aiTool: 'Midjourney',
      author: 'Ana Silva',
      authorId: 'user1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 1250,
      downloads: 89,
      rating: 4.8,
      reviewCount: 23,
      featured: true,
      verified: true,
      slug: 'retrato-profissional-mulher',
      previewImages: ['/images/woman-portrait-preview.jpg'],
      difficulty: 'intermediate',
      license: 'commercial'
    },
    {
      id: '2',
      title: 'Jaguar Místico',
      description: 'Crie imagens impressionantes de jaguares com elementos místicos e mágicos',
      content: 'mystical jaguar, magical elements, fantasy art style',
      category: 'dall-e',
      tags: ['jaguar', 'místico', 'fantasia', 'animal'],
      price: 22.50,
      aiTool: 'DALL-E',
      author: 'Carlos Santos',
      authorId: 'user2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 2100,
      downloads: 156,
      rating: 4.9,
      reviewCount: 45,
      featured: true,
      verified: true,
      slug: 'jaguar-mistico',
      previewImages: ['/images/jaguar-prompt-result.png'],
      difficulty: 'advanced',
      license: 'commercial'
    },
    {
      id: '3',
      title: 'Mulher Super Saiyajin',
      description: 'Transforme personagens em poderosas guerreiras do estilo Dragon Ball',
      content: 'super saiyan woman, dragon ball style, powerful aura',
      category: 'stable-diffusion',
      tags: ['anime', 'super saiyajin', 'dragon ball', 'mulher'],
      price: 18.00,
      aiTool: 'Stable Diffusion',
      author: 'Maria Costa',
      authorId: 'user3',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 3200,
      downloads: 234,
      rating: 4.7,
      reviewCount: 67,
      featured: true,
      verified: true,
      slug: 'mulher-super-saiyajin',
      previewImages: ['/images/super-saiyan-woman-preview.jpg'],
      difficulty: 'intermediate',
      license: 'personal'
    }
  ]
}

// Aliases para compatibilidade
export const getFeaturedPrompts = getFeaturedPromptsData
export const getPromptsByCategory = getPromptsByCategoryData
export const searchPrompts = searchPromptsData
