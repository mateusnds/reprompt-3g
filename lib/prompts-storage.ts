
import type { Prompt } from './types'

// Simulated data - in a real app this would come from a database
const samplePrompts: Prompt[] = [
  {
    id: '1',
    title: 'Retrato Fotorrealístico',
    description: 'Prompt para criar retratos incrivelmente realistas',
    content: 'Create a hyper-realistic portrait of [subject] with professional lighting',
    category: 'midjourney',
    price: 15.99,
    rating: 4.8,
    downloads: 1250,
    tags: ['portrait', 'realistic', 'photography'],
    author: 'ProArtist',
    authorAvatar: '/placeholder-user.jpg',
    thumbnail: '/images/woman-portrait-preview.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slug: 'retrato-fotorrealista',
    isFree: false,
    featured: true,
    views: 5420,
    images: ['/images/woman-portrait-preview.jpg']
  },
  {
    id: '2',
    title: 'Marketing Copy Generator',
    description: 'Gere textos de marketing persuasivos',
    content: 'Write compelling marketing copy for [product] targeting [audience]',
    category: 'chatgpt',
    price: 0,
    rating: 4.6,
    downloads: 890,
    tags: ['marketing', 'copywriting', 'business'],
    author: 'MarketGuru',
    authorAvatar: '/placeholder-user.jpg',
    thumbnail: '/placeholder.svg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slug: 'marketing-copy-generator',
    isFree: true,
    featured: true,
    views: 3210,
    images: ['/placeholder.svg']
  },
  {
    id: '3',
    title: 'Super Saiyan Character',
    description: 'Crie personagens estilo anime Dragon Ball',
    content: 'Generate a powerful Super Saiyan character with golden hair and intense energy aura',
    category: 'dalle',
    price: 12.99,
    rating: 4.9,
    downloads: 2100,
    tags: ['anime', 'dragon ball', 'character'],
    author: 'AnimeArt',
    authorAvatar: '/placeholder-user.jpg',
    thumbnail: '/images/super-saiyan-woman-preview.jpg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    slug: 'super-saiyan-character',
    isFree: false,
    featured: true,
    views: 7800,
    images: ['/images/super-saiyan-woman-preview.jpg']
  }
]

// Storage functions
export const getAllPrompts = (): Prompt[] => {
  if (typeof window === 'undefined') return samplePrompts

  try {
    const stored = localStorage.getItem('prompts')
    return stored ? JSON.parse(stored) : samplePrompts
  } catch {
    return samplePrompts
  }
}

export const getFeaturedPrompts = (): Promise<Prompt[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const prompts = getAllPrompts()
      resolve(prompts.filter(p => p.featured))
    }, 100)
  })
}

export const getPromptBySlug = (slug: string): Prompt | null => {
  const prompts = getAllPrompts()
  return prompts.find(p => p.slug === slug) || null
}

export const getPromptsByCategory = (category: string): Prompt[] => {
  const prompts = getAllPrompts()
  return prompts.filter(p => p.category === category)
}

export const searchPrompts = (query: string, filters?: any): Prompt[] => {
  const prompts = getAllPrompts()

  let filtered = prompts

  if (query) {
    const searchTerm = query.toLowerCase()
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }

  if (filters?.category && filters.category !== 'all') {
    filtered = filtered.filter(p => p.category === filters.category)
  }

  if (filters?.priceFilter === 'free') {
    filtered = filtered.filter(p => p.isFree)
  } else if (filters?.priceFilter === 'paid') {
    filtered = filtered.filter(p => !p.isFree)
  }

  if (filters?.sortBy) {
    switch (filters.sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'downloads':
        filtered.sort((a, b) => b.downloads - a.downloads)
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
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

export const addPrompt = (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'downloads' | 'views'>): Prompt => {
  const prompts = getAllPrompts()
  const newPrompt: Prompt = {
    ...prompt,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    downloads: 0,
    views: 0
  }

  const updatedPrompts = [...prompts, newPrompt]

  if (typeof window !== 'undefined') {
    localStorage.setItem('prompts', JSON.stringify(updatedPrompts))
  }

  return newPrompt
}

export const updatePrompt = (id: string, updates: Partial<Prompt>): Prompt | null => {
  const prompts = getAllPrompts()
  const index = prompts.findIndex(p => p.id === id)

  if (index === -1) return null

  const updatedPrompt = {
    ...prompts[index],
    ...updates,
    updatedAt: new Date().toISOString()
  }

  prompts[index] = updatedPrompt

  if (typeof window !== 'undefined') {
    localStorage.setItem('prompts', JSON.stringify(prompts))
  }

  return updatedPrompt
}

export const deletePrompt = (id: string): boolean => {
  const prompts = getAllPrompts()
  const filtered = prompts.filter(p => p.id !== id)

  if (filtered.length === prompts.length) return false

  if (typeof window !== 'undefined') {
    localStorage.setItem('prompts', JSON.stringify(filtered))
  }

  return true
}

export const incrementViews = (id: string): void => {
  const prompts = getAllPrompts()
  const prompt = prompts.find(p => p.id === id)

  if (prompt) {
    prompt.views = (prompt.views || 0) + 1
    prompt.updatedAt = new Date().toISOString()

    if (typeof window !== 'undefined') {
      localStorage.setItem('prompts', JSON.stringify(prompts))
    }
  }
}

export const incrementDownloads = (id: string): void => {
  const prompts = getAllPrompts()
  const prompt = prompts.find(p => p.id === id)

  if (prompt) {
    prompt.downloads += 1
    prompt.updatedAt = new Date().toISOString()

    if (typeof window !== 'undefined') {
      localStorage.setItem('prompts', JSON.stringify(prompts))
    }
  }
}

// Initialize storage with sample data if empty
if (typeof window !== 'undefined' && !localStorage.getItem('prompts')) {
  localStorage.setItem('prompts', JSON.stringify(samplePrompts))
}
