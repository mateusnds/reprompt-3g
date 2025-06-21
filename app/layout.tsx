import { Inter } from 'next/font/google'
import './globals.css'
import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://reprompt.com'),
  title: {
    default: 'RePrompt - Marketplace #1 de Prompts para IA',
    template: '%s | RePrompt'
  },
  description: 'Descubra, compre e venda os melhores prompts para IA no maior marketplace do Brasil. Mais de 50.000 criadores confiam na nossa plataforma.',
  keywords: [
    'prompts IA',
    'marketplace prompts',
    'midjourney prompts',
    'dalle prompts',
    'chatgpt prompts',
    'stable diffusion prompts',
    'inteligência artificial',
    'geração de imagens',
    'prompts premium',
    'prompts profissionais'
  ],
  authors: [{ name: 'RePrompt Team' }],
  creator: 'RePrompt',
  publisher: 'RePrompt',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://reprompt.com',
    siteName: 'RePrompt',
    title: 'RePrompt - Marketplace #1 de Prompts para IA',
    description: 'Descubra, compre e venda os melhores prompts para IA no maior marketplace do Brasil.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'RePrompt - Marketplace de Prompts para IA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RePrompt - Marketplace #1 de Prompts para IA',
    description: 'Descubra, compre e venda os melhores prompts para IA no Brasil.',
    images: ['/images/twitter-image.jpg'],
    creator: '@reprompt',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://reprompt.com',
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#8b5cf6" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Preconnect para performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Analytics e outras tags podem ser adicionadas aqui */}
      </head>
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white`}>
        {children}
      </body>
    </html>
  )
}