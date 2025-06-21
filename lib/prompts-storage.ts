
import type { Prompt } from './types'

// Simulated data - in a real app this would come from a database
const prompts: Prompt[] = [
  {
    id: '1',
    title: 'Retrato Fotorrealista Ultra HD',
    description: 'Prompt profissional para criar retratos fotorrealísticos em ultra alta definição. Ideal para projetos comerciais e artísticos.',
    prompt: 'Portrait of a [subject], ultra-realistic, photorealistic, 8K resolution, professional photography, studio lighting, sharp focus, detailed skin texture, natural expression',
    category: 'midjourney',
    price: 15.99,
    author: 'PrompterPro',
    authorId: '1',
    rating: 4.8,
    downloads: 1234,
    tags: ['retrato', 'fotorrealista', 'profissional', '8k', 'comercial'],
    images: ['/images/woman-portrait-preview.jpg'],
    createdAt: new Date('2024-01-15'),
    slug: 'retrato-fotorrealista',
    isFree: false,
    featured: true,
    views: 5420,
    isAdminCreated: false
  },
  {
    id: '2',
    title: 'Gerador de Copy para Marketing',
    description: 'Prompt especializado em criar textos persuasivos para campanhas de marketing digital.',
    prompt: 'Create compelling marketing copy for [product/service] targeting [audience]. Include emotional triggers, clear benefits, and strong call-to-action.',
    category: 'chatgpt',
    price: 0,
    author: 'MarketingGuru',
    authorId: '2',
    rating: 4.9,
    downloads: 2156,
    tags: ['marketing', 'copywriting', 'vendas', 'persuasão'],
    images: ['/placeholder.svg'],
    createdAt: new Date('2024-01-12'),
    slug: 'gerador-de-copy-para-marketing',
    isFree: true,
    featured: true,
    views: 3210,
    isAdminCreated: false
  },
  {
    id: '3',
    title: 'Personagem Super Saiyan Feminina',
    description: 'Prompt para gerar personagens femininas no estilo Dragon Ball Z com transformação Super Saiyan.',
    prompt: 'Female character in Dragon Ball Z style, Super Saiyan transformation, golden spiky hair, blue eyes, powerful aura, anime art style, detailed',
    category: 'midjourney',
    price: 12.50,
    author: 'AnimeArtist',
    authorId: '3',
    rating: 4.7,
    downloads: 987,
    tags: ['anime', 'dragon ball', 'super saiyan', 'personagem', 'feminino'],
    images: ['/images/super-saiyan-woman-preview.jpg'],
    createdAt: new Date('2024-01-10'),
    slug: 'super-saiyan-character',
    isFree: false,
    featured: true,
    views: 7800,
    isAdminCreated: false
  }
]

export function getAllPrompts(): Prompt[] {
  return prompts
}

export function getFeaturedPrompts(): Prompt[] {
  return prompts.filter(prompt => prompt.featured)
}

export function getPromptById(id: string): Prompt | undefined {
  return prompts.find(prompt => prompt.id === id)
}

export function getPromptBySlug(category: string, slug: string): Prompt | undefined {
  return prompts.find(prompt => 
    prompt.category === category && 
    (prompt.slug === slug || prompt.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') === slug)
  )
}

export function incrementViews(id: string): void {
  const prompt = prompts.find(p => p.id === id)
  if (prompt) {
    prompt.views += 1
  }
}

export function searchPrompts(
  query: string = "",
  filters: {
    category?: string
    priceFilter?: string
    sortBy?: string
    tags?: string[]
  } = {}
): Prompt[] {
  let filtered = [...prompts]

  // Filter by query
  if (query) {
    const lowercaseQuery = query.toLowerCase()
    filtered = filtered.filter(prompt =>
      prompt.title.toLowerCase().includes(lowercaseQuery) ||
      prompt.description.toLowerCase().includes(lowercaseQuery) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  }

  // Filter by category
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(prompt => prompt.category === filters.category)
  }

  // Filter by price
  if (filters.priceFilter) {
    if (filters.priceFilter === 'free') {
      filtered = filtered.filter(prompt => prompt.isFree)
    } else if (filters.priceFilter === 'paid') {
      filtered = filtered.filter(prompt => !prompt.isFree)
    }
  }

  // Filter by tags
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(prompt =>
      filters.tags!.some(tag => prompt.tags.includes(tag))
    )
  }

  // Sort results
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
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
    }
  }

  return filtered
}

export function addPrompt(prompt: Omit<Prompt, 'id' | 'createdAt' | 'views' | 'downloads'>): Prompt {
  const newPrompt: Prompt = {
    ...prompt,
    id: Date.now().toString(),
    createdAt: new Date(),
    views: 0,
    downloads: 0
  }
  
  prompts.push(newPrompt)
  return newPrompt
}
