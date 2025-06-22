
import { createClient } from '@/utils/supabase/client'
import type { Prompt } from '@/lib/types'

export async function getFeaturedPromptsData(): Promise<Prompt[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('featured', true)
      .eq('is_active', true)
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

export async function getAllPrompts(): Promise<Prompt[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar todos os prompts:', error)
      return getFallbackPrompts()
    }

    return data?.map(transformPromptData) || getFallbackPrompts()
  } catch (error) {
    console.error('Erro ao carregar todos os prompts:', error)
    return getFallbackPrompts()
  }
}

export async function getPromptsByCategoryData(category: string): Promise<Prompt[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
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

export async function getPromptBySlug(slug: string): Promise<Prompt | null> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
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

export async function searchPromptsData(query: string, filters?: any): Promise<Prompt[]> {
  try {
    const supabase = createClient()

    let queryBuilder = supabase
      .from('prompts')
      .select('*')
      .eq('is_active', true)

    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%,author.ilike.%${query}%`)
    }

    if (filters?.category && filters.category !== 'all') {
      queryBuilder = queryBuilder.eq('category', filters.category)
    }

    if (filters?.priceFilter === 'free') {
      queryBuilder = queryBuilder.eq('is_free', true)
    } else if (filters?.priceFilter === 'paid') {
      queryBuilder = queryBuilder.eq('is_paid', true)
    }

    // Ordenação
    switch (filters?.sortBy) {
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
      case 'oldest':
        queryBuilder = queryBuilder.order('created_at', { ascending: true })
        break
      case 'newest':
      default:
        queryBuilder = queryBuilder.order('created_at', { ascending: false })
        break
    }

    const { data, error } = await queryBuilder.limit(50)

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

    const { error } = await supabase.rpc('increment_views', { prompt_id: promptId })

    if (error) {
      // Fallback manual se a função não existir
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
    }
  } catch (error) {
    console.error('Erro ao incrementar visualizações:', error)
  }
}

export async function incrementDownloads(promptId: string): Promise<void> {
  try {
    const supabase = createClient()

    const { error } = await supabase.rpc('increment_downloads', { prompt_id: promptId })

    if (error) {
      // Fallback manual se a função não existir
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
    tags: Array.isArray(data.tags) ? data.tags : [],
    price: data.price || 0,
    aiTool: data.ai_tool || '',
    author: data.author || 'Autor Desconhecido',
    authorId: data.author_id || '',
    authorAvatar: data.author_avatar || '/placeholder-user.jpg',
    createdAt: data.created_at || new Date().toISOString(),
    updatedAt: data.updated_at || new Date().toISOString(),
    views: data.views || 0,
    downloads: data.downloads || 0,
    rating: data.rating || 0,
    reviewCount: data.review_count || 0,
    featured: data.featured || false,
    verified: data.verified || false,
    slug: data.slug || data.title?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") || '',
    previewImages: data.preview_images || data.images || [],
    images: data.images || data.preview_images || [],
    videoUrl: data.video_url,
    difficulty: data.difficulty || 'beginner',
    license: data.license || 'personal',
    isFree: data.is_free || data.price === 0,
    isPaid: data.is_paid || data.price > 0,
    isAdminCreated: data.is_admin_created || false,
    isActive: data.is_active !== false,
    prompt: data.content || ''
  }
}

function getFallbackFeaturedPrompts(): Prompt[] {
  return [
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
      slug: 'retrato-profissional-mulher',
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
    }
  ]
}

function getFallbackPrompts(): Prompt[] {
  return [
    ...getFallbackFeaturedPrompts(),
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
}

// Aliases para compatibilidade
export const getFeaturedPrompts = getFeaturedPromptsData
export const getPromptsByCategory = getPromptsByCategoryData
export const searchPrompts = searchPromptsData

// Exportar interface para compatibilidade
export type { Prompt }
