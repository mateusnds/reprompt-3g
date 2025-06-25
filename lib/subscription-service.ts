"use client"

import { supabase } from './supabase'
import type { SubscriptionPlan, UserSubscription, PaymentMethod } from './types'

export class SubscriptionService {
  // Buscar todos os planos ativos
  static async getPlans(): Promise<SubscriptionPlan[]> {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar planos:', error)
      return []
    }
  }

  // Buscar plano por slug
  static async getPlanBySlug(slug: string): Promise<SubscriptionPlan | null> {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao buscar plano:', error)
      return null
    }
  }

  // Buscar assinatura ativa do usuário
  static async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans (*)
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .gte('end_date', new Date().toISOString())
        .single()

      if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
      return data
    } catch (error) {
      console.error('Erro ao buscar assinatura:', error)
      return null
    }
  }

  // Verificar se usuário tem assinatura ativa
  static async hasActiveSubscription(userId: string): Promise<boolean> {
    const subscription = await this.getUserSubscription(userId)
    return !!subscription
  }

  // Criar nova assinatura
  static async createSubscription(
    userId: string, 
    planId: string, 
    paymentMethod: string
  ): Promise<UserSubscription | null> {
    try {
      // Buscar o plano
      const plan = await this.getPlanBySlug(planId)
      if (!plan) throw new Error('Plano não encontrado')

      // Calcular datas
      const startDate = new Date()
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + plan.durationMonths)

      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          plan_id: plan.id,
          status: 'pending',
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          auto_renew: true,
          payment_method: paymentMethod
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao criar assinatura:', error)
      return null
    }
  }

  // Atualizar status da assinatura
  static async updateSubscriptionStatus(
    subscriptionId: string, 
    status: 'active' | 'cancelled' | 'expired'
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      return false
    }
  }

  // Buscar métodos de pagamento do usuário
  static async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar métodos de pagamento:', error)
      return []
    }
  }

  // Adicionar método de pagamento
  static async addPaymentMethod(
    userId: string,
    type: 'credit_card' | 'pix' | 'paypal',
    last4?: string,
    brand?: string
  ): Promise<PaymentMethod | null> {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: userId,
          type,
          last4,
          brand,
          is_default: false
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao adicionar método de pagamento:', error)
      return null
    }
  }

  // Verificar se pode baixar prompt
  static async canDownloadPrompt(userId: string, promptPrice: number): Promise<boolean> {
    // Se é gratuito, sempre pode baixar
    if (promptPrice === 0) return true

    // Se tem assinatura ativa, pode baixar qualquer prompt
    const hasSubscription = await this.hasActiveSubscription(userId)
    if (hasSubscription) return true

    // Caso contrário, precisa comprar individualmente
    return false
  }

  // Buscar benefícios da assinatura
  static async getSubscriptionBenefits(userId: string) {
    const hasSubscription = await this.hasActiveSubscription(userId)
    
    return {
      unlimitedDownloads: hasSubscription,
      premiumAccess: hasSubscription,
      prioritySupport: hasSubscription,
      earlyAccess: hasSubscription,
      betaAccess: hasSubscription,
      refundGuarantee: hasSubscription
    }
  }

  // Formatar preço
  static formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  // Calcular preço mensal
  static calculateMonthlyPrice(plan: SubscriptionPlan): number {
    return plan.price / plan.durationMonths
  }

  // Calcular desconto
  static getDiscountAmount(plan: SubscriptionPlan): number {
    if (!plan.originalPrice) return 0
    return plan.originalPrice - plan.price
  }

  // Calcular porcentagem de desconto
  static getDiscountPercentage(plan: SubscriptionPlan): number {
    if (!plan.originalPrice) return 0
    return Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)
  }
} 