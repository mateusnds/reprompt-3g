
import type { Metadata } from 'next'
import './globals.css'
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { initializeDatabase } from "@/lib/database"

export const metadata: Metadata = {
  title: 'Reprompt - Marketplace #1 de Prompts de IA no Brasil | +25.000 Prompts Premium',
  description: 'Descubra, compre e venda os melhores prompts para ChatGPT, Midjourney, DALL-E e mais. Marketplace brasileiro líder em prompts de IA com +50.000 criadores ativos. Transforme suas ideias em realidade.',
  keywords: 'prompts IA, ChatGPT, Midjourney, DALL-E, Claude, marketplace prompts, inteligência artificial, prompts brasileiros, vender prompts',
  authors: [{ name: 'Reprompt Team' }],
  creator: 'Reprompt',
  publisher: 'Reprompt',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://reprompt.com.br',
    siteName: 'Reprompt',
    title: 'Reprompt - Marketplace #1 de Prompts de IA',
    description: 'O maior marketplace de prompts de IA do Brasil. Mais de 25.000 prompts premium para ChatGPT, Midjourney, DALL-E e outras IAs.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Reprompt - Marketplace de Prompts de IA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reprompt - Marketplace #1 de Prompts de IA',
    description: 'Descubra +25.000 prompts premium para IA. Marketplace brasileiro líder.',
    images: ['/twitter-image.jpg'],
    creator: '@reprompt_br',
  },
  alternates: {
    canonical: 'https://reprompt.com.br',
    languages: {
      'pt-BR': 'https://reprompt.com.br',
      'en-US': 'https://reprompt.com.br/en',
    },
  },
  verification: {
    google: 'seu-codigo-google-verification',
  },
}

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Initialize database on app start
  if (typeof window !== "undefined") {
    initializeDatabase()
  }

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-black">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
