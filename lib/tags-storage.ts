export interface Tag {
  id: string
  name: string
  slug: string
  category: string
  isActive: boolean
  createdAt: Date
}

const TAGS_STORAGE_KEY = "reprompt_tags"

// Tags padrão do sistema
const defaultTags: Tag[] = [
  { id: "1", name: "Arte", slug: "arte", category: "geral", isActive: true, createdAt: new Date() },
  { id: "2", name: "Logo", slug: "logo", category: "design", isActive: true, createdAt: new Date() },
  { id: "3", name: "Imagens", slug: "imagens", category: "geral", isActive: true, createdAt: new Date() },
  { id: "4", name: "Cinema", slug: "cinema", category: "entretenimento", isActive: true, createdAt: new Date() },
  { id: "5", name: "Esporte", slug: "esporte", category: "entretenimento", isActive: true, createdAt: new Date() },
  { id: "6", name: "Marketing", slug: "marketing", category: "negócios", isActive: true, createdAt: new Date() },
  { id: "7", name: "Natureza", slug: "natureza", category: "geral", isActive: true, createdAt: new Date() },
  { id: "8", name: "Animais", slug: "animais", category: "geral", isActive: true, createdAt: new Date() },
  { id: "9", name: "Tecnologia", slug: "tecnologia", category: "negócios", isActive: true, createdAt: new Date() },
  { id: "10", name: "Fantasia", slug: "fantasia", category: "entretenimento", isActive: true, createdAt: new Date() },
  { id: "11", name: "Retrato", slug: "retrato", category: "design", isActive: true, createdAt: new Date() },
  { id: "12", name: "Paisagem", slug: "paisagem", category: "geral", isActive: true, createdAt: new Date() },
  { id: "13", name: "Minimalista", slug: "minimalista", category: "design", isActive: true, createdAt: new Date() },
  { id: "14", name: "Vintage", slug: "vintage", category: "design", isActive: true, createdAt: new Date() },
  { id: "15", name: "Futurista", slug: "futurista", category: "design", isActive: true, createdAt: new Date() },
]

// Inicializar tags
export const initializeTags = (): Tag[] => {
  if (typeof window === "undefined") return defaultTags

  const stored = localStorage.getItem(TAGS_STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(defaultTags))
    return defaultTags
  }

  try {
    const parsed = JSON.parse(stored)
    return parsed.map((tag: any) => ({
      ...tag,
      createdAt: typeof tag.createdAt === "string" ? new Date(tag.createdAt) : tag.createdAt,
    }))
  } catch {
    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(defaultTags))
    return defaultTags
  }
}

// Obter todas as tags
export const getAllTags = (): Tag[] => {
  return initializeTags()
}

// Obter tags ativas
export const getActiveTags = (): Tag[] => {
  return getAllTags().filter((tag) => tag.isActive)
}

// Salvar tags
export const saveTags = (tags: Tag[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(tags))
  }
}

// Adicionar nova tag (apenas admin)
export const addTag = (tag: Omit<Tag, "id" | "createdAt">): Tag => {
  const tags = getAllTags()
  const newTag: Tag = {
    ...tag,
    id: Date.now().toString(),
    createdAt: new Date(),
  }

  const updatedTags = [newTag, ...tags]
  saveTags(updatedTags)
  return newTag
}

// Atualizar tag
export const updateTag = (id: string, updates: Partial<Tag>): Tag | null => {
  const tags = getAllTags()
  const index = tags.findIndex((t) => t.id === id)

  if (index === -1) return null

  const updatedTag = { ...tags[index], ...updates }
  tags[index] = updatedTag
  saveTags(tags)
  return updatedTag
}

// Deletar tag
export const deleteTag = (id: string): boolean => {
  const tags = getAllTags()
  const filteredTags = tags.filter((t) => t.id !== id)

  if (filteredTags.length === tags.length) {
    return false
  }

  saveTags(filteredTags)
  return true
}
