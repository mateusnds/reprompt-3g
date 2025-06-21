import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Função helper para formatar datas de forma segura
export function formatDate(date: Date | string): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date

    // Verificar se a data é válida
    if (isNaN(dateObj.getTime())) {
      return "Data inválida"
    }

    return dateObj.toLocaleDateString("pt-BR")
  } catch (error) {
    return "Data inválida"
  }
}

// Função helper para formatar data e hora
export function formatDateTime(date: Date | string): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date

    if (isNaN(dateObj.getTime())) {
      return "Data inválida"
    }

    return dateObj.toLocaleString("pt-BR")
  } catch (error) {
    return "Data inválida"
  }
}
