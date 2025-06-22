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
      queryBuilder = queryBuilder.eq('is_active', true)
    }

    // Filtro de busca por texto
    if (filters.query?.trim()) {
      const searchQuery = filters.query.trim()
      queryBuilder = queryBuilder.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%`)
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

    // Filtro por rating mínimo
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

    // Filtro por views mínimas
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
      case 'oldest':
        queryBuilder = queryBuilder.order('created_at', { ascending: true })
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
      case 'price-low':
        queryBuilder = queryBuilder.order('price', { ascending: true })
        break
      case 'price-high':
        queryBuilder = queryBuilder.order('price', { ascending: false })
        break
      case 'popular':
        queryBuilder = queryBuilder.order('downloads', { ascending: false })
        break
      case 'trending':
        queryBuilder = queryBuilder.order('views', { ascending: false })
        break
      case 'newest':
      default:
        queryBuilder = queryBuilder.order('created_at', { ascending: false })
        break
    }

    // Paginação
    if (filters.limit) {
      queryBuilder = queryBuilder.limit(filters.limit)
    }
    if (filters.offset) {
      queryBuilder = queryBuilder.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data, error } = await queryBuilder

    if (error) {
      console.error('Erro ao buscar prompts:', error)
      return getFallbackData(filters)
    }

    return data ? data.map(transformPromptData) : getFallbackData(filters)
  } catch (error) {
    console.error('Erro ao buscar prompts:', error)
    return getFallbackData(filters)
  }
}

// Função de fallback que retorna dados locais
function getFallbackData(filters: UniversalSearchFilters = {}): Prompt[] {
  const fallbackPrompts: Prompt[] = [
    {
      id: '11111111-1111-1111-1111-111111111111',
      title: 'Retrato Feminino Artístico',
      description: 'Prompt premium para criar retratos femininos com estilo artístico único',
      content: 'artistic portrait of a woman, professional lighting, detailed features',
      category: 'midjourney',
      tags: ['retrato', 'mulher', 'artístico', 'profissional'],
      price: 15.99,
      aiTool: 'Midjourney',
      author: 'Admin RePrompt',
      authorId: '00000000-0000-0000-0000-000000000001',
      authorAvatar: '/placeholder-user.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 2500,
      downloads: 420,
      rating: 4.8,
      reviewCount: 89,
      featured: true,
      verified: true,
      slug: 'retrato-feminino-artistico',
      previewImages: ['/images/woman-portrait-preview.jpg'],
      difficulty: 'intermediate',
      license: 'commercial',
      isFree: false,
      isPaid: true,
      isAdminCreated: true,
      prompt: 'artistic portrait of a woman, professional lighting, detailed features',
      images: ['/images/woman-portrait-preview.jpg'],
      isActive: true
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      title: 'Jaguar Místico',
      description: 'Crie imagens de jaguares com elementos místicos e mágicos',
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

  // Aplicar filtros nos dados de fallback
  let filtered = [...fallbackPrompts]

  if (filters.query?.trim()) {
    const query = filters.query.toLowerCase().trim()
    filtered = filtered.filter(prompt =>
      prompt.title.toLowerCase().includes(query) ||
      prompt.description.toLowerCase().includes(query) ||
      prompt.author.toLowerCase().includes(query) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(prompt => prompt.category === filters.category)
  }

  if (filters.priceFilter === 'free') {
    filtered = filtered.filter(prompt => prompt.isFree)
  } else if (filters.priceFilter === 'paid') {
    filtered = filtered.filter(prompt => prompt.isPaid)
  }

  if (filters.featured) {
    filtered = filtered.filter(prompt => prompt.featured)
  }

  if (filters.verified) {
    filtered = filtered.filter(prompt => prompt.verified)
  }

  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(prompt =>
      filters.tags!.some(tag => prompt.tags.includes(tag))
    )
  }

  if (filters.authorId) {
    filtered = filtered.filter(prompt => prompt.authorId === filters.authorId)
  }

  // Aplicar ordenação
  switch (filters.sortBy) {
    case 'oldest':
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      break
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating)
      break
    case 'downloads':
      filtered.sort((a, b) => b.downloads - a.downloads)
      break
    case 'views':
      filtered.sort((a, b) => b.views - a.views)
      break
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price)
      break
    case 'newest':
    default:
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
  }

  return filtered
}

// Funções específicas para compatibilidade
export async function getAllPrompts(): Promise<Prompt[]> {
  return universalSearch()
}

export async function getFeaturedPrompts(): Promise<Prompt[]> {
  return universalSearch({ featured: true, limit: 6 })
}

export async function searchPrompts(query: string, category?: string, priceFilter?: string): Promise<Prompt[]> {
  return universalSearch({
    query,
    category: category || 'all',
    priceFilter: priceFilter as 'all' | 'free' | 'paid' || 'all'
  })
}

export async function getPromptsByCategory(category: string): Promise<Prompt[]> {
  return universalSearch({ category })
}

export function getPromptBySlug(slug: string): Prompt | null {
  const fallbackPrompts = getFallbackData()
  return fallbackPrompts.find(prompt => prompt.slug === slug) || null
}

export function incrementViews(promptId: string): void {
  console.log('Incrementando views para prompt:', promptId)
}

export function incrementDownloads(promptId: string): void {
  console.log('Incrementando downloads para prompt:', promptId)
}