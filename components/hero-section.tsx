"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      // Se não há termo de busca, vai para a página de explorar
      router.push("/buscar")
    }
  }

  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black py-20">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            O Maior Marketplace de <span className="animated-gradient-text">Prompts de IA</span> do Brasil
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Descubra, compre e venda os melhores prompts para ChatGPT, Claude, Midjourney e outras IAs. Transforme suas
            ideias em resultados incríveis.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Ex: prompts para marketing, design, código..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-12 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Buscar Prompts
            </Button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .animated-gradient-text {
          background: linear-gradient(
            45deg,
            #dc2626,
            #ea580c,
            #d97706,
            #ca8a04,
            #65a30d,
            #16a34a,
            #059669,
            #0891b2,
            #0284c7,
            #2563eb,
            #4f46e5,
            #7c3aed,
            #9333ea,
            #c026d3,
            #db2777,
            #e11d48
          );
          background-size: 400% 400%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 4s ease-in-out infinite;
          font-weight: 800;
          display: inline-block;
          filter: brightness(1.2) saturate(1.3);
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
            filter: hue-rotate(0deg) saturate(1.3) brightness(1.2);
          }
          25% {
            background-position: 100% 50%;
            filter: hue-rotate(90deg) saturate(1.5) brightness(1.3);
          }
          50% {
            background-position: 100% 100%;
            filter: hue-rotate(180deg) saturate(1.1) brightness(1.1);
          }
          75% {
            background-position: 0% 100%;
            filter: hue-rotate(270deg) saturate(1.4) brightness(1.2);
          }
          100% {
            background-position: 0% 50%;
            filter: hue-rotate(360deg) saturate(1.3) brightness(1.2);
          }
        }
      `}</style>
    </section>
  )
}
