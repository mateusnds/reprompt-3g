
import type { Prompt } from './types'

// Simulated data - in a real app this would come from a database
const initialPrompts: Prompt[] = [
  {
    id: '1',
    title: 'Retrato Fotorrealista de Mulher',
    description: 'Prompt para criar retratos fotorrealistas de mulheres com alta qualidade e detalhamento.',
    prompt: 'professional portrait photography of a beautiful woman, photorealistic, high quality, detailed skin texture, natural lighting, 85mm lens, shallow depth of field, elegant pose',
    price: 29.90,
    category: 'midjourney',
    tags: ['retrato', 'mulher', 'fotorrealista'],
    author: 'Admin',
    authorId: 'admin',
    rating: 4.8,
    downloads: 1250,
    slug: 'retrato-fotorrealista',
    isFree: false,
    featured: true,
    views: 5420,
    images: ['/images/woman-portrait-preview.jpg'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    isActive: true,
    isAdminCreated: true
  },
  {
    id: '2',
    title: 'Gerador de Copy de Marketing',
    description: 'Prompt para ChatGPT criar copies persuasivos para campanhas de marketing.',
    prompt: 'Act as a professional copywriter. Create compelling marketing copy for [PRODUCT/SERVICE]. Focus on benefits, use emotional triggers, include a strong call-to-action. Target audience: [AUDIENCE]. Tone: [TONE].',
    price: 0,
    category: 'chatgpt',
    tags: ['marketing', 'copy', 'vendas'],
    author: 'Admin',
    authorId: 'admin',
    rating: 4.6,
    downloads: 890,
    slug: 'marketing-copy-generator',
    isFree: true,
    featured: true,
    views: 3210,
    images: ['/placeholder.svg'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    isActive: true,
    isAdminCreated: true
  },
  {
    id: '3',
    title: 'Personagem Super Saiyan Feminina',
    description: 'Prompt para criar personagens femininas no estilo Super Saiyan do Dragon Ball.',
    prompt: 'anime style female super saiyan character, golden spiky hair flowing upward, intense blue eyes, muscular physique, energy aura surrounding body, dramatic lighting, action pose, detailed anime art style',
    price: 19.90,
    category: 'midjourney',
    tags: ['anime', 'super saiyan', 'personagem'],
    author: 'Admin',
    authorId: 'admin',
    rating: 4.9,
    downloads: 2100,
    slug: 'super-saiyan-character',
    isFree: false,
    featured: true,
    views: 7800,
    images: ['/images/super-saiyan-woman-preview.jpg'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    isActive: true,
    isAdminCreated: true
  }
]

const STORAGE_KEY = 'reprompt_prompts'

// Initialize prompts
export const initializePrompts = (): Prompt[] => {
  if (typeof window === 'undefined') return initialPrompts

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPrompts))
    return initialPrompts
  }

  try {
    const parsed = JSON.parse(stored)
    return parsed.map((prompt: any) => ({
      ...prompt,
      createdAt: typeof prompt.createdAt === 'string' ? new Date(prompt.createdAt) : prompt.createdAt,
      updatedAt: typeof prompt.updatedAt === 'string' ? new Date(prompt.updatedAt) : prompt.updatedAt,
    }))
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPrompts))
    return initialPrompts
  }
}

// Get all prompts
export const getAllPrompts = (): Prompt[] => {
  return initializePrompts()
}

// Get active prompts only
export const getActivePrompts = (): Prompt[] => {
  return getAllPrompts().filter(prompt => prompt.isActive)
}

// Get featured prompts
export const getFeaturedPrompts = (): Prompt[] => {
  return getActivePrompts().filter(prompt => prompt.featured).slice(0, 6)
}

// Get prompt by slug
export const getPromptBySlug = (slug: string): Prompt | null => {
  const prompts = getAllPrompts()
  return prompts.find(prompt => prompt.slug === slug) || null
}

// Get prompt by ID
export const getPromptById = (id: string): Prompt | null => {
  const prompts = getAllPrompts()
  return prompts.find(prompt => prompt.id === id) || null
}

// Save prompts to storage
export const savePrompts = (prompts: Prompt[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts))
  }
}

// Generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// Add new prompt
export const addPrompt = (prompt: Omit<Prompt, 'id' | 'slug'>): Prompt => {
  const prompts = getAllPrompts()
  const newPrompt: Prompt = {
    ...prompt,
    id: Date.now().toString(),
    slug: generateSlug(prompt.title),
  }

  const updatedPrompts = [newPrompt, ...prompts]
  savePrompts(updatedPrompts)
  return newPrompt
}

// Update prompt
export const updatePrompt = (id: string, updates: Partial<Prompt>): Prompt | null => {
  const prompts = getAllPrompts()
  const index = prompts.findIndex(p => p.id === id)
  
  if (index === -1) return null

  const updatedPrompt = {
    ...prompts[index],
    ...updates,
    updatedAt: new Date(),
  }

  // Update slug if title changed
  if (updates.title) {
    updatedPrompt.slug = generateSlug(updates.title)
  }

  prompts[index] = updatedPrompt
  savePrompts(prompts)
  return updatedPrompt
}

// Delete prompt
export const deletePrompt = (id: string): boolean => {
  const prompts = getAllPrompts()
  const filteredPrompts = prompts.filter(p => p.id !== id)
  
  if (filteredPrompts.length === prompts.length) {
    return false // Prompt not found
  }
  
  savePrompts(filteredPrompts)
  return true
}

// Search prompts
export const searchPrompts = (
  query: string = '',
  filters: {
    category?: string
    priceFilter?: string
    sortBy?: string
    tags?: string[]
  } = {}
): Prompt[] => {
  let results = getActivePrompts()

  // Text search
  if (query.trim()) {
    const searchTerm = query.toLowerCase()
    results = results.filter(prompt =>
      prompt.title.toLowerCase().includes(searchTerm) ||
      prompt.description.toLowerCase().includes(searchTerm) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }

  // Category filter
  if (filters.category) {
    results = results.filter(prompt => prompt.category === filters.category)
  }

  // Price filter
  if (filters.priceFilter) {
    if (filters.priceFilter === 'free') {
      results = results.filter(prompt => prompt.isFree)
    } else if (filters.priceFilter === 'paid') {
      results = results.filter(prompt => !prompt.isFree)
    }
  }

  // Tags filter
  if (filters.tags && filters.tags.length > 0) {
    results = results.filter(prompt =>
      filters.tags!.some(tag => prompt.tags.includes(tag))
    )
  }

  // Sort
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'newest':
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        results.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'price-low':
        results.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        results.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        results.sort((a, b) => b.rating - a.rating)
        break
      case 'downloads':
        results.sort((a, b) => b.downloads - a.downloads)
        break
      case 'views':
        results.sort((a, b) => b.views - a.views)
        break
      default:
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
  }

  return results
}

// Get prompts by category
export const getPromptsByCategory = (category: string): Prompt[] => {
  return searchPrompts('', { category })
}

// Increment views
export const incrementViews = (id: string): void => {
  const prompts = getAllPrompts()
  const index = prompts.findIndex(p => p.id === id)
  
  if (index !== -1) {
    prompts[index].views += 1
    savePrompts(prompts)
  }
}

// Increment downloads
export const incrementDownloads = (id: string): void => {
  const prompts = getAllPrompts()
  const index = prompts.findIndex(p => p.id === id)
  
  if (index !== -1) {
    prompts[index].downloads += 1
    savePrompts(prompts)
  }
}
