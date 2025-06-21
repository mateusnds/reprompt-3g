"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Star, ThumbsUp, Flag, User, CheckCircle, AlertCircle } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
// Importar as novas funções
import {
  getPromptReviews,
  addReview,
  hasUserReviewed,
  getPromptRatingStats,
  voteHelpful,
  reportReview,
  hasUserPurchased,
  simulatePurchase,
} from "@/lib/reviews-storage"
import { formatDate } from "@/lib/utils"
import type { Review } from "@/lib/reviews-storage"

interface ReviewsSectionProps {
  promptId: string
  promptTitle: string
}

export default function ReviewsSection({ promptId, promptTitle }: ReviewsSectionProps) {

export { ReviewsSection }
  const [reviews, setReviews] = useState<Review[]>([])
  const [ratingStats, setRatingStats] = useState<any>(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  // No componente ReviewsSection, adicionar estado para verificar compra
  const [hasPurchased, setHasPurchased] = useState(false)

  const user = getCurrentUser()

  // No useEffect, verificar se o usuário comprou
  useEffect(() => {
    loadReviews()
    if (user) {
      setHasPurchased(hasUserPurchased(promptId, user.id))
    }
  }, [promptId, user])

  const loadReviews = () => {
    const promptReviews = getPromptReviews(promptId)
    const stats = getPromptRatingStats(promptId)
    setReviews(promptReviews)
    setRatingStats(stats)
  }

  // Atualizar a função handleSubmitReview
  const handleSubmitReview = async () => {
    if (!user) {
      setError("Você precisa estar logado para avaliar")
      return
    }

    if (newRating === 0) {
      setError("Selecione uma avaliação de 1 a 5 estrelas")
      return
    }

    if (!newComment.trim()) {
      setError("Escreva um comentário sobre o prompt")
      return
    }

    if (hasUserReviewed(promptId, user.id)) {
      setError("Você já avaliou este prompt")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Verificar se o usuário comprou o prompt
      const isPurchased = hasUserPurchased(promptId, user.id)

      addReview({
        promptId,
        userId: user.id,
        userName: user.name,
        rating: newRating,
        comment: newComment.trim(),
        isVerifiedPurchase: isPurchased, // Usar verificação real
      })

      setSuccess("Avaliação enviada com sucesso!")
      setNewRating(0)
      setNewComment("")
      setShowReviewForm(false)
      loadReviews()

      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError("Erro ao enviar avaliação. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleVoteHelpful = (reviewId: string) => {
    voteHelpful(reviewId)
    loadReviews()
  }

  const handleReportReview = (reviewId: string) => {
    if (confirm("Deseja reportar esta avaliação como inadequada?")) {
      reportReview(reviewId)
      setSuccess("Avaliação reportada. Nossa equipe irá analisar.")
      setTimeout(() => setSuccess(null), 3000)
    }
  }

  const renderStars = (rating: number, interactive = false, onStarClick?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={() => interactive && onStarClick?.(star)}
          />
        ))}
      </div>
    )
  }

  const renderRatingDistribution = () => {
    if (!ratingStats || ratingStats.totalReviews === 0) return null

    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingStats.ratingDistribution[rating]
          const percentage = (count / ratingStats.totalReviews) * 100

          return (
            <div key={rating} className="flex items-center space-x-3">
              <span className="text-sm text-gray-400 w-8">{rating}★</span>
              <Progress value={percentage} className="flex-1 h-2" />
              <span className="text-sm text-gray-400 w-8">{count}</span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas de Avaliação */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Avaliações e Comentários</CardTitle>
        </CardHeader>
        <CardContent>
          {ratingStats && ratingStats.totalReviews > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">{ratingStats.averageRating.toFixed(1)}</div>
                {renderStars(Math.round(ratingStats.averageRating))}
                <p className="text-gray-400 mt-2">
                  {ratingStats.totalReviews} {ratingStats.totalReviews === 1 ? "avaliação" : "avaliações"}
                </p>
              </div>
              <div>{renderRatingDistribution()}</div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">Este prompt ainda não foi avaliado</p>
              <p className="text-gray-500 text-sm">Seja o primeiro a compartilhar sua experiência!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mensagens */}
      {success && (
        <Alert className="bg-green-900/20 border-green-500/20">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-300">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="bg-red-900/20 border-red-500/20">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-300">{error}</AlertDescription>
        </Alert>
      )}

      {/* Formulário de Avaliação */}
      {user && !hasUserReviewed(promptId, user.id) && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Avaliar este Prompt</CardTitle>
              {!showReviewForm && (
                <Button
                  onClick={() => setShowReviewForm(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Escrever Avaliação
                </Button>
              )}
            </div>
          </CardHeader>
          {showReviewForm && (
            <CardContent className="space-y-4">
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Sua Avaliação *</label>
                {renderStars(newRating, true, setNewRating)}
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-2 block">Seu Comentário *</label>
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Compartilhe sua experiência com este prompt..."
                  className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSubmitReview}
                  disabled={loading || newRating === 0 || !newComment.trim()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {loading ? "Enviando..." : "Enviar Avaliação"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReviewForm(false)
                    setNewRating(0)
                    setNewComment("")
                    setError(null)
                  }}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Botão de Teste - Simular Compra */}
      {user && !hasPurchased && process.env.NODE_ENV === "development" && (
        <Card className="bg-yellow-900/20 border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 font-medium">Modo de Teste</p>
                <p className="text-yellow-200 text-sm">Simule uma compra para testar a verificação</p>
              </div>
              <Button
                onClick={() => {
                  simulatePurchase(promptId, user.id)
                  setHasPurchased(true)
                  setSuccess("Compra simulada! Agora você pode avaliar com 'Compra Verificada'")
                  setTimeout(() => setSuccess(null), 3000)
                }}
                variant="outline"
                className="border-yellow-500 text-yellow-300 hover:bg-yellow-500/10"
              >
                Simular Compra
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Avaliações */}
      {reviews.length > 0 && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Comentários ({reviews.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-700 pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-white font-semibold">{review.userName}</span>
                      {review.isVerifiedPurchase && (
                        <Badge className="bg-green-600 text-white text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Compra Verificada
                        </Badge>
                      )}
                      <span className="text-gray-400 text-sm">{formatDate(review.createdAt)}</span>
                    </div>

                    <div className="mb-3">{renderStars(review.rating)}</div>

                    <p className="text-gray-300 mb-4">{review.comment}</p>

                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVoteHelpful(review.id)}
                        className="text-gray-400 hover:text-white"
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Útil ({review.helpfulVotes})
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReportReview(review.id)}
                        className="text-gray-400 hover:text-red-400"
                      >
                        <Flag className="w-4 h-4 mr-1" />
                        Reportar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Prompt para Login */}
      {!user && (
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-6 text-center">
            <p className="text-gray-400 mb-4">Faça login para avaliar e comentar este prompt</p>
            <Button
              onClick={() => (window.location.href = "/login")}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
