
```typescript
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
    authorAvatar: data.author_avatar || '/placeholder-user.jpg',
    createdAt: data.created_at || new Date().toISOString(),
    updatedAt: data.updated_at || new Date().toISOString(),
    views: Number(data.views) || 0,
    downloads: Number(data.downloads) || 0,
    rating: Number(data.rating) || 0,
    reviewCount: Number(data.review_count) || 0,
    featured: Boolean(data.featured),
    verified: Boolean(data.verified),
    slug: data.slug || data.title?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") || '',
    previewImages: data.preview_images || data.images || [],
    images: data.images || data.preview_images || ['/placeholder.jpg'],
    videoUrl: data.video_url,
    difficulty: data.difficulty || 'beginner',
    license: data.license || 'personal',
    isFree: Boolean(data.is_free) || Number(data.price) === 0,
    isPaid: Boolean(data.is_paid) || Number(data.price) > 0,
    isAdminCreated: Boolean(data.is_admin_created),
    isActive: data.is_active !== false,
    prompt: data.content || data.prompt || ''
  }
}

// Interface para filtros de busca unificada
export interface UniversalSearchFilters {
  // Texto de busca
  query?: string
  
  // Filtros de categoria
  category?: string
  categories?: string[]
  
  // Filtros de preço
  priceFilter?: 'all' | 'free' | 'paid'
  priceRange?: [number, number]
  
  // Filtros de qualidade
  minRating?: number
  featured?: boolean
  verified?: boolean
  
  // Filtros de popularidade
  minViews?: number
  minDownloads?: number
  
  // Filtros de tags
  tags?: string[]
  
  // Ordenação
  sortBy?: 'newest' | 'oldest' | 'rating' | 'downloads' | 'views' | 'price-low' | 'price-high' | 'popular' | 'trending'
  
  // Paginação
  limit?: number
  offset?: number
  
  // Filtros especiais
  authorId?: string
  isActive?: boolean
}

// FUNÇÃO DE BUSCA UNIFICADA PARA TODO O SITE
export async function universalSearch(filters: UniversalSearchFilters = {}): Promise<Prompt[]> {
  try {
    const supabase = createClient()

    let queryBuilder = supabase
      .from('prompts')
      .select('*')

    // Filtro por status ativo (sempre aplicado por padrão)
    if (filters.isActive !== false) {
      queryBuilder = queryBuilder.neq('is_active', false)
    }

    // Filtro de busca por texto
    if (filters.query?.trim()) {
      const searchQuery = filters.query.trim()
      queryBuilder = queryBuilder.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`)
    }

    // Filtro por categoria única
    if (filters.category && filters.category !== 'all') {
      queryBuilder = queryBuilder.eq('category', filters.category)
    }

    // Filtro por múltiplas categorias
    if (filters.categories && filters.categories.length > 0) {
      queryBuilder = queryBuilder.in('category', filters.categories)
    }

    // Filtro por preço
    if (filters.priceFilter === 'free') {
      queryBuilder = queryBuilder.eq('is_free', true)
    } else if (filters.priceFilter === 'paid') {
      queryBuilder = queryBuilder.eq('is_paid', true)
    }

    // Filtro por faixa de preço
    if (filters.priceRange) {
      queryBuilder = queryBuilder
        .gte('price', filters.priceRange[0])
        .lte('price', filters.priceRange[1])
    }

    // Filtro por avaliação mínima
    if (filters.minRating) {
      queryBuilder = queryBuilder.gte('rating', filters.minRating)
    }

    // Filtro por prompts em destaque
    if (filters.featured) {
      queryBuilder = queryBuilder.eq('featured', true)
    }

    // Filtro por prompts verificados
    if (filters.verified) {
      queryBuilder = queryBuilder.eq('verified', true)
    }

    // Filtro por visualizações mínimas
    if (filters.minViews) {
      queryBuilder = queryBuilder.gte('views', filters.minViews)
    }

    // Filtro por downloads mínimos
    if (filters.minDownloads) {
      queryBuilder = queryBuilder.gte('downloads', filters.minDownloads)
    }

    // Filtro por autor
    if (filters.authorId) {
      queryBuilder = queryBuilder.eq('author_id', filters.authorId)
    }

    // Ordenação
    switch (filters.sortBy) {
      case 'price-low':
        queryBuilder = queryBuilder.order('price', { ascending: true })
        break
      case 'price-high':
        queryBuilder = queryBuilder.order('price', { ascending: false })
        break
      case 'rating':
        queryBuilder = queryBuilder.order('rating', { ascending: false })
        break
      case 'downloads':
        queryBuilder = queryBuilder.order('downloads', { ascending: false })
        break
      case 'views':
        queryBuilder = queryBuilder.order('views', { ascending: false })
        break
      case 'popular':
        queryBuilder = queryBuilder.order('downloads', { ascending: false }).order('views', { ascending: false })
        break
      case 'trending':
        queryBuilder = queryBuilder.order('views', { ascending: false }).order('rating', { ascending: false })
        break
      case 'oldest':
        queryBuilder = queryBuilder.order('created_at', { ascending: true })
        break
      case 'newest':
      default:
        queryBuilder = queryBuilder.order('created_at', { ascending: false })
        break
    }

    // Paginação
    const limit = filters.limit || 50
    const offset = filters.offset || 0
    
    queryBuilder = queryBuilder.range(offset, offset + limit - 1)

    const { data, error } = await queryBuilder

    if (error) {
      console.error('Erro na busca unificada:', error)
      return getFallbackPrompts(filters)
    }

    return data?.map(transformPromptData) || getFallbackPrompts(filters)
  } catch (error) {
    console.error('Erro na busca unificada:', error)
    return getFallbackPrompts(filters)
  }
}

// FUNÇÕES ESPECÍFICAS USANDO A BUSCA UNIFICADA

// Buscar prompts em destaque
export async function getFeaturedPromptsData(): Promise<Prompt[]> {
  return universalSearch({ 
    featured: true, 
    sortBy: 'trending',
    limit: 6
  })
}

// Buscar prompts gratuitos
export async function getFreePrompts(): Promise<Prompt[]> {
  return universalSearch({ 
    priceFilter: 'free', 
    sortBy: 'popular',
    limit: 20
  })
}

// Buscar prompts mais avaliados
export async function getTopRatedPrompts(): Promise<Prompt[]> {
  return universalSearch({ 
    minRating: 4, 
    sortBy: 'rating',
    limit: 20
  })
}

// Buscar novidades (prompts recentes)
export async function getNewPrompts(): Promise<Prompt[]> {
  return universalSearch({ 
    sortBy: 'newest',
    limit: 20
  })
}

// Buscar prompts populares
export async function getPopularPrompts(): Promise<Prompt[]> {
  return universalSearch({ 
    minViews: 100, 
    sortBy: 'popular',
    limit: 20
  })
}

// Buscar prompts por categoria
export async function getPromptsByCategoryData(category: string): Promise<Prompt[]> {
  return universalSearch({ 
    category,
    sortBy: 'newest'
  })
}

// Buscar todos os prompts
export async function getAllPrompts(): Promise<Prompt[]> {
  return universalSearch({ 
    sortBy: 'newest',
    limit: 100
  })
}

// Busca com texto (para página de busca)
export async function searchPromptsData(query: string = '', filters?: {
  category?: string
  priceFilter?: 'all' | 'free' | 'paid'
  sortBy?: string
  tags?: string[]
  featured?: boolean
}): Promise<Prompt[]> {
  return universalSearch({
    query,
    category: filters?.category,
    priceFilter: filters?.priceFilter,
    sortBy: filters?.sortBy as any,
    tags: filters?.tags,
    featured: filters?.featured
  })
}

// Buscar prompt por slug
export async function getPromptBySlug(slug: string): Promise<Prompt | null> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Erro ao buscar prompt por slug:', error)
      // Fallback para busca local
      const fallbackPrompts = getFallbackPrompts()
      const prompt = fallbackPrompts.find(p => p.slug === slug)
      return prompt || null
    }

    return data ? transformPromptData(data) : null
  } catch (error) {
    console.error('Erro ao carregar prompt por slug:', error)
    return null
  }
}

// Buscar prompts por múltiplas categorias
export async function getPromptsByCategories(categories: string[]): Promise<Prompt[]> {
  return universalSearch({ 
    categories,
    sortBy: 'newest'
  })
}

// Buscar prompts de um autor específico
export async function getPromptsByAuthor(authorId: string): Promise<Prompt[]> {
  return universalSearch({ 
    authorId,
    sortBy: 'newest'
  })
}

// Função para incrementar visualizações
export async function incrementViews(promptId: string): Promise<void> {
  try {
    const supabase = createClient()

    const { data: prompt, error: fetchError } = await supabase
      .from('prompts')
      .select('views')
      .eq('id', promptId)
      .single()

    if (!fetchError && prompt) {
      await supabase
        .from('prompts')
        .update({ views: (prompt.views || 0) + 1 })
        .eq('id', promptId)
    }
  } catch (error) {
    console.error('Erro ao incrementar visualizações:', error)
  }
}

// Função para incrementar downloads
export async function incrementDownloads(promptId: string): Promise<void> {
  try {
    const supabase = createClient()

    const { data: prompt, error: fetchError } = await supabase
      .from('prompts')
      .select('downloads')
      .eq('id', promptId)
      .single()

    if (!fetchError && prompt) {
      await supabase
        .from('prompts')
        .update({ downloads: (prompt.downloads || 0) + 1 })
        .eq('id', promptId)
    }
  } catch (error) {
    console.error('Erro ao incrementar downloads:', error)
  }
}

// Função para buscar prompt por ID
export function getPromptById(id: string): Prompt | null {
  const prompts = getFallbackPrompts()
  return prompts.find(p => p.id === id) || null
}

// Função para deletar prompt
export function deletePrompt(id: string): boolean {
  console.log('Delete prompt:', id)
  return true
}

// Dados de fallback aplicando filtros básicos
function getFallbackPrompts(filters?: UniversalSearchFilters): Prompt[] {
  let prompts = [
    {
      id: '11111111-1111-1111-1111-111111111111',
      title: 'Retrato Profissional de Mulher',
      description: 'Prompt avançado para criar retratos profissionais femininos com iluminação cinematográfica',
      content: 'professional portrait of a woman, cinematic lighting, high quality, detailed',
      category: 'midjourney',
      tags: ['retrato', 'profissional', 'mulher', 'fotografia'],
      price: 15.99,
      aiTool: 'Midjourney',
      author: 'Admin RePrompt',
      authorId: '00000000-0000-0000-0000-000000000001',
      authorAvatar: '/placeholder-user.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 1250,
      downloads: 89,
      rating: 4.8,
      reviewCount: 23,
      featured: true,
      verified: true,
      slug: 'retrato-profissional-de-mulher',
      previewImages: ['/images/woman-portrait-preview.jpg'],
      difficulty: 'intermediate',
      license: 'commercial',
      isFree: false,
      isPaid: true,
      isAdminCreated: true,
      prompt: 'professional portrait of a woman, cinematic lighting, high quality, detailed',
      images: ['/images/woman-portrait-preview.jpg'],
      isActive: true
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      title: 'Jaguar Místico',
      description: 'Crie imagens impressionantes de jaguares com elementos místicos e mágicos',
      content: 'mystical jaguar, magical elements, fantasy art style',
      category: 'dalle',
      tags: ['jaguar', 'místico', 'fantasia', 'animal'],
      price: 22.50,
      aiTool: 'DALL-E',
      author: 'Admin RePrompt',
      authorId: '00000000-0000-0000-0000-000000000001',
      authorAvatar: '/placeholder-user.jpg',
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
      license: 'commercial',
      isFree: false,
      isPaid: true,
      isAdminCreated: true,
      prompt: 'mystical jaguar, magical elements, fantasy art style',
      images: ['/images/jaguar-prompt-result.png'],
      isActive: true
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      title: 'Mulher Super Saiyajin',
      description: 'Transforme personagens em poderosas guerreiras do estilo Dragon Ball',
      content: 'super saiyan woman, dragon ball style, powerful aura',
      category: 'stable-diffusion',
      tags: ['anime', 'super saiyajin', 'dragon ball', 'mulher'],
      price: 18.00,
      aiTool: 'Stable Diffusion',
      author: 'Admin RePrompt',
      authorId: '00000000-0000-0000-0000-000000000001',
      authorAvatar: '/placeholder-user.jpg',
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
      license: 'personal',
      isFree: false,
      isPaid: true,
      isAdminCreated: true,
      prompt: 'super saiyan woman, dragon ball style, powerful aura',
      images: ['/images/super-saiyan-woman-preview.jpg'],
      isActive: true
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      title: 'Logo Minimalista',
      description: 'Prompt gratuito para criar logos minimalistas e modernos',
      content: 'minimalist logo design, clean lines, modern typography',
      category: 'dalle',
      tags: ['logo', 'design', 'minimalista', 'gratuito'],
      price: 0,
      aiTool: 'DALL-E',
      author: 'Admin RePrompt',
      authorId: '00000000-0000-0000-0000-000000000001',
      authorAvatar: '/placeholder-user.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 3421,
      downloads: 892,
      rating: 4.6,
      reviewCount: 134,
      featured: false,
      verified: true,
      slug: 'logo-minimalista',
      previewImages: ['/placeholder.jpg'],
      difficulty: 'beginner',
      license: 'personal',
      isFree: true,
      isPaid: false,
      isAdminCreated: true,
      prompt: 'minimalist logo design, clean lines, modern typography',
      images: ['/placeholder.jpg'],
      isActive: true
    }
  ]

  // Aplicar filtros básicos no fallback
  if (filters?.category && filters.category !== 'all') {
    prompts = prompts.filter(p => p.category === filters.category)
  }

  if (filters?.featured) {
    prompts = prompts.filter(p => p.featured)
  }

  if (filters?.priceFilter === 'free') {
    prompts = prompts.filter(p => p.isFree)
  } else if (filters?.priceFilter === 'paid') {
    prompts = prompts.filter(p => p.isPaid)
  }

  if (filters?.query) {
    const query = filters.query.toLowerCase()
    prompts = prompts.filter(p => 
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.author.toLowerCase().includes(query) ||
      p.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  return prompts
}

// Aliases para compatibilidade com código existente
export const getFeaturedPrompts = getFeaturedPromptsData
export const getPromptsByCategory = getPromptsByCategoryData
export const searchPrompts = searchPromptsData

// Exportar interface para compatibilidade
export type { Prompt }
```
