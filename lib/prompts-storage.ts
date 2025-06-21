import type { Prompt } from "./types"
import { samplePrompts } from "./data"
import { getPromptRatingStats } from "./reviews-storage"

const STORAGE_KEY = "promptbr_prompts"

// Adicionar no início do arquivo, após as importações:
let isInitialized = false

// Converter strings de data de volta para objetos Date
const convertDates = (prompt: any): Prompt => {
  return {
    ...prompt,
    createdAt: typeof prompt.createdAt === "string" ? new Date(prompt.createdAt) : prompt.createdAt,
    updatedAt: typeof prompt.updatedAt === "string" ? new Date(prompt.updatedAt) : prompt.updatedAt,
  }
}

// Inicializar dados no localStorage se não existirem
export const initializePrompts = (): Prompt[] => {
  if (typeof window === "undefined") return samplePrompts

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored || !isInitialized) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(samplePrompts))
    isInitialized = true
    return samplePrompts
  }

  try {
    const parsed = JSON.parse(stored)
    return parsed.map(convertDates)
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(samplePrompts))
    return samplePrompts
  }
}

// Obter todos os prompts com ratings atualizados
export const getAllPrompts = (): Prompt[] => {
  const prompts = initializePrompts()

  // Atualizar ratings baseado nas reviews
  return prompts.map((prompt) => {
    const stats = getPromptRatingStats(prompt.id)
    return {
      ...prompt,
      rating: stats.averageRating || prompt.rating,
    }
  })
}

// Salvar prompts no localStorage
export const savePrompts = (prompts: Prompt[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts))
    // Disparar evento nativo do storage para componentes que escutam
    window.dispatchEvent(new CustomEvent("promptsUpdated"))
  }
}

// Adicionar novo prompt
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

// Atualizar prompt existente
export const updatePrompt = (id: string, updates: Partial<Prompt>): Prompt | null => {
  const prompts = getAllPrompts()
  const index = prompts.findIndex((p) => p.id === id)

  if (index === -1) return null

  const updatedPrompt = {
    ...prompts[index],
    ...updates,
    updatedAt: new Date(),
  }
  prompts[index] = updatedPrompt
  savePrompts(prompts)
  return updatedPrompt
}

// Verificar se um prompt pertence a um usuário
export const isPromptOwner = (promptId: string, userId: string): boolean => {
  const prompt = getPromptById(promptId)
  return prompt ? prompt.authorId === userId : false
}

// Deletar prompt (com verificação de propriedade)
export const deletePrompt = (id: string, userId?: string): boolean => {
  const prompts = getAllPrompts()
  const promptIndex = prompts.findIndex((p) => p.id === id)

  if (promptIndex === -1) {
    return false // Prompt não encontrado
  }

  // Se userId for fornecido, verificar se o usuário é o dono do prompt
  if (userId && prompts[promptIndex].authorId !== userId) {
    return false // Usuário não é o dono do prompt
  }

  const filteredPrompts = prompts.filter((p) => p.id !== id)
  savePrompts(filteredPrompts)
  return true
}

// Obter prompt por ID
export const getPromptById = (id: string): Prompt | null => {
  const prompts = getAllPrompts()
  return prompts.find((p) => p.id === id) || null
}

// Obter prompt por categoria e slug
export const getPromptBySlug = (category: string, slug: string): Prompt | null => {
  const prompts = getAllPrompts()
  return (
    prompts.find(
      (p) =>
        p.category === category &&
        p.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "") === slug,
    ) || null
  )
}

// Buscar prompts - CORRIGIDA
export const searchPrompts = (
  query = "",
  filters?: {
    category?: string
    priceFilter?: string
    sortBy?: string
  },
): Prompt[] => {
  let prompts = getAllPrompts()

  // Filtro de busca - melhorado
  if (query && query.trim()) {
    const searchTerm = query.toLowerCase().trim()
    prompts = prompts.filter(
      (prompt) =>
        prompt.title.toLowerCase().includes(searchTerm) ||
        prompt.description.toLowerCase().includes(searchTerm) ||
        prompt.category.toLowerCase().includes(searchTerm) ||
        prompt.author.toLowerCase().includes(searchTerm) ||
        prompt.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
        prompt.prompt.toLowerCase().includes(searchTerm),
    )
  }

  // Filtro de categoria
  if (filters?.category && filters.category !== "all") {
    prompts = prompts.filter((prompt) => prompt.category.toLowerCase() === filters.category?.toLowerCase())
  }

  // Filtro de preço
  if (filters?.priceFilter && filters.priceFilter !== "all") {
    if (filters.priceFilter === "free") {
      prompts = prompts.filter((prompt) => prompt.isFree)
    } else if (filters.priceFilter === "paid") {
      prompts = prompts.filter((prompt) => !prompt.isFree)
    }
  }

  // Ordenação
  if (filters?.sortBy) {
    prompts.sort((a, b) => {
      switch (filters.sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "downloads":
          return b.downloads - a.downloads
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "relevance":
        default:
          // Para relevância, manter ordem original ou por data
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })
  }

  return prompts
}

// Incrementar visualizações
export const incrementViews = (id: string): void => {
  const prompts = getAllPrompts()
  const promptIndex = prompts.findIndex((p) => p.id === id)

  if (promptIndex !== -1) {
    prompts[promptIndex].views += 1
    savePrompts(prompts)
  }
}

// Incrementar downloads
export const incrementDownloads = (id: string): void => {
  const prompts = getAllPrompts()
  const promptIndex = prompts.findIndex((p) => p.id === id)

  if (promptIndex !== -1) {
    prompts[promptIndex].downloads += 1
    savePrompts(prompts)
  }
}
