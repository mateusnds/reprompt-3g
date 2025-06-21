export interface Review {
  id: string
  promptId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  createdAt: Date
  updatedAt: Date
  isVerifiedPurchase: boolean
  helpfulVotes: number
  reportedCount: number
  isHidden: boolean
}

const REVIEWS_STORAGE_KEY = "reprompt_reviews"

// Reviews de exemplo
const defaultReviews: Review[] = [
  {
    id: "1",
    promptId: "1",
    userId: "user-1",
    userName: "João Silva",
    rating: 5,
    comment:
      "Prompt incrível! Consegui gerar exatamente o que precisava. A qualidade das imagens é excepcional e o prompt é muito bem estruturado.",
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
    isVerifiedPurchase: true,
    helpfulVotes: 12,
    reportedCount: 0,
    isHidden: false,
  },
  {
    id: "2",
    promptId: "1",
    userId: "user-2",
    userName: "Maria Santos",
    rating: 4,
    comment:
      "Muito bom! Funcionou perfeitamente no Midjourney. Só precisei fazer pequenos ajustes para o meu projeto específico.",
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-17"),
    isVerifiedPurchase: true,
    helpfulVotes: 8,
    reportedCount: 0,
    isHidden: false,
  },
  {
    id: "3",
    promptId: "2",
    userId: "user-1",
    userName: "João Silva",
    rating: 5,
    comment:
      "Excelente para marketing! Estou usando para criar posts no Instagram da minha empresa e o engajamento aumentou muito.",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
    isVerifiedPurchase: true,
    helpfulVotes: 15,
    reportedCount: 0,
    isHidden: false,
  },
]

// Inicializar reviews
export const initializeReviews = (): Review[] => {
  if (typeof window === "undefined") return defaultReviews

  const stored = localStorage.getItem(REVIEWS_STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(defaultReviews))
    return defaultReviews
  }

  try {
    const parsed = JSON.parse(stored)
    return parsed.map((review: any) => ({
      ...review,
      createdAt: typeof review.createdAt === "string" ? new Date(review.createdAt) : review.createdAt,
      updatedAt: typeof review.updatedAt === "string" ? new Date(review.updatedAt) : review.updatedAt,
    }))
  } catch {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(defaultReviews))
    return defaultReviews
  }
}

// Obter todas as reviews
export const getAllReviews = (): Review[] => {
  return initializeReviews()
}

// Salvar reviews
export const saveReviews = (reviews: Review[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews))
  }
}

// Obter reviews de um prompt específico
export const getPromptReviews = (promptId: string): Review[] => {
  const reviews = getAllReviews()
  return reviews
    .filter((review) => review.promptId === promptId && !review.isHidden)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// Adicionar nova review
export const addReview = (review: Omit<Review, "id" | "createdAt" | "updatedAt">): Review => {
  const reviews = getAllReviews()
  const newReview: Review = {
    ...review,
    id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
    helpfulVotes: 0,
    reportedCount: 0,
    isHidden: false,
  }

  const updatedReviews = [newReview, ...reviews]
  saveReviews(updatedReviews)
  return newReview
}

// Adicionar função para verificar se usuário comprou o prompt
export const hasUserPurchased = (promptId: string, userId: string): boolean => {
  // Em produção, isso verificaria no banco de dados de compras
  // Por enquanto, vamos simular que apenas prompts gratuitos são "comprados"
  if (typeof window === "undefined") return false

  const purchases = localStorage.getItem("reprompt_purchases")
  if (!purchases) return false

  try {
    const purchaseList = JSON.parse(purchases)
    return purchaseList.some((purchase: any) => purchase.promptId === promptId && purchase.userId === userId)
  } catch {
    return false
  }
}

// Simular compra de um prompt
export const simulatePurchase = (promptId: string, userId: string): void => {
  if (typeof window === "undefined") return

  const purchases = localStorage.getItem("reprompt_purchases")
  const purchaseList = purchases ? JSON.parse(purchases) : []

  const newPurchase = {
    id: Date.now().toString(),
    promptId,
    userId,
    purchaseDate: new Date(),
    amount: 0, // Será preenchido com o valor real
  }

  purchaseList.push(newPurchase)
  localStorage.setItem("reprompt_purchases", JSON.stringify(purchaseList))
}

// Verificar se usuário já avaliou o prompt
export const hasUserReviewed = (promptId: string, userId: string): boolean => {
  const reviews = getAllReviews()
  return reviews.some((review) => review.promptId === promptId && review.userId === userId)
}

// Calcular estatísticas de avaliação
export const getPromptRatingStats = (promptId: string) => {
  const reviews = getPromptReviews(promptId)

  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    }
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
  const averageRating = totalRating / reviews.length

  const ratingDistribution = reviews.reduce(
    (dist, review) => {
      dist[review.rating as keyof typeof dist]++
      return dist
    },
    { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  )

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews: reviews.length,
    ratingDistribution,
  }
}

// Votar como útil
export const voteHelpful = (reviewId: string): boolean => {
  const reviews = getAllReviews()
  const reviewIndex = reviews.findIndex((r) => r.id === reviewId)

  if (reviewIndex === -1) return false

  reviews[reviewIndex].helpfulVotes++
  saveReviews(reviews)
  return true
}

// Reportar review
export const reportReview = (reviewId: string): boolean => {
  const reviews = getAllReviews()
  const reviewIndex = reviews.findIndex((r) => r.id === reviewId)

  if (reviewIndex === -1) return false

  reviews[reviewIndex].reportedCount++
  saveReviews(reviews)
  return true
}

// Deletar review (apenas o próprio usuário ou admin)
export const deleteReview = (reviewId: string, userId: string, isAdmin = false): boolean => {
  const reviews = getAllReviews()
  const review = reviews.find((r) => r.id === reviewId)

  if (!review) return false

  // Verificar permissão
  if (!isAdmin && review.userId !== userId) return false

  const filteredReviews = reviews.filter((r) => r.id !== reviewId)
  saveReviews(filteredReviews)
  return true
}
