
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL('https://reprompt.com'),
  title: {
    default: "RePrompt - Marketplace #1 de Prompts para IA | Midjourney, DALL-E, ChatGPT",
    template: "%s | RePrompt"
  },
  description: "Descubra, compre e venda os melhores prompts para IA no maior marketplace do Brasil. Mais de 50.000 criadores confiam na nossa plataforma. Prompts para Midjourney, DALL-E, Stable Diffusion e ChatGPT.",
  keywords: [
    "prompts IA",
    "marketplace prompts", 
    "midjourney prompts",
    "dalle prompts",
    "chatgpt prompts",
    "stable diffusion prompts",
    "inteligência artificial",
    "geração de imagens",
    "prompts premium",
    "prompts profissionais",
    "leonardo ai prompts",
    "prompts brasileiros",
    "criação de arte com IA",
    "prompts para designers",
    "marketplace brasileiro"
  ],
  authors: [{ name: "RePrompt Team", url: "https://reprompt.com" }],
  creator: "RePrompt",
  publisher: "RePrompt",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://reprompt.com",
    siteName: "RePrompt",
    title: "RePrompt - Marketplace #1 de Prompts para IA",
    description: "Descubra, compre e venda os melhores prompts para IA no maior marketplace do Brasil. Mais de 50.000 criadores confiam na nossa plataforma.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "RePrompt - Marketplace de Prompts para IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RePrompt - Marketplace #1 de Prompts para IA",
    description: "Descubra, compre e venda os melhores prompts para IA no maior marketplace do Brasil.",
    images: ["/images/og-image.jpg"],
    creator: "@reprompt_br",
  },
  verification: {
    google: "google-site-verification-code",
  },
  alternates: {
    canonical: "https://reprompt.com",
    languages: {
      'pt-BR': 'https://reprompt.com',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://reprompt.com" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background">
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
