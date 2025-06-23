import { createClient } from '@/utils/supabase/client'
import type { Prompt } from '@/lib/types'

// Função para transformar dados do banco para o formato da aplicação
function transformPromptData(data: any): Prompt {
  return {
    id: data.id || '',
    title: data.title || '',
    description: data.description || '',
    content: data.content || data.prompt || '',
    category: data.category || '',
    tags: Array.isArray(data.tags) ? data.tags : (typeof data.tags === 'string' ? data.tags.split(',') : []),
    price: Number(data.price) || 0,
    aiTool: data.ai_tool || data.category || '',
    author: data.author || 'Autor Desconhecido',
    authorId: data.author_id || '',
    rating: Number(data.rating) || 0,
    downloads: Number(data.downloads) || 0,
    views: Number(data.views) || 0,
    images: Array.isArray(data.images) ? data.images : (typeof data.images === 'string' ? [data.images] : ['/placeholder.svg']),
    isFree: data.price === 0 || data.price === null,
    isAdminCreated: Boolean(data.is_admin_created),
    createdAt: data.created_at || new Date().toISOString()
  }
}

// Função de busca universal - única função para todas as buscas
export async function universalSearch({
  query = '',
  category,
  priceFilter,
  sortBy = 'newest',
  tags,
  limit = 50
}: {
  query?: string
  category?: string
  priceFilter?: 'free' | 'paid'
  sortBy?: 'newest' | 'rating' | 'downloads' | 'price-low' | 'price-high'
  tags?: string[]
  limit?: number
} = {}): Promise<Prompt[]> {
  const supabase = createClient()

  try {
    let queryBuilder = supabase
      .from('prompts')
      .select('*')

    // Filtro por busca de texto
    if (query && query.trim()) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%,tags.ilike.%${query}%,author.ilike.%${query}%`)
    }

    // Filtro por categoria
    if (category && category !== 'all') {
      queryBuilder = queryBuilder.eq('category', category)
    }

    // Filtro por preço
    if (priceFilter === 'free') {
      queryBuilder = queryBuilder.eq('price', 0)
    } else if (priceFilter === 'paid') {
      queryBuilder = queryBuilder.gt('price', 0)
    }

    // Filtro por tags
    if (tags && tags.length > 0) {
      const tagsCondition = tags.map(tag => `tags.ilike.%${tag}%`).join(',')
      queryBuilder = queryBuilder.or(tagsCondition)
    }

    // Ordenação
    switch (sortBy) {
      case 'rating':
        queryBuilder = queryBuilder.order('rating', { ascending: false })
        break
      case 'downloads':
        queryBuilder = queryBuilder.order('downloads', { ascending: false })
        break
      case 'price-low':
        queryBuilder = queryBuilder.order('price', { ascending: true })
        break
      case 'price-high':
        queryBuilder = queryBuilder.order('price', { ascending: false })
        break
      case 'newest':
      default:
        queryBuilder = queryBuilder.order('created_at', { ascending: false })
        break
    }

    queryBuilder = queryBuilder.limit(limit)

    const { data, error } = await queryBuilder

    if (error) {
      console.error('Erro ao buscar prompts:', error)
      return []
    }

    return data ? data.map(transformPromptData) : []
  } catch (error) {
    console.error('Erro ao buscar prompts:', error)
    return []
  }
}

// Alias para compatibilidade
export const searchPrompts = universalSearch

// Buscar prompts em destaque
export async function getFeaturedPrompts(): Promise<Prompt[]> {
  return universalSearch({
    sortBy: 'rating',
    limit: 6
  })
}

// Buscar prompts por categoria
export async function getPromptsByCategory(category: string): Promise<Prompt[]> {
  return universalSearch({
    category,
    limit: 50
  })
}

// Buscar prompt específico
export async function getPromptBySlug(slug: string): Promise<Prompt | null> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) {
      console.error('Erro ao buscar prompt:', error)
      return null
    }

    return transformPromptData(data)
  } catch (error) {
    console.error('Erro ao buscar prompt:', error)
    return null
  }
}

// Buscar prompts gratuitos
export async function getFreePrompts(): Promise<Prompt[]> {
  return universalSearch({
    priceFilter: 'free',
    limit: 20
  })
}

// Buscar prompts mais avaliados
export async function getTopRatedPrompts(): Promise<Prompt[]> {
  return universalSearch({
    sortBy: 'rating',
    limit: 20
  })
}

// Buscar prompts mais recentes
export async function getNewestPrompts(): Promise<Prompt[]> {
  return universalSearch({
    sortBy: 'newest',
    limit: 20
  })
}

// Buscar prompts mais baixados
export async function getMostDownloadedPrompts(): Promise<Prompt[]> {
  return universalSearch({
    sortBy: 'downloads',
    limit: 20
  })
}

// Incrementar visualizações
export async function incrementViews(promptId: string): Promise<void> {
  const supabase = createClient()
  
  try {
    await supabase
      .from('prompts')
      .update({ views: supabase.sql`views + 1` })
      .eq('id', promptId)
  } catch (error) {
    console.error('Erro ao incrementar views:', error)
  }
}

// Incrementar downloads
export async function incrementDownloads(promptId: string): Promise<void> {
  const supabase = createClient()
  
  try {
    await supabase
      .from('prompts')
      .update({ downloads: supabase.sql`downloads + 1` })
      .eq('id', promptId)
  } catch (error) {
    console.error('Erro ao incrementar downloads:', error)
  }
}

// Alias para getFeaturedPrompts
export const getFeaturedPromptsData = getFeaturedPrompts