
"use client"

import { Prompt } from '@/lib/prompts-storage'

interface StructuredDataProps {
  type: 'homepage' | 'product' | 'category'
  data?: Prompt
  category?: string
}

export default function StructuredData({ type, data, category }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseUrl = 'https://reprompt.com'
    
    switch (type) {
      case 'homepage':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "RePrompt",
          "description": "Marketplace #1 de Prompts para IA no Brasil",
          "url": baseUrl,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${baseUrl}/buscar?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          },
          "sameAs": [
            "https://twitter.com/reprompt_br",
            "https://instagram.com/reprompt_br"
          ]
        }
      
      case 'product':
        if (!data) return null
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": data.title,
          "description": data.description,
          "image": data.thumbnail,
          "url": `${baseUrl}/prompt/${data.category}/${data.slug}`,
          "brand": {
            "@type": "Brand",
            "name": "RePrompt"
          },
          "offers": {
            "@type": "Offer",
            "price": data.price,
            "priceCurrency": "BRL",
            "availability": "https://schema.org/InStock",
            "seller": {
              "@type": "Organization",
              "name": "RePrompt"
            }
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": data.rating,
            "ratingCount": data.downloads
          },
          "category": data.category
        }
      
      case 'category':
        return {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": `Prompts de ${category}`,
          "description": `Descubra os melhores prompts de ${category} para IA`,
          "url": `${baseUrl}/prompts/${category}`,
          "isPartOf": {
            "@type": "WebSite",
            "name": "RePrompt",
            "url": baseUrl
          }
        }
      
      default:
        return null
    }
  }

  const structuredData = getStructuredData()
  
  if (!structuredData) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  )
}
