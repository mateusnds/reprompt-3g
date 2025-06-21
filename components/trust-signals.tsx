
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Award, Users, Clock, Star, Zap } from "lucide-react"

export function TrustSignals() {
  const trustFactors = [
    {
      icon: Shield,
      title: "Segurança Garantida",
      description: "Pagamentos seguros e dados protegidos com SSL 256-bit",
      color: "text-green-400"
    },
    {
      icon: Award,
      title: "Qualidade Certificada",
      description: "Todos os prompts passam por revisão de especialistas",
      color: "text-yellow-400"
    },
    {
      icon: Users,
      title: "Comunidade Ativa",
      description: "Mais de 50.000 criadores e 200.000 usuários ativos",
      color: "text-blue-400"
    },
    {
      icon: Clock,
      title: "Suporte 24/7",
      description: "Atendimento especializado em português todos os dias",
      color: "text-purple-400"
    }
  ]

  const achievements = [
    { label: "Marketplace #1 do Brasil", icon: "🏆" },
    { label: "Nota 4.9/5 no Trustpilot", icon: "⭐" },
    { label: "Certificado ISO 27001", icon: "🛡️" },
    { label: "Parceiro OpenAI Oficial", icon: "🤝" }
  ]

  return (
    <section className="py-16 bg-gray-800/50" aria-labelledby="trust-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 id="trust-heading" className="text-3xl font-bold text-white mb-4">
            Por Que Confiar na Reprompt?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Somos a plataforma de prompts de IA mais confiável do Brasil, com certificações e parcerias que garantem qualidade e segurança.
          </p>
        </div>

        {/* Trust Factors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {trustFactors.map((factor, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors">
              <CardContent className="p-6 text-center">
                <factor.icon className={`w-12 h-12 mx-auto mb-4 ${factor.color}`} />
                <h3 className="text-lg font-semibold text-white mb-2">{factor.title}</h3>
                <p className="text-gray-400 text-sm">{factor.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievements */}
        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Reconhecimentos e Certificações</h3>
            <p className="text-gray-300">Conquistamos a confiança de milhares de usuários e parceiros</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {achievements.map((achievement, index) => (
              <Badge key={index} variant="outline" className="border-gray-600 text-gray-300 px-4 py-2 text-sm">
                <span className="mr-2">{achievement.icon}</span>
                {achievement.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* User Testimonial */}
        <div className="mt-12 text-center">
          <blockquote className="text-xl italic text-gray-300 max-w-3xl mx-auto mb-4">
            "A Reprompt transformou meu trabalho como designer. Os prompts são de alta qualidade e realmente funcionam. 
            Economizo horas de teste e obtenho resultados profissionais consistentes."
          </blockquote>
          <cite className="text-purple-400 font-semibold">
            — Marina Costa, Designer UX/UI na Tech Startup
          </cite>
        </div>
      </div>
    </section>
  )
}
