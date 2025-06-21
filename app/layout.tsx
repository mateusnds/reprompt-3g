
import type { Metadata } from 'next'
import './globals.css'

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#6B46C1" />
        <link rel="canonical" href="https://reprompt.com.br" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="format-detection" content="telephone=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Reprompt",
              "url": "https://reprompt.com.br",
              "description": "Marketplace líder de prompts de IA no Brasil",
              "publisher": {
                "@type": "Organization",
                "name": "Reprompt",
                "url": "https://reprompt.com.br"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://reprompt.com.br/buscar?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className="bg-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
