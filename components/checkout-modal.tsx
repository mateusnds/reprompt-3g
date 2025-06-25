"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, CreditCard, QrCode, Paypal } from "lucide-react"
import type { SubscriptionPlan } from "@/lib/types"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  plan: SubscriptionPlan | null
}

export default function CheckoutModal({ isOpen, onClose, plan }: CheckoutModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card")
  const [loading, setLoading] = useState(false)

  if (!plan) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const handleCheckout = async () => {
    setLoading(true)
    // Simular processamento de pagamento
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
    onClose()
    // Aqui você implementaria a integração real com gateway de pagamento
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Finalizar Assinatura
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plano Selecionado */}
          <Card className="bg-gray-800 border-gray-600">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-white">{plan.name}</h3>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>
                {plan.isPopular && (
                  <Badge className="bg-purple-600 text-white text-xs">
                    Popular
                  </Badge>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">
                  {formatPrice(plan.price)}
                </span>
                {plan.originalPrice && plan.originalPrice > plan.price && (
                  <span className="text-gray-500 line-through">
                    {formatPrice(plan.originalPrice)}
                  </span>
                )}
                <span className="text-gray-400 text-sm">
                  /{plan.duration === 'monthly' ? 'mês' : 
                     plan.duration === 'quarterly' ? '3 meses' : 'ano'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Método de Pagamento */}
          <div className="space-y-4">
            <Label className="text-white">Método de Pagamento</Label>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="credit_card"
                  name="payment"
                  value="credit_card"
                  checked={paymentMethod === "credit_card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-purple-600"
                />
                <Label htmlFor="credit_card" className="flex items-center gap-2 text-white cursor-pointer">
                  <CreditCard className="w-4 h-4" />
                  Cartão de Crédito/Débito
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="pix"
                  name="payment"
                  value="pix"
                  checked={paymentMethod === "pix"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-purple-600"
                />
                <Label htmlFor="pix" className="flex items-center gap-2 text-white cursor-pointer">
                  <QrCode className="w-4 h-4" />
                  PIX
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="paypal"
                  name="payment"
                  value="paypal"
                  checked={paymentMethod === "paypal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-purple-600"
                />
                <Label htmlFor="paypal" className="flex items-center gap-2 text-white cursor-pointer">
                  <Paypal className="w-4 h-4" />
                  PayPal
                </Label>
              </div>
            </div>
          </div>

          {/* Campos do Cartão (se selecionado) */}
          {paymentMethod === "credit_card" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="card_number" className="text-white">Número do Cartão</Label>
                <Input
                  id="card_number"
                  placeholder="1234 5678 9012 3456"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry" className="text-white">Validade</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/AA"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv" className="text-white">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="card_name" className="text-white">Nome no Cartão</Label>
                <Input
                  id="card_name"
                  placeholder="Nome como está no cartão"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
          )}

          {/* Resumo */}
          <div className="border-t border-gray-700 pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Subtotal:</span>
              <span className="text-white">{formatPrice(plan.price)}</span>
            </div>
            {plan.discountPercentage && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-green-400">Desconto ({plan.discountPercentage}%):</span>
                <span className="text-green-400">-{formatPrice(plan.originalPrice! - plan.price)}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-lg font-semibold">
              <span className="text-white">Total:</span>
              <span className="text-white">{formatPrice(plan.price)}</span>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCheckout}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {loading ? "Processando..." : "Finalizar Compra"}
            </Button>
          </div>

          {/* Segurança */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
              <Check className="w-4 h-4 text-green-400" />
              <span>Pagamento 100% seguro</span>
            </div>
            <p className="text-gray-500 text-xs mt-1">
              Seus dados estão protegidos com criptografia SSL
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 