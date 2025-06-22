import { createClient } from '@/utils/supabase/client'

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
  isFree?: boolean
  isAdminCreated?: boolean
  prompt?: string
  images?: string[]
  videoUrl?: string
  isActive?: boolean
}

export async function getFeaturedPromptsData(): Promise<Prompt[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('featured', true)
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

export function getPromptBySlug(slug: string): Prompt | null {
  try {
    const fallbackPrompts = getFallbackPrompts()
    const prompt = fallbackPrompts.find(p => 
      p.slug === slug || 
      p.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") === slug
    )
    return prompt || null
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

    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
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

    // Como a função increment_views não existe, vamos usar uma abordagem alternativa
    const { data: prompt, error: fetchError } = await supabase
      .from('prompts')
      .select('views')
      .eq('id', promptId)
      .single()

    if (fetchError) {
      console.error('Erro ao buscar prompt para incrementar views:', fetchError)
      return
    }

    const { error: updateError } = await supabase
      .from('prompts')
      .update({ views: (prompt.views || 0) + 1 })
      .eq('id', promptId)

    if (updateError) {
      console.error('Erro ao incrementar visualizações:', updateError)
    }
  } catch (error) {
    console.error('Erro ao incrementar visualizações:', error)
  }
}

export async function incrementDownloads(promptId: string): Promise<void> {
  try {
    const supabase = createClient()

    // Como a função increment_downloads não existe, vamos usar uma abordagem alternativa
    const { data: prompt, error: fetchError } = await supabase
      .from('prompts')
      .select('downloads')
      .eq('id', promptId)
      .single()

    if (fetchError) {
      console.error('Erro ao buscar prompt para incrementar downloads:', fetchError)
      return
    }

    const { error: updateError } = await supabase
      .from('prompts')
      .update({ downloads: (prompt.downloads || 0) + 1 })
      .eq('id', promptId)

    if (updateError) {
      console.error('Erro ao incrementar downloads:', updateError)
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
    content: data.content || data.prompt || '',
    category: data.category || '',
    tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
    price: data.price || 0,
    aiTool: data.ai_tool || data.aiTool || '',
    author: data.author_name || data.author || 'Autor Desconhecido',
    authorId: data.author_id || data.authorId || '',
    createdAt: data.created_at || data.createdAt || new Date().toISOString(),
    updatedAt: data.updated_at || data.updatedAt || new Date().toISOString(),
    views: data.views || 0,
    downloads: data.downloads || 0,
    rating: data.rating || 0,
    reviewCount: data.review_count || data.reviewCount || 0,
    featured: data.featured || false,
    verified: data.verified || false,
    slug: data.slug || data.title?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") || '',
    previewImages: data.preview_images || data.previewImages || data.images || [],
    difficulty: data.difficulty || 'beginner',
    license: data.license || 'personal',
    isFree: data.is_free || data.isFree || data.price === 0,
    isAdminCreated: data.is_admin_created || data.isAdminCreated || false,
    prompt: data.prompt || data.content || '',
    images: data.images || data.preview_images || data.previewImages || [],
    videoUrl: data.video_url || data.videoUrl,
    isActive: data.is_active !== false
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
      license: 'commercial',
      isFree: false,
      isAdminCreated: false,
      prompt: 'professional portrait of a woman, cinematic lighting, high quality, detailed',
      images: ['/images/woman-portrait-preview.jpg'],
      isActive: true
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
      license: 'commercial',
      isFree: false,
      isAdminCreated: false,
      prompt: 'mystical jaguar, magical elements, fantasy art style',
      images: ['/images/jaguar-prompt-result.png'],
      isActive: true
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
      license: 'personal',
      isFree: false,
      isAdminCreated: false,
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
      id: '4',
      title: 'Logo Minimalista',
      description: 'Prompt gratuito para criar logos minimalistas e modernos',
      content: 'minimalist logo design, clean lines, modern typography',
      category: 'dall-e',
      tags: ['logo', 'design', 'minimalista', 'gratuito'],
      price: 0,
      aiTool: 'DALL-E',
      author: 'Admin RePrompt',
      authorId: 'admin1',
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
      isAdminCreated: true,
      prompt: 'minimalist logo design, clean lines, modern typography',
      images: ['/placeholder.jpg'],
      isActive: true
    },
    {
      id: '5',
      title: 'Paisagem Cyberpunk',
      description: 'Crie paisagens futurísticas com estética cyberpunk',
      content: 'cyberpunk cityscape, neon lights, futuristic architecture',
      category: 'midjourney',
      tags: ['cyberpunk', 'futurista', 'cidade', 'neon'],
      price: 12.99,
      aiTool: 'Midjourney',
      author: 'Tech Artist',
      authorId: 'user4',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 1890,
      downloads: 203,
      rating: 4.5,
      reviewCount: 89,
      featured: false,
      verified: false,
      slug: 'paisagem-cyberpunk',
      previewImages: ['/placeholder.jpg'],
      difficulty: 'intermediate',
      license: 'commercial',
      isFree: false,
      isAdminCreated: false,
      prompt: 'cyberpunk cityscape, neon lights, futuristic architecture',
      images: ['/placeholder.jpg'],
      isActive: true
    }
  ]
}

// Aliases para compatibilidade
export const getFeaturedPrompts = getFeaturedPromptsData
export const getPromptsByCategory = getPromptsByCategoryData
export const searchPrompts = searchPromptsData