
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, FileText, DollarSign, Star } from "lucide-react"

interface StatItemProps {
  icon: React.ReactNode
  value: string
  label: string
}

function StatItem({ icon, value, label }: StatItemProps) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardContent className="p-6 text-center">
        <div className="flex justify-center mb-4 text-purple-500">
          {icon}
        </div>
        <div className="text-2xl font-bold text-white mb-2">{value}</div>
        <div className="text-gray-400 text-sm">{label}</div>
      </CardContent>
    </Card>
  )
}

export function MarketplaceStats() {
  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Trusted by thousands of creators
          </h2>
          <p className="text-gray-400 text-lg">
            Join the largest AI prompt marketplace in Brazil
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatItem
            icon={<Users className="w-8 h-8" />}
            value="50,000+"
            label="Usuários Ativos"
          />
          <StatItem
            icon={<FileText className="w-8 h-8" />}
            value="10,000+"
            label="Prompts Disponíveis"
          />
          <StatItem
            icon={<DollarSign className="w-8 h-8" />}
            value="$2M+"
            label="Vendas Totais"
          />
          <StatItem
            icon={<Star className="w-8 h-8" />}
            value="4.9"
            label="Avaliação Média"
          />
        </div>
      </div>
    </section>
  )
}
