
import { NextResponse } from 'next/server'
import { getAllPrompts } from '@/lib/prompts-storage'
import { getCategories } from '@/lib/database'

export async function GET() {
  try {
    const [prompts, categories] = await Promise.all([
      getAllPrompts(),
      getCategories()
    ])

    const baseUrl = 'https://reprompt.com'
    
    const staticPages = [
      '',
      '/explorar',
      '/buscar',
      '/faq',
      '/blog',
      '/login',
      '/cadastrar-prompt'
    ]

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

    // Adicionar páginas estáticas
    staticPages.forEach(page => {
      sitemap += `  <url>
    <loc>${baseUrl}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>
`
    })

    // Adicionar categorias
    categories.forEach(category => {
      sitemap += `  <url>
    <loc>${baseUrl}/prompts/${category.slug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
`
    })

    // Adicionar prompts individuais
    prompts.forEach(prompt => {
      sitemap += `  <url>
    <loc>${baseUrl}/prompt/${prompt.category}/${prompt.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`
    })

    sitemap += `</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  } catch (error) {
    console.error('Erro ao gerar sitemap:', error)
    return new NextResponse('Erro interno do servidor', { status: 500 })
  }
}
