
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, HelpCircle, MessageCircle, Mail, Phone } from "lucide-react"
import { FAQSection } from "@/components/faq-section"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

const mockFAQs: FAQ[] = [
  {
    id: "1",
    question: "Como funciona o marketplace de prompts?",
    answer: "Nosso marketplace conecta criadores de prompts com usuários que precisam de prompts de qualidade. Você pode comprar, vender e descobrir prompts para diversas ferramentas de IA como Midjourney, DALL-E, ChatGPT e muito mais.",
    category: "Geral"
  },
  {
    id: "2",
    question: "Como posso vender meus prompts?",
    answer: "Para vender prompts, você precisa criar uma conta, acessar o dashboard e clicar em 'Adicionar Novo Prompt'. Defina o título, descrição, preço e faça upload das imagens de exemplo. Nosso time revisará seu prompt antes da publicação.",
    category: "Vendas"
  },
  {
    id: "3",
    question: "Quais formas de pagamento são aceitas?",
    answer: "Aceitamos cartão de crédito, débito, PIX, boleto bancário e PayPal. Todos os pagamentos são processados de forma segura através de nossos parceiros certificados.",
    category: "Pagamentos"
  },
  {
    id: "4",
    question: "Posso solicitar reembolso?",
    answer: "Sim, oferecemos reembolso integral em até 7 dias após a compra se você não estiver satisfeito com o prompt. Basta entrar em contato com nosso suporte.",
    category: "Pagamentos"
  },
  {
    id: "5",
    question: "Como funciona o sistema de avaliações?",
    answer: "Apenas usuários que compraram o prompt podem avaliá-lo. As avaliações incluem nota de 1 a 5 estrelas e comentários. Isso ajuda outros usuários a tomar decisões informadas.",
    category: "Avaliações"
  },
  {
    id: "6",
    question: "Que tipos de prompts posso encontrar?",
    answer: "Temos prompts para Midjourney, DALL-E, Stable Diffusion, ChatGPT, Claude, Leonardo AI e muitas outras ferramentas. As categorias incluem arte, fotografia, design, texto, código e muito mais.",
    category: "Prompts"
  }
]

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>(mockFAQs)
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>(mockFAQs)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")

  useEffect(() => {
    let filtered = faqs

    // Filter by category
    if (selectedCategory !== "Todos") {
      filtered = filtered.filter(faq => faq.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
      )
    }

    setFilteredFaqs(filtered)
  }, [faqs, selectedCategory, searchQuery])

  const categories = Array.from(new Set(faqs.map(faq => faq.category)))

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="w-8 h-8 text-purple-400" />
            <span className="text-purple-400 font-semibold text-lg">Central de Ajuda</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Perguntas 
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Frequentes</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Encontre respostas rápidas para as dúvidas mais comuns sobre nossa plataforma de prompts de IA
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar nas perguntas frequentes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder:text-gray-400 h-12"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "Todos" ? "default" : "outline"}
              onClick={() => setSelectedCategory("Todos")}
              className={selectedCategory === "Todos" 
                ? "bg-purple-600 hover:bg-purple-700 text-white" 
                : "border-gray-600 text-gray-300 hover:bg-gray-800"
              }
            >
              Todos
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category 
                  ? "bg-purple-600 hover:bg-purple-700 text-white" 
                  : "border-gray-600 text-gray-300 hover:bg-gray-800"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* FAQ Content */}
        <div className="max-w-4xl mx-auto">
          {filteredFaqs.length === 0 ? (
            <Card className="bg-gray-900 border-gray-700 text-center py-12">
              <CardContent>
                <HelpCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Nenhuma pergunta encontrada
                </h3>
                <p className="text-gray-400">
                  Tente ajustar sua busca ou entre em contato conosco
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="space-y-4">
                  {filteredFaqs.map((faq) => (
                    <AccordionItem 
                      key={faq.id} 
                      value={faq.id}
                      className="border border-gray-700 rounded-lg px-6 py-2 bg-gray-800/50"
                    >
                      <AccordionTrigger className="text-left text-white hover:text-purple-400 py-4">
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className="border-gray-600 text-gray-400 mt-1">
                            {faq.category}
                          </Badge>
                          <span className="font-semibold">{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-300 pb-4">
                        <div className="pt-2 border-t border-gray-700">
                          {faq.answer}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ainda precisa de ajuda?
            </h2>
            <p className="text-gray-400">
              Nossa equipe está sempre pronta para ajudar você
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-900 border-gray-700 text-center p-6">
              <CardContent>
                <MessageCircle className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Chat ao Vivo</h3>
                <p className="text-gray-400 mb-4">
                  Fale conosco em tempo real
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Iniciar Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 text-center p-6">
              <CardContent>
                <Mail className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">E-mail</h3>
                <p className="text-gray-400 mb-4">
                  Envie sua dúvida por e-mail
                </p>
                <Button 
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  onClick={() => window.open('mailto:suporte@reprompt.com')}
                >
                  Enviar E-mail
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 text-center p-6">
              <CardContent>
                <Phone className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">WhatsApp</h3>
                <p className="text-gray-400 mb-4">
                  Suporte via WhatsApp
                </p>
                <Button 
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  onClick={() => window.open('https://wa.me/5511999999999')}
                >
                  Abrir WhatsApp
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Adicionar o componente FAQ original */}
        <div className="mt-16">
          <FAQSection />
        </div>
      </div>

      <Footer />
    </div>
  )
}
