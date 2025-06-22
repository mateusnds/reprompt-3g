
export interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
  avatar?: string
  createdAt: string
  updatedAt: string
}

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
  authorAvatar?: string
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
  images: string[]
  videoUrl?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  license: 'personal' | 'commercial' | 'extended'
  isFree: boolean
  isPaid: boolean
  isAdminCreated: boolean
  isActive: boolean
  prompt?: string // alias para content
}

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  description?: string
  orderNum: number
  isActive: boolean
  createdAt: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  category?: string
  isActive: boolean
  createdAt: string
}

export interface Review {
  id: string
  promptId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  comment?: string
  isVerifiedPurchase: boolean
  helpfulVotes: number
  reported: boolean
  createdAt: string
}

export interface Purchase {
  id: string
  userId: string
  promptId: string
  price: number
  status: 'completed' | 'pending' | 'cancelled'
  createdAt: string
}

export interface SearchFilters {
  category?: string
  priceFilter?: 'all' | 'free' | 'paid'
  tags?: string[]
  sortBy?: 'newest' | 'oldest' | 'rating' | 'downloads' | 'views' | 'price-low' | 'price-high'
  aiTool?: string
}
