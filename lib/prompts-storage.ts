
"use client"

export interface Prompt {
  id: string
  title: string
  category: string
  price: number
  description: string
  content: string
  tags: string[]
  rating: number
  downloads: number
  views: number
  author: string
  authorAvatar: string
  thumbnail: string
  images: string[]
  videoPreview?: string
  featured: boolean
  isPaid: boolean
  isFree: boolean
  isAdminCreated: boolean
  createdAt: Date
  updatedAt: Date
}

// Mock data for demonstration
const mockPrompts: Prompt[] = [
  {
    id: "1",
    title: "Retrato Fotorrealístico Ultra-Detalhado",
    category: "midjourney",
    price: 12.99,
    description: "Prompt premium para criar retratos fotorrealísticos incríveis com detalhes ultra-realistas, iluminação profissional e expressões naturais.",
    content: "professional portrait of [SUBJECT], photorealistic, ultra detailed, natural lighting, 85mm lens, shallow depth of field, high resolution, studio quality, natural skin texture, professional makeup, beautiful eyes, perfect composition --ar 2:3 --v 6 --style raw",
    tags: ["retrato", "fotorrealístico", "profissional", "ultra-detalhado"],
    rating: 4.9,
    downloads: 2847,
    views: 15420,
    author: "Maria Silva",
    authorAvatar: "/placeholder-user.jpg",
    thumbnail: "/images/woman-portrait-preview.jpg",
    images: ["/images/woman-portrait-preview.jpg"],
    videoPreview: "/videos/portrait-demo.mp4",
    featured: true,
    isPaid: true,
    isFree: false,
    isAdminCreated: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: "2",
    title: "Guerreira Super Saiyan Épica",
    category: "midjourney",
    price: 0,
    description: "Transforme qualquer personagem em uma poderosa guerreira Super Saiyan com aura dourada, cabelos flamejantes e poder épico.",
    content: "epic female super saiyan warrior, golden aura, flowing blonde hair, intense blue eyes, battle stance, energy crackling around body, dramatic lighting, anime style, highly detailed, 4k resolution --ar 9:16 --niji 5",
    tags: ["anime", "super saiyan", "guerreira", "épico"],
    rating: 4.8,
    downloads: 5234,
    views: 28750,
    author: "Carlos Otaku",
    authorAvatar: "/placeholder-user.jpg",
    thumbnail: "/images/super-saiyan-woman-preview.jpg",
    images: ["/images/super-saiyan-woman-preview.jpg"],
    featured: true,
    isPaid: false,
    isFree: true,
    isAdminCreated: false,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10")
  },
  {
    id: "3",
    title: "Gato-Pássaro Mágico em Pote",
    category: "dalle",
    price: 8.50,
    description: "Criatura fantástica única que combina características de gato e pássaro, perfeita para projetos de fantasia e arte conceitual.",
    content: "magical cat-bird hybrid creature sitting in a glass jar, colorful feathers mixed with fur, large expressive eyes, whimsical, fantasy art style, soft lighting, detailed textures, enchanting atmosphere --ar 1:1",
    tags: ["fantasia", "criatura", "mágico", "híbrido"],
    rating: 4.7,
    downloads: 1876,
    views: 9340,
    author: "Ana Fantasy",
    authorAvatar: "/placeholder-user.jpg",
    thumbnail: "/images/cat-bird-jar-preview.jpg",
    images: ["/images/cat-bird-jar-preview.jpg"],
    featured: true,
    isPaid: true,
    isFree: false,
    isAdminCreated: false,
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08")
  },
  {
    id: "4",
    title: "Jaguar Realístico na Selva",
    category: "stable-diffusion",
    price: 15.99,
    description: "Prompt profissional para gerar imagens ultra-realísticas de jaguares em seu habitat natural, com detalhes impressionantes.",
    content: "majestic jaguar in amazon rainforest, photorealistic, national geographic style, dappled sunlight through canopy, intense yellow eyes, detailed fur texture, muscular build, hunting pose, lush green vegetation, 4k ultra detailed --ar 16:9",
    tags: ["realístico", "jaguar", "natureza", "fotografia"],
    rating: 4.9,
    downloads: 3421,
    views: 18750,
    author: "Pedro Natura",
    authorAvatar: "/placeholder-user.jpg",
    thumbnail: "/images/jaguar-prompt-result.png",
    images: ["/images/jaguar-prompt-result.png"],
    featured: false,
    isPaid: true,
    isFree: false,
    isAdminCreated: false,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05")
  }
]

// Storage functions
const STORAGE_KEY = "prompts_data"

export const getAllPrompts = (): Prompt[] => {
  if (typeof window === "undefined") {
    return mockPrompts
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed.map((prompt: any) => ({
        ...prompt,
        createdAt: new Date(prompt.createdAt),
        updatedAt: new Date(prompt.updatedAt)
      }))
    }
    
    // Initialize with mock data
    savePrompts(mockPrompts)
    return mockPrompts
  } catch (error) {
    console.error("Erro ao carregar prompts:", error)
    return mockPrompts
  }
}

export const savePrompts = (prompts: Prompt[]): void => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts))
    } catch (error) {
      console.error("Erro ao salvar prompts:", error)
    }
  }
}

export const getPromptById = (id: string): Prompt | undefined => {
  const prompts = getAllPrompts()
  return prompts.find(prompt => prompt.id === id)
}

export const getPromptBySlug = (category: string, slug: string): Prompt | undefined => {
  const prompts = getAllPrompts()
  return prompts.find(prompt => {
    const promptSlug = prompt.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
    return prompt.category === category && promptSlug === slug
  })
}

export const searchPrompts = (query: string, filters?: any): Prompt[] => {
  const prompts = getAllPrompts()
  
  let filtered = prompts

  // Apply text search
  if (query) {
    const searchTerm = query.toLowerCase()
    filtered = filtered.filter(prompt => 
      prompt.title.toLowerCase().includes(searchTerm) ||
      prompt.description.toLowerCase().includes(searchTerm) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      prompt.category.toLowerCase().includes(searchTerm)
    )
  }

  // Apply filters
  if (filters) {
    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter(prompt => prompt.category === filters.category)
    }
    
    if (filters.priceFilter) {
      if (filters.priceFilter === "free") {
        filtered = filtered.filter(prompt => !prompt.isPaid)
      } else if (filters.priceFilter === "paid") {
        filtered = filtered.filter(prompt => prompt.isPaid)
      }
    }
    
    if (filters.minRating) {
      filtered = filtered.filter(prompt => prompt.rating >= filters.minRating)
    }
  }

  return filtered
}

export const getPromptsByCategory = (category: string): Prompt[] => {
  const prompts = getAllPrompts()
  if (category === "all") {
    return prompts
  }
  return prompts.filter(prompt => prompt.category.toLowerCase() === category.toLowerCase())
}

export const updatePrompt = (id: string, updates: Partial<Prompt>): boolean => {
  try {
    const prompts = getAllPrompts()
    const index = prompts.findIndex(prompt => prompt.id === id)
    
    if (index !== -1) {
      prompts[index] = {
        ...prompts[index],
        ...updates,
        updatedAt: new Date()
      }
      savePrompts(prompts)
      return true
    }
    return false
  } catch (error) {
    console.error("Erro ao atualizar prompt:", error)
    return false
  }
}

export const deletePrompt = (id: string): boolean => {
  try {
    const prompts = getAllPrompts()
    const filtered = prompts.filter(prompt => prompt.id !== id)
    
    if (filtered.length < prompts.length) {
      savePrompts(filtered)
      return true
    }
    return false
  } catch (error) {
    console.error("Erro ao deletar prompt:", error)
    return false
  }
}

export const addPrompt = (prompt: Omit<Prompt, "id">): Prompt => {
  const prompts = getAllPrompts()
  const newPrompt: Prompt = {
    ...prompt,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const updatedPrompts = [newPrompt, ...prompts]
  savePrompts(updatedPrompts)
  return newPrompt
}

export const getFeaturedPrompts = (): Prompt[] => {
  const prompts = getAllPrompts()
  return prompts
    .filter(prompt => prompt.featured)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6)
}

export const incrementViews = (id: string): void => {
  const prompts = getAllPrompts()
  const index = prompts.findIndex(prompt => prompt.id === id)
  
  if (index !== -1) {
    prompts[index].views += 1
    savePrompts(prompts)
  }
}
