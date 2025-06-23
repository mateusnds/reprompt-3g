import { universalSearch, type UniversalSearchFilters } from '@/lib/prompts-storage'

// Presets seguros e otimizados para busca
export const searchPresets = {
  // Prompts em destaque na página inicial
  featured: (): Promise<any[]> => universalSearch({
    featured: true,
    isActive: true,
    limit: 6,
    sortBy: 'rating'
  }),

  // Prompts gratuitos
  free: (): Promise<any[]> => universalSearch({
    priceFilter: 'free',
    isActive: true,
    limit: 12,
    sortBy: 'downloads'
  }),

  // Prompts mais populares
  popular: (): Promise<any[]> => universalSearch({
    isActive: true,
    sortBy: 'downloads',
    limit: 12
  }),

  // Prompts recentes
  recent: (): Promise<any[]> => universalSearch({
    isActive: true,
    sortBy: 'newest',
    limit: 12
  }),

  // Por categoria
  byCategory: (category: string): Promise<any[]> => universalSearch({
    category,
    isActive: true,
    sortBy: 'rating',
    limit: 20
  }),

  // Para administração - todos os prompts
  admin: (filters?: Partial<UniversalSearchFilters>): Promise<any[]> => 
    universalSearch({
      isActive: undefined, // Incluir inativos também
      sortBy: 'newest',
      limit: 100,
      ...filters
    })
}

// Cache simples para performance
const cache = new Map<string, { data: any[], timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

export const getCachedSearch = async (key: string, searchFn: () => Promise<any[]>): Promise<any[]> => {
  const cached = cache.get(key)
  const now = Date.now()

  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.data
  }

  const data = await searchFn()
  cache.set(key, { data, timestamp: now })

  return data
}