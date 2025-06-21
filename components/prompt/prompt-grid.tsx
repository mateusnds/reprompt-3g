
"use client"

import { PromptCard } from "./prompt-card"
import { Prompt } from "@/lib/types"

interface PromptGridProps {
  prompts: Prompt[]
  onFavorite?: (id: string) => void
  className?: string
}

export function PromptGrid({ prompts, onFavorite, className = "" }: PromptGridProps) {
  if (prompts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Nenhum prompt encontrado</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          id={prompt.id}
          title={prompt.title}
          description={prompt.description}
          price={prompt.price}
          category={prompt.category}
          author={prompt.author}
          preview={prompt.preview}
          rating={prompt.rating}
          downloads={prompt.downloads}
          views={prompt.views}
          tags={prompt.tags}
          onFavorite={onFavorite}
        />
      ))}
    </div>
  )
}
