import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MarketPlace de Prompts - IA para Criatividade",
  description: "Descubra e compre os melhores prompts para IA. Midjourney, DALL-E, ChatGPT e muito mais.",
  keywords: "prompts, IA, inteligência artificial, Midjourney, DALL-E, ChatGPT, criatividade",
  authors: [{ name: "MarketPlace Prompts" }],
  creator: "MarketPlace Prompts",
  publisher: "MarketPlace Prompts",
  openGraph: {
    title: "MarketPlace de Prompts - IA para Criatividade",
    description: "Descubra e compre os melhores prompts para IA",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "MarketPlace de Prompts - IA para Criatividade",
    description: "Descubra e compre os melhores prompts para IA",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
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