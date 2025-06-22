
import { universalSearch, type UniversalSearchFilters } from '@/lib/prompts-storage'

// Presets de busca para diferentes seções do site
export const searchPresets = {
  // Prompts em destaque na homepage
  featured: (): Promise<any[]> => universalSearch({ 
    featured: true, 
    sortBy: 'trending',
    limit: 6
  }),

  // Prompts gratuitos
  free: (): Promise<any[]> => universalSearch({ 
    priceFilter: 'free', 
    sortBy: 'popular',
    limit: 20
  }),

  // Mais avaliados
  topRated: (): Promise<any[]> => universalSearch({ 
    minRating: 4, 
    sortBy: 'rating',
    limit: 20
  }),

  // Novidades
  newest: (): Promise<any[]> => universalSearch({ 
    sortBy: 'newest',
    limit: 20
  }),

  // Populares
  popular: (): Promise<any[]> => universalSearch({ 
    minViews: 100, 
    sortBy: 'popular',
    limit: 20
  }),

  // Trending (em alta)
  trending: (): Promise<any[]> => universalSearch({ 
    sortBy: 'trending',
    limit: 20
  }),

  // Por categoria
  byCategory: (category: string): Promise<any[]> => universalSearch({ 
    category,
    sortBy: 'newest'
  }),

  // Busca geral com texto
  search: (query: string, filters?: Partial<UniversalSearchFilters>): Promise<any[]> => 
    universalSearch({
      query,
      ...filters
    }),

  // Explorar todos
  explore: (filters?: Partial<UniversalSearchFilters>): Promise<any[]> => 
    universalSearch({
      sortBy: 'newest',
      limit: 50,
      ...filters
    }),

  // Categorias populares para navegação
  popularCategories: (): Promise<any[]> => universalSearch({
    sortBy: 'popular',
    limit: 100
  }).then(prompts => {
    // Agrupar por categoria e contar
    const categoryCount: Record<string, number> = {}
    prompts.forEach(prompt => {
      categoryCount[prompt.category] = (categoryCount[prompt.category] || 0) + 1
    })
    
    return Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .map(([category, count]) => ({ category, count }))
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

// Helper para busca com cache simples
const searchCache = new Map<string, { data: any[], timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

export const cachedSearch = async (key: string, searchFn: () => Promise<any[]>): Promise<any[]> => {
  const cached = searchCache.get(key)
  const now = Date.now()
  
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.data
  }
  
  const data = await searchFn()
  searchCache.set(key, { data, timestamp: now })
  
  return data
}

// Aliases para facilitar o uso
export const searchFeatured = searchPresets.featured
export const searchFree = searchPresets.free
export const searchTopRated = searchPresets.topRated
export const searchNewest = searchPresets.newest
export const searchPopular = searchPresets.popular
export const searchTrending = searchPresets.trending
export const searchByCategory = searchPresets.byCategory
export const searchGeneral = searchPresets.search
export const exploreAll = searchPresets.explore
