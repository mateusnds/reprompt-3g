import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Reprompt - Marketplace de Prompts de IA',
  description: 'O maior marketplace de prompts de IA do Brasil. Transforme suas ideias em realidade.',
  generator: 'Reprompt',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-900">{children}</body>
    </html>
  )
}
