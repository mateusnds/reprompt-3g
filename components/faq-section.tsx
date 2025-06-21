
"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
  category: "geral" | "pagamento" | "prompts" | "conta"
}

export function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const faqData: FAQItem[] = [
    {
      question: "O que são prompts de IA e como eles funcionam?",
      answer: "Prompts são instruções ou comandos específicos dados a ferramentas de IA como ChatGPT, Midjourney ou DALL-E para gerar conteúdo desejado. Um prompt bem elaborado pode ser a diferença entre um resultado medíocre e um resultado profissional. Nossa plataforma oferece prompts testados e otimizados por especialistas.",
      category: "geral"
    },
    {
      question: "Como posso ter certeza de que os prompts realmente funcionam?",
      answer: "Todos os prompts em nossa plataforma passam por um rigoroso processo de teste. Cada prompt é verificado por nossa equipe de especialistas em IA e testado com diferentes cenários. Além disso, você pode ver as avaliações de outros usuários e exemplos de resultados antes de comprar.",
      category: "prompts"
    },
    {
      question: "Posso usar os prompts comercialmente?",
      answer: "Sim! A maioria dos prompts em nossa plataforma inclui licença comercial. Você pode usar os resultados gerados pelos prompts em projetos comerciais, vendas, marketing e outras atividades profissionais. Verifique sempre a licença específica de cada prompt.",
      category: "prompts"
    },
    {
      question: "Como funciona o sistema de pagamento?",
      answer: "Aceitamos cartões de crédito, débito, PIX e PayPal. Todos os pagamentos são processados com segurança SSL 256-bit. Você recebe o prompt imediatamente após a confirmação do pagamento. Oferecemos garantia de 7 dias para todos os prompts premium.",
      category: "pagamento"
    },
    {
      question: "Posso vender meus próprios prompts na plataforma?",
      answer: "Absolutamente! Qualquer criador pode se cadastrar e começar a vender prompts. Você define o preço, categoria e descrição. Cobramos uma taxa de 20% sobre as vendas, mas você mantém 80% de tudo que ganhar. Temos ferramentas completas para gerenciar suas vendas.",
      category: "conta"
    },
    {
      question: "Que tipos de IA são suportados?",
      answer: "Oferecemos prompts para todas as principais ferramentas de IA: ChatGPT, GPT-4, Claude, Midjourney, DALL-E, Stable Diffusion, Leonardo AI, Gemini, Grok e muitas outras. Categorizamos os prompts por ferramenta para facilitar sua busca.",
      category: "prompts"
    },
    {
      question: "E se eu não ficar satisfeito com um prompt?",
      answer: "Oferecemos garantia de 7 dias em todos os prompts premium. Se não funcionar como esperado, você pode solicitar reembolso total. Para prompts gratuitos, você pode reportar problemas e nossa equipe investigará rapidamente.",
      category: "pagamento"
    },
    {
      question: "Como escolher o prompt certo para minha necessidade?",
      answer: "Use nosso sistema de filtros avançados por categoria, ferramenta de IA, preço e avaliação. Leia as descrições detalhadas, veja os exemplos de resultados e consulte as avaliações de outros usuários. Nossa equipe de suporte também pode ajudar com recomendações personalizadas.",
      category: "geral"
    }
  ]

  const categories = [
    { key: "geral", label: "Perguntas Gerais", count: faqData.filter(item => item.category === "geral").length },
    { key: "prompts", label: "Sobre Prompts", count: faqData.filter(item => item.category === "prompts").length },
    { key: "pagamento", label: "Pagamentos", count: faqData.filter(item => item.category === "pagamento").length },
    { key: "conta", label: "Conta e Vendas", count: faqData.filter(item => item.category === "conta").length }
  ]

  return (
    <section className="py-16 bg-gray-900" aria-labelledby="faq-heading">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="w-6 h-6 text-blue-400" aria-hidden="true" />
            <span className="text-blue-400 font-semibold">Central de Ajuda</span>
          </div>
          <h2 id="faq-heading" className="text-4xl font-bold text-white mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Encontre respostas para as principais dúvidas sobre prompts de IA, pagamentos e como usar nossa plataforma.
          </p>
        </div>

        {/* Categories Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {categories.map((category) => (
            <Card key={category.key} className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white">{category.count}</div>
                <div className="text-sm text-gray-400">{category.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqData.map((item, index) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-0">
                <Button
                  variant="ghost"
                  className="w-full p-6 text-left justify-between hover:bg-gray-700/50 rounded-none"
                  onClick={() => toggleItem(index)}
                >
                  <span className="text-white font-medium text-lg pr-4">{item.question}</span>
                  {openItems.includes(index) ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </Button>
                
                {openItems.includes(index) && (
                  <div className="px-6 pb-6">
                    <div className="pt-4 border-t border-gray-700">
                      <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <div className="text-center mt-12">
          <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/20 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Não encontrou sua resposta?
              </h3>
              <p className="text-gray-300 mb-6">
                Nossa equipe de suporte especializada está disponível 24/7 para ajudar com qualquer dúvida específica.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Falar com Suporte
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:text-white">
                  Ver Documentação
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
