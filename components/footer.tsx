import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react"
import Link from "next/link"

const categories = [
  { name: "Midjourney", slug: "midjourney" },
  { name: "ChatGPT", slug: "chatgpt" },
  { name: "DALL-E", slug: "dalle" },
  { name: "Claude", slug: "claude" },
  { name: "Stable Diffusion", slug: "stable-diffusion" },
  { name: "Leonardo AI", slug: "leonardo-ai" },
  { name: "Gemini", slug: "gemini" },
  { name: "Grok", slug: "grok" },
  { name: "FLUX", slug: "flux" },
  { name: "Sora", slug: "sora" },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="text-2xl font-bold mb-4 block">
              Reprompt
            </Link>
            <p className="text-gray-400 mb-6">
              O maior marketplace de prompts de IA do Brasil. Transforme suas ideias em realidade.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Linkedin className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Marketplace</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/buscar" className="hover:text-white">
                  Explorar Prompts
                </Link>
              </li>
              <li>
                <Link href="/buscar?priceFilter=free" className="hover:text-white">
                  Prompts Gratuitos
                </Link>
              </li>
              <li>
                <Link href="/buscar?priceFilter=paid" className="hover:text-white">
                  Prompts Premium
                </Link>
              </li>
              <li>
                <Link href="/buscar?sortBy=rating" className="hover:text-white">
                  Mais Bem Avaliados
                </Link>
              </li>
              <li>
                <Link href="/buscar?sortBy=downloads" className="hover:text-white">
                  Mais Baixados
                </Link>
              </li>
              <li>
                <Link href="/buscar?sortBy=newest" className="hover:text-white">
                  Novos Prompts
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Categorias</h3>
            <ul className="space-y-2 text-gray-400">
              {categories.slice(0, 6).map((category) => (
                <li key={category.slug}>
                  <Link href={`/prompts/${category.slug}`} className="hover:text-white">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Receba os melhores prompts e dicas direto no seu e-mail.</p>
            <div className="flex space-x-2 mb-4">
              <Input placeholder="Seu e-mail" className="bg-gray-800 border-gray-700 text-white" />
              <Button>
                <Mail className="w-4 h-4" />
              </Button>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-2 text-sm">Para Vendedores</h4>
              <ul className="space-y-1 text-gray-400 text-sm">
                <li>
                  <Link href="/vender" className="hover:text-white">
                    Começar a Vender
                  </Link>
                </li>
                <li>
                  <Link href="/guias" className="hover:text-white">
                    Guias de Venda
                  </Link>
                </li>
                <li>
                  <Link href="/comissoes" className="hover:text-white">
                    Comissões
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">© 2024 Reprompt. Todos os direitos reservados.</div>
            <div className="flex space-x-6 text-gray-400">
              <Link href="/termos" className="hover:text-white">
                Termos de Uso
              </Link>
              <Link href="/privacidade" className="hover:text-white">
                Privacidade
              </Link>
              <Link href="/contato" className="hover:text-white">
                Contato
              </Link>
              <Link href="/ajuda" className="hover:text-white">
                Ajuda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
