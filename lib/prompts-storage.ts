import type { Prompt } from './types'

// Simulated data - in a real app this would come from a database
const prompts: Prompt[] = [
  {
    id: '1',
    title: 'Retrato Fotorrealista de Mulher',
    description: 'Prompt para gerar retratos fotorrealistas de mulheres com detalhes impressionantes',
    content: 'portrait of a beautiful woman, photorealistic, highly detailed, professional photography, studio lighting, 85mm lens, shallow depth of field, perfect skin, natural makeup',
    price: 29.99,
    author: 'PhotoMaster',
    category: 'midjourney',
    tags: ['retrato', 'fotorrealismo', 'mulher', 'profissional'],
    rating: 4.8,
    downloads: 1420,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    slug: 'retrato-fotorrealista',
    isFree: false,
    featured: true,
    views: 5420,
    images: ['/images/woman-portrait-preview.jpg']
  },
  {
    id: '2',
    title: 'Gerador de Copy para Marketing',
    description: 'Prompt avançado para criar textos de marketing persuasivos e eficazes',
    content: 'Create a compelling marketing copy for [PRODUCT]. Focus on benefits, use emotional triggers, include social proof, and end with a strong call-to-action. Target audience: [AUDIENCE]. Tone: [TONE].',
    price: 0,
    author: 'CopyGuru',
    category: 'chatgpt',
    tags: ['marketing', 'copywriting', 'vendas', 'persuasão'],
    rating: 4.9,
    downloads: 2150,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    slug: 'marketing-copy-generator',
    isFree: true,
    featured: true,
    views: 3210,
    images: ['/placeholder.svg']
  },
  {
    id: '3',
    title: 'Personagem Super Saiyajin',
    description: 'Prompt para criar personagens no estilo Dragon Ball Z com transformação Super Saiyajin',
    content: 'anime character, Dragon Ball Z style, Super Saiyan transformation, golden spiky hair, intense aura, power up energy, muscular build, fighting stance, dramatic lighting',
    price: 19.99,
    author: 'AnimeArt',
    category: 'midjourney',
    tags: ['anime', 'dragon ball', 'super saiyajin', 'personagem'],
    rating: 4.7,
    downloads: 890,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    slug: 'super-saiyan-character',
    isFree: false,
    featured: true,
    views: 7800,
    images: ['/images/super-saiyan-woman-preview.jpg']
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

interface SearchOptions {
  category?: string
  priceFilter?: string
  sortBy?: string
  tags?: string[]
}

export function searchPrompts(query: string = "", options: SearchOptions = {}): Prompt[] {
  let results = prompts

  // Filter by query
  if (query.trim()) {
    const searchTerm = query.toLowerCase()
    results = results.filter(prompt => 
      prompt.title.toLowerCase().includes(searchTerm) ||
      prompt.description.toLowerCase().includes(searchTerm) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      prompt.author.toLowerCase().includes(searchTerm)
    )
  }

  // Filter by category
  if (options.category) {
    results = results.filter(prompt => prompt.category === options.category)
  }

  // Filter by price
  if (options.priceFilter) {
    if (options.priceFilter === 'free') {
      results = results.filter(prompt => prompt.isFree)
    } else if (options.priceFilter === 'paid') {
      results = results.filter(prompt => !prompt.isFree)
    }
  }

  // Filter by tags
  if (options.tags && options.tags.length > 0) {
    results = results.filter(prompt => 
      options.tags!.some(tag => prompt.tags.includes(tag))
    )
  }

  // Sort results
  if (options.sortBy) {
    switch (options.sortBy) {
      case 'newest':
        results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
      case 'rating':
        results.sort((a, b) => b.rating - a.rating)
        break
      case 'downloads':
        results.sort((a, b) => b.downloads - a.downloads)
        break
      case 'price-low':
        results.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        results.sort((a, b) => b.price - a.price)
        break
      default:
        break
    }
  }

  return results
}

export function addPrompt(prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'downloads' | 'rating' | 'views'>): Prompt {
  const newPrompt: Prompt = {
    ...prompt,
    id: (prompts.length + 1).toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
    downloads: 0,
    rating: 0,
    views: 0
  }

  prompts.push(newPrompt)
  return newPrompt
}

export function updatePrompt(id: string, updates: Partial<Prompt>): Prompt | null {
  const index = prompts.findIndex(prompt => prompt.id === id)
  if (index === -1) return null

  prompts[index] = { ...prompts[index], ...updates, updatedAt: new Date() }
  return prompts[index]
}

export function deletePrompt(id: string): boolean {
  const index = prompts.findIndex(prompt => prompt.id === id)
  if (index === -1) return false

  prompts.splice(index, 1)
  return true
}