"use client"

import { useRef, useEffect } from "react"

interface VideoPreviewProps {
  videoUrl: string
  thumbnailUrl: string
  title: string
  className?: string
}

export function VideoPreview({ videoUrl, thumbnailUrl, title, className = "" }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      // Configurar para autoplay quando o vídeo entra na viewport
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              video.play().catch(() => {
                // Se autoplay falhar, mostrar poster
                console.log("Autoplay bloqueado pelo navegador")
              })
            } else {
              video.pause()
            }
          })
        },
        { threshold: 0.5 },
      )

      observer.observe(video)

      return () => {
        observer.disconnect()
      }
    }
  }, [])

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        src={videoUrl}
        poster={thumbnailUrl}
        muted
        loop
        playsInline
        className="w-full h-full object-cover rounded-lg"
        style={{ aspectRatio: "16/9" }}
        onError={() => {
          // Fallback para imagem se vídeo falhar
          console.log("Erro ao carregar vídeo, usando thumbnail")
        }}
      >
        <img src={thumbnailUrl || "/placeholder.svg"} alt={title} className="w-full h-full object-cover rounded-lg" />
      </video>

      {/* Indicador de vídeo */}
      <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
        VÍDEO
      </div>
    </div>
  )
}
