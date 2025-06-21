
"use client"

export interface DatabaseUser {
  id: string
  name: string
  email: string
  password: string
  isAdmin: boolean
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface DatabasePrompt {
  id: string
  title: string
  description: string
  content: string
  category: string
  price: number
  isPaid: boolean
  isFree: boolean
  isAdminCreated: boolean
  featured: boolean
  authorId: string
  author: string
  authorAvatar: string
  thumbnail: string
  images: string[]
  videoPreview?: string
  tags: string[]
  rating: number
  downloads: number
  views: number
  createdAt: Date
  updatedAt: Date
}

export interface DatabaseCategory {
  id: string
  name: string
  slug: string
  icon: string
  description: string
  count: number
  createdAt: Date
}

export interface DatabaseTag {
  id: string
  name: string
  slug: string
  category: string
  isActive: boolean
  createdAt: Date
}

export interface DatabaseReview {
  id: string
  promptId: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  comment: string
  isVerifiedPurchase: boolean
  helpfulVotes: number
  reported: boolean
  createdAt: Date
}

export interface DatabasePurchase {
  id: string
  userId: string
  promptId: string
  price: number
  status: "completed" | "pending" | "cancelled"
  createdAt: Date
}

export interface DatabaseBlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  authorId: string
  author: string
  authorAvatar: string
  thumbnail: string
  category: string
  tags: string[]
  published: boolean
  featured: boolean
  views: number
  createdAt: Date
  updatedAt: Date
}

export interface DatabaseFAQ {
  id: string
  question: string
  answer: string
  category: string
  order: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Storage keys
const STORAGE_KEYS = {
  USERS: "db_users",
  PROMPTS: "db_prompts", 
  CATEGORIES: "db_categories",
  TAGS: "db_tags",
  REVIEWS: "db_reviews",
  PURCHASES: "db_purchases",
  BLOG_POSTS: "db_blog_posts",
  FAQS: "db_faqs"
}

// Mock data
const mockUsers: DatabaseUser[] = [
  {
    id: "admin-1",
    name: "Admin RePrompt",
    email: "admin@reprompt.com",
    password: "admin123",
    isAdmin: true,
    avatar: "/placeholder-user.jpg",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "user-1",
    name: "Maria Silva",
    email: "maria@email.com",
    password: "123456",
    isAdmin: false,
    avatar: "/placeholder-user.jpg",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02")
  },
  {
    id: "user-2",
    name: "Carlos Otaku",
    email: "carlos@email.com",
    password: "123456",
    isAdmin: false,
    avatar: "/placeholder-user.jpg",
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03")
  }
]

const mockCategories: DatabaseCategory[] = [
  {
    id: "cat-1",
    name: "Midjourney",
    slug: "midjourney",
    icon: "🎨",
    description: "Prompts para geração de imagens com Midjourney",
    count: 1250,
    createdAt: new Date("2024-01-01")
  },
  {
    id: "cat-2", 
    name: "DALL-E",
    slug: "dalle",
    icon: "🖼️",
    description: "Prompts para criação de imagens com DALL-E",
    count: 890,
    createdAt: new Date("2024-01-01")
  },
  {
    id: "cat-3",
    name: "Stable Diffusion",
    slug: "stable-diffusion", 
    icon: "⚡",
    description: "Prompts para Stable Diffusion e derivados",
    count: 670,
    createdAt: new Date("2024-01-01")
  },
  {
    id: "cat-4",
    name: "ChatGPT",
    slug: "chatgpt",
    icon: "💬",
    description: "Prompts para conversas e assistência com ChatGPT",
    count: 520,
    createdAt: new Date("2024-01-01")
  }
]

const mockBlogPosts: DatabaseBlogPost[] = [
  {
    id: "post-1",
    title: "Como Criar Prompts Eficazes para IA Generativa",
    slug: "como-criar-prompts-eficazes-ia-generativa",
    excerpt: "Descubra as melhores técnicas para criar prompts que geram resultados impressionantes em IAs como Midjourney, DALL-E e ChatGPT.",
    content: `
# Como Criar Prompts Eficazes para IA Generativa

A criação de prompts eficazes é uma arte que combina criatividade, precisão técnica e compreensão profunda de como as IAs interpretam linguagem natural.

## Princípios Fundamentais

### 1. Seja Específico e Detalhado
Quanto mais específico for seu prompt, melhores serão os resultados. Em vez de "desenhe um gato", use "gato persa de pelo longo, olhos azuis, sentado em uma janela ensolarada, estilo aquarela".

### 2. Use Descritores de Qualidade
Adicione termos como "ultra detalhado", "4K", "fotorrealístico", "estilo cinematográfico" para elevar a qualidade dos resultados.

### 3. Defina o Estilo Artístico
Especifique o estilo desejado: "estilo Van Gogh", "arte digital", "fotografia profissional", "ilustração minimalista".

## Técnicas Avançadas

### Estrutura de Prompt Ideal
1. **Assunto principal** - O que você quer criar
2. **Detalhes descritivos** - Características específicas
3. **Ambiente/Cenário** - Onde está localizado
4. **Estilo artístico** - Como deve parecer
5. **Parâmetros técnicos** - Qualidade e formato

### Exemplo Prático
\`\`\`
professional portrait of elegant woman, 
natural lighting, soft shadows, 
studio photography, 85mm lens,
shallow depth of field,
ultra detailed, 4K resolution
--ar 2:3 --v 6
\`\`\`

## Dicas para Cada Plataforma

### Midjourney
- Use parâmetros como --ar para proporção
- --v 6 para versão mais recente
- --style raw para menos estilização

### DALL-E
- Seja mais descritivo em linguagem natural
- Funciona bem com conceitos abstratos
- Excelente para ilustrações e arte conceitual

### Stable Diffusion
- Use negative prompts para remover elementos indesejados
- Funciona bem com modificadores de peso
- Ótimo para experimentação com diferentes modelos

## Conclusão

A criação de prompts eficazes requer prática e experimentação. Comece com prompts simples e vá adicionando complexidade gradualmente até alcançar os resultados desejados.
`,
    authorId: "admin-1",
    author: "Admin RePrompt",
    authorAvatar: "/placeholder-user.jpg",
    thumbnail: "/placeholder.svg",
    category: "Tutorial",
    tags: ["prompts", "ia", "tutorial", "midjourney", "dalle"],
    published: true,
    featured: true,
    views: 5420,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: "post-2", 
    title: "Tendências em IA Generativa para 2024",
    slug: "tendencias-ia-generativa-2024",
    excerpt: "Explore as principais tendências e inovações que estão moldando o futuro da inteligência artificial generativa em 2024.",
    content: `
# Tendências em IA Generativa para 2024

O ano de 2024 promete ser revolucionário para a IA generativa, com avanços significativos em qualidade, acessibilidade e aplicações práticas.

## Principais Tendências

### 1. Modelos Multimodais
A integração entre texto, imagem, vídeo e áudio em um único modelo está se tornando realidade.

### 2. IA Personalizada
Modelos que se adaptam ao estilo e preferências individuais de cada usuário.

### 3. Geração de Vídeo em Tempo Real
Ferramentas que permitem criar vídeos de alta qualidade instantaneamente.

### 4. IA para Negócios
Soluções empresariais específicas para diferentes setores e indústrias.

## Impacto no Mercado

O mercado de prompts está evoluindo rapidamente, com novas oportunidades surgindo para criadores de conteúdo e empresas.

## Conclusão

2024 será um ano definitivo para estabelecer a IA generativa como ferramenta essencial em diversas áreas profissionais.
`,
    authorId: "user-1",
    author: "Maria Silva", 
    authorAvatar: "/placeholder-user.jpg",
    thumbnail: "/placeholder.svg",
    category: "Tendências",
    tags: ["ia", "2024", "tendencias", "futuro", "tecnologia"],
    published: true,
    featured: false,
    views: 2340,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10")
  }
]

const mockFAQs: DatabaseFAQ[] = [
  {
    id: "faq-1",
    question: "Como funciona o marketplace de prompts?",
    answer: "Nosso marketplace conecta criadores de prompts com usuários que buscam conteúdo de qualidade para IA. Criadores podem vender seus prompts, enquanto compradores têm acesso a uma vasta biblioteca de prompts testados e otimizados.",
    category: "Geral",
    order: 1,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "faq-2",
    question: "Posso vender meus próprios prompts?",
    answer: "Sim! Qualquer usuário registrado pode se tornar um vendedor. Basta criar uma conta, submeter seus prompts para aprovação e começar a vendê-los. Mantemos padrões altos de qualidade para garantir a melhor experiência para todos.",
    category: "Vendas",
    order: 2, 
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "faq-3",
    question: "Qual a comissão cobrada nas vendas?",
    answer: "Cobramos uma comissão de 20% sobre cada venda realizada. Esta taxa nos permite manter a plataforma funcionando, processar pagamentos com segurança e oferecer suporte contínuo aos usuários.",
    category: "Vendas",
    order: 3,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "faq-4",
    question: "Como garantir a qualidade dos prompts?",
    answer: "Todos os prompts passam por um processo de revisão antes de serem publicados. Nossa equipe testa cada prompt e verifica se produz os resultados prometidos. Além disso, temos um sistema de avaliações e comentários dos usuários.",
    category: "Qualidade",
    order: 4,
    isActive: true,
    createdAt: new Date("2024-01-01"), 
    updatedAt: new Date("2024-01-01")
  },
  {
    id: "faq-5",
    question: "Posso solicitar reembolso?",
    answer: "Oferecemos garantia de satisfação de 7 dias. Se um prompt não atender às suas expectativas ou não funcionar conforme descrito, você pode solicitar reembolso total dentro deste período.",
    category: "Pagamentos",
    order: 5,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  }
]

// Generic database functions
function getFromStorage<T>(key: string, defaultData: T[]): T[] {
  if (typeof window === "undefined") return defaultData
  
  try {
    const stored = localStorage.getItem(key)
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(item.createdAt)
      }))
    }
    
    saveToStorage(key, defaultData)
    return defaultData
  } catch (error) {
    console.error(`Erro ao carregar ${key}:`, error)
    return defaultData
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error(`Erro ao salvar ${key}:`, error)
    }
  }
}

// Users
export const getUsers = (): DatabaseUser[] => getFromStorage(STORAGE_KEYS.USERS, mockUsers)
export const saveUsers = (users: DatabaseUser[]): void => saveToStorage(STORAGE_KEYS.USERS, users)
export const getUserById = (id: string): DatabaseUser | undefined => getUsers().find(u => u.id === id)
export const getUserByEmail = (email: string): DatabaseUser | undefined => getUsers().find(u => u.email === email)

// Categories  
export const getCategories = (): DatabaseCategory[] => getFromStorage(STORAGE_KEYS.CATEGORIES, mockCategories)
export const saveCategories = (categories: DatabaseCategory[]): void => saveToStorage(STORAGE_KEYS.CATEGORIES, categories)

// Blog Posts
export const getBlogPosts = (): DatabaseBlogPost[] => getFromStorage(STORAGE_KEYS.BLOG_POSTS, mockBlogPosts)
export const saveBlogPosts = (posts: DatabaseBlogPost[]): void => saveToStorage(STORAGE_KEYS.BLOG_POSTS, posts)
export const getBlogPostBySlug = (slug: string): DatabaseBlogPost | undefined => getBlogPosts().find(p => p.slug === slug)
export const getFeaturedBlogPosts = (): DatabaseBlogPost[] => getBlogPosts().filter(p => p.published && p.featured)

// FAQs
export const getFAQs = (): DatabaseFAQ[] => getFromStorage(STORAGE_KEYS.FAQS, mockFAQs)
export const saveFAQs = (faqs: DatabaseFAQ[]): void => saveToStorage(STORAGE_KEYS.FAQS, faqs)
export const getFAQsByCategory = (category: string): DatabaseFAQ[] => 
  getFAQs().filter(f => f.isActive && f.category === category).sort((a, b) => a.order - b.order)

// Initialize database
export const initializeDatabase = (): void => {
  getUsers()
  getCategories()
  getBlogPosts() 
  getFAQs()
}
