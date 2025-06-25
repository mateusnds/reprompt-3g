"use client"

import type { SubscriptionPlan, UserSubscription } from './types'

// Dados mockados para demonstração
const mockPlans: SubscriptionPlan[] = [
  {
    id: "1",
    name: "Plano Mensal",
    slug: "mensal",
    description: "Perfeito para começar e testar a plataforma",
    price: 49.90,
    duration: "monthly",
    durationMonths: 1,
    features: [
      "Acesso a todos os prompts premium",
      "Downloads ilimitados",
      "Suporte por email",
      "Acesso antecipado a novos prompts",
      "Dashboard básico de analytics"
    ],
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "Plano Trimestral",
    slug: "trimestral",
    description: "Melhor custo-benefício com desconto especial",
    price: 149.70,
    originalPrice: 149.70,
    duration: "quarterly",
    durationMonths: 3,
    features: [
      "Acesso a todos os prompts premium",
      "Downloads ilimitados",
      "Suporte prioritário",
      "Acesso antecipado a novos prompts",
      "Dashboard de analytics",
      "15% de desconto no valor total"
    ],
    isPopular: true,
    isActive: true,
    discountPercentage: 15,
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    name: "Plano Anual",
    slug: "anual",
    description: "Máximo desconto e benefícios exclusivos",
    price: 499.90,
    originalPrice: 598.80,
    duration: "annual",
    durationMonths: 12,
    features: [
      "Acesso a todos os prompts premium",
      "Downloads ilimitados",
      "Suporte prioritário 24/7",
      "Acesso antecipado a novos prompts",
      "Dashboard de analytics avançado",
      "30% de desconto no valor total",
      "2 meses grátis",
      "Acesso exclusivo a prompts beta"
    ],
    isActive: true,
    discountPercentage: 30,
    createdAt: new Date().toISOString()
  }
]

// Simular assinatura ativa do usuário (em produção, viria do banco)
const mockUserSubscription: UserSubscription | null = null

export const getSubscriptionPlans = (): SubscriptionPlan[] => {
  return mockPlans
}

export const getPlanBySlug = (slug: string): SubscriptionPlan | null => {
  return mockPlans.find(plan => plan.slug === slug) || null
}

export const getUserSubscription = (userId: string): UserSubscription | null => {
  // Em produção, buscar do banco de dados
  return mockUserSubscription
}

export const hasActiveSubscription = (userId: string): boolean => {
  const subscription = getUserSubscription(userId)
  if (!subscription) return false
  
  const now = new Date()
  const endDate = new Date(subscription.endDate)
  
  return subscription.status === 'active' && endDate > now
}

export const canDownloadPrompt = (userId: string, promptPrice: number): boolean => {
  // Se o prompt é gratuito, sempre pode baixar
  if (promptPrice === 0) return true
  
  // Se tem assinatura ativa, pode baixar qualquer prompt
  if (hasActiveSubscription(userId)) return true
  
  // Caso contrário, precisa comprar individualmente
  return false
}

export const getSubscriptionBenefits = (userId: string) => {
  const hasSubscription = hasActiveSubscription(userId)
  
  return {
    unlimitedDownloads: hasSubscription,
    premiumAccess: hasSubscription,
    prioritySupport: hasSubscription,
    earlyAccess: hasSubscription,
    betaAccess: hasSubscription,
    refundGuarantee: hasSubscription
  }
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price)
}

export const calculateMonthlyPrice = (plan: SubscriptionPlan): number => {
  return plan.price / plan.durationMonths
}

export const getDiscountAmount = (plan: SubscriptionPlan): number => {
  if (!plan.originalPrice) return 0
  return plan.originalPrice - plan.price
}

export const getDiscountPercentage = (plan: SubscriptionPlan): number => {
  if (!plan.originalPrice) return 0
  return Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)
} 