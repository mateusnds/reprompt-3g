"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Zap, 
  Crown, 
  Star, 
  Download, 
  Clock, 
  Shield, 
  Users, 
  Sparkles,
  CheckCircle,
  Infinity
} from "lucide-react"
import Link from "next/link"

const benefits = [
  {
    icon: Infinity,
    title: "Downloads Ilimitados",
    description: "Baixe quantos prompts quiser, sem limites mensais",
    color: "text-blue-400"
  },
  {
    icon: Crown,
    title: "Prompts Premium",
    description: "Acesso exclusivo aos melhores prompts criados por especialistas",
    color: "text-purple-400"
  },
  {
    icon: Clock,
    title: "Acesso Antecipado",
    description: "Seja o primeiro a testar novos prompts antes do lançamento",
    color: "text-green-400"
  },
  {
    icon: Star,
    title: "Suporte Prioritário",
    description: "Atendimento VIP com resposta em até 2 horas",
    color: "text-yellow-400"
  },
  {
    icon: Shield,
    title: "Garantia de 7 Dias",
    description: "Reembolso integral se não ficar satisfeito",
    color: "text-red-400"
  },
  {
    icon: Sparkles,
    title: "Prompts Beta",
    description: "Acesso exclusivo a prompts em desenvolvimento",
    color: "text-pink-400"
  }
]

const stats = [
  { label: "Prompts Premium", value: "50,000+", icon: Crown },
  { label: "Usuários Ativos", value: "25,000+", icon: Users },
  { label: "Downloads/Mês", value: "150,000+", icon: Download },
  { label: "Avaliação Média", value: "4.9/5", icon: Star }
]

export default function PremiumBenefits() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-purple-900/10 to-blue-900/10" aria-labelledby="benefits-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-6 h-6 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">Benefícios Premium</span>
          </div>
          <h2 id="benefits-heading" className="text-4xl font-bold text-white mb-4">
            Por que escolher o 
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Premium</span>?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Desbloqueie todo o potencial da IA com acesso ilimitado aos melhores prompts 
            criados por especialistas e uma experiência premium completa.
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gray-900/80 border-gray-700 text-center">
              <CardContent className="p-6">
                <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefícios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {benefits.map((benefit, index) => (
            <Card key={index} className="bg-gray-900/80 border-gray-700 hover:border-purple-500/50 transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-gray-800 group-hover:bg-gray-700 transition-colors`}>
                    <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparação */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="bg-gray-900/80 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white text-center">
                Comparação de Planos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-4 text-gray-400 font-medium">Recurso</th>
                      <th className="text-center py-4 text-gray-400 font-medium">Gratuito</th>
                  <th className="text-center py-4 text-purple-400 font-medium">Premium</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-4">
                    <tr className="border-b border-gray-800">
                      <td className="py-4 text-white">Downloads por mês</td>
                      <td className="text-center py-4 text-gray-400">5</td>
                      <td className="text-center py-4 text-white">
                        <Infinity className="w-5 h-5 mx-auto text-green-400" />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-4 text-white">Prompts Premium</td>
                      <td className="text-center py-4 text-gray-400">
                        <span className="text-red-400">✗</span>
                      </td>
                      <td className="text-center py-4 text-white">
                        <CheckCircle className="w-5 h-5 mx-auto text-green-400" />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-4 text-white">Suporte Prioritário</td>
                      <td className="text-center py-4 text-gray-400">
                        <span className="text-red-400">✗</span>
                      </td>
                      <td className="text-center py-4 text-white">
                        <CheckCircle className="w-5 h-5 mx-auto text-green-400" />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-4 text-white">Acesso Antecipado</td>
                      <td className="text-center py-4 text-gray-400">
                        <span className="text-red-400">✗</span>
                      </td>
                      <td className="text-center py-4 text-white">
                        <CheckCircle className="w-5 h-5 mx-auto text-green-400" />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-4 text-white">Garantia de Reembolso</td>
                      <td className="text-center py-4 text-gray-400">
                        <span className="text-red-400">✗</span>
                      </td>
                      <td className="text-center py-4 text-white">
                        <CheckCircle className="w-5 h-5 mx-auto text-green-400" />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 text-white">Prompts Beta</td>
                      <td className="text-center py-4 text-gray-400">
                        <span className="text-red-400">✗</span>
                      </td>
                      <td className="text-center py-4 text-white">
                        <CheckCircle className="w-5 h-5 mx-auto text-green-400" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/20 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Pronto para desbloquear todo o potencial?
            </h3>
            <p className="text-gray-300 mb-6">
              Junte-se a milhares de usuários que já estão criando conteúdo incrível com IA.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/planos">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-3 rounded-xl">
                  <Crown className="w-5 h-5 mr-2" />
                  Ver Planos Premium
                </Button>
              </Link>
              <Link href="/buscar">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-3 rounded-xl">
                  Explorar Prompts Gratuitos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 