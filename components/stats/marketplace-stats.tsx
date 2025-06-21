
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, FileText, DollarSign, Star, Download, Eye, Crown, Zap } from "lucide-react"

interface StatItemProps {
  icon: React.ReactNode
  value: string
  label: string
  description?: string
  trend?: string
}

function StatItem({ icon, value, label, description, trend }: StatItemProps) {
  return (
    <Card className="bg-gray-900 border-gray-700 hover:bg-gray-800 transition-colors">
      <CardContent className="p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white">
            {icon}
          </div>
        </div>
        <div className="text-3xl font-bold text-white mb-2">{value}</div>
        <div className="text-gray-300 font-medium mb-1">{label}</div>
        {description && (
          <div className="text-xs text-gray-400">{description}</div>
        )}
        {trend && (
          <div className="text-xs text-green-400 mt-2 flex items-center justify-center gap-1">
            <Zap className="w-3 h-3" />
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function MarketplaceStats() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="w-6 h-6 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">Marketplace Líder</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Confiado por milhares de 
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> criadores</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Junte-se ao maior marketplace de prompts de IA do Brasil e transforme sua criatividade em renda
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <StatItem
            icon={<Users className="w-8 h-8" />}
            value="50,000+"
            label="Usuários Ativos"
            description="Criadores e compradores"
            trend="+2.3k este mês"
          />
          <StatItem
            icon={<FileText className="w-8 h-8" />}
            value="25,000+"
            label="Prompts Disponíveis"
            description="Em todas as categorias"
            trend="+180 hoje"
          />
          <StatItem
            icon={<DollarSign className="w-8 h-8" />}
            value="$2.5M+"
            label="Vendas Totais"
            description="Receita dos criadores"
            trend="+15% este mês"
          />
          <StatItem
            icon={<Star className="w-8 h-8" />}
            value="4.9"
            label="Avaliação Média"
            description="Satisfação dos usuários"
            trend="98% satisfeitos"
          />
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatItem
            icon={<Download className="w-8 h-8" />}
            value="1.2M+"
            label="Downloads Mensais"
            description="Prompts baixados"
            trend="+25% vs mês anterior"
          />
          <StatItem
            icon={<Eye className="w-8 h-8" />}
            value="500K+"
            label="Visualizações Diárias"
            description="Páginas de prompts"
            trend="Pico: 850k/dia"
          />
          <StatItem
            icon={<Crown className="w-8 h-8" />}
            value="5,000+"
            label="Criadores Ativos"
            description="Vendendo regularmente"
            trend="+12% crescimento"
          />
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="text-gray-400">
              <div className="font-semibold text-lg">99.9%</div>
              <div className="text-sm">Uptime</div>
            </div>
            <div className="text-gray-400">
              <div className="font-semibold text-lg">24/7</div>
              <div className="text-sm">Suporte</div>
            </div>
            <div className="text-gray-400">
              <div className="font-semibold text-lg">SSL</div>
              <div className="text-sm">Segurança</div>
            </div>
            <div className="text-gray-400">
              <div className="font-semibold text-lg">100%</div>
              <div className="text-sm">Garantia</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
