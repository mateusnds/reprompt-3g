
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Carregar variáveis de ambiente
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local')
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    const envLines = envContent.split('\n')
    
    envLines.forEach(line => {
      const trimmedLine = line.trim()
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=')
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim()
          process.env[key.trim()] = value
        }
      }
    })
  }
}

loadEnvFile()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Variáveis de ambiente não encontradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const samplePrompts = [
  // Midjourney - Gratuito
  {
    title: "Paisagem Futurística",
    description: "Prompt gratuito para criar paisagens futurísticas com cidades cyberpunk",
    content: "futuristic cyberpunk cityscape, neon lights, flying cars, towering skyscrapers, rain, detailed, 8k resolution --ar 16:9",
    category: "midjourney",
    price: 0,
    is_paid: false,
    is_free: true,
    is_admin_created: true,
    featured: true,
    verified: true,
    active: true,
    author_id: "00000000-0000-0000-0000-000000000001",
    author: "Admin RePrompt",
    author_avatar: "/placeholder-user.jpg",
    thumbnail: "/placeholder.jpg",
    images: ["/placeholder.jpg"],
    tags: ["futurismo", "cyberpunk", "cidade", "neon", "gratuito"],
    ai_tool: "midjourney",
    rating: 4.7,
    downloads: 2340,
    views: 5670,
    slug: "paisagem-futuristica",
    difficulty: "beginner"
  },
  // Midjourney - Pago
  {
    title: "Retrato Profissional Premium",
    description: "Prompt premium para retratos profissionais com iluminação perfeita",
    content: "professional portrait photography, studio lighting, detailed face, sharp focus, 85mm lens, bokeh background, high fashion, magazine quality --ar 3:4 --s 750",
    category: "midjourney",
    price: 29.90,
    is_paid: true,
    is_free: false,
    is_admin_created: true,
    featured: true,
    verified: true,
    active: true,
    author_id: "00000000-0000-0000-0000-000000000001",
    author: "Admin RePrompt",
    author_avatar: "/placeholder-user.jpg",
    thumbnail: "/placeholder.jpg",
    images: ["/placeholder.jpg"],
    tags: ["retrato", "profissional", "estúdio", "premium"],
    ai_tool: "midjourney",
    rating: 4.9,
    downloads: 890,
    views: 2340,
    slug: "retrato-profissional-premium",
    difficulty: "advanced"
  },
  // DALL-E - Gratuito
  {
    title: "Ícones Minimalistas",
    description: "Prompt gratuito para criar ícones simples e limpos",
    content: "minimalist icon design, simple geometric shapes, flat design, clean lines, modern style, vector art",
    category: "dalle",
    price: 0,
    is_paid: false,
    is_free: true,
    is_admin_created: true,
    featured: false,
    verified: true,
    active: true,
    author_id: "00000000-0000-0000-0000-000000000001",
    author: "Admin RePrompt",
    author_avatar: "/placeholder-user.jpg",
    thumbnail: "/placeholder.jpg",
    images: ["/placeholder.jpg"],
    tags: ["ícone", "minimalista", "design", "vetor", "gratuito"],
    ai_tool: "dalle",
    rating: 4.5,
    downloads: 1560,
    views: 3210,
    slug: "icones-minimalistas",
    difficulty: "beginner"
  },
  // DALL-E - Pago
  {
    title: "Arte Conceitual Fantasia",
    description: "Prompt premium para criar arte conceitual de fantasia épica",
    content: "epic fantasy concept art, dragon flying over medieval castle, dramatic lighting, detailed environment, matte painting style, cinematic composition",
    category: "dalle",
    price: 24.90,
    is_paid: true,
    is_free: false,
    is_admin_created: true,
    featured: true,
    verified: true,
    active: true,
    author_id: "00000000-0000-0000-0000-000000000001",
    author: "Admin RePrompt",
    author_avatar: "/placeholder-user.jpg",
    thumbnail: "/placeholder.jpg",
    images: ["/placeholder.jpg"],
    tags: ["fantasia", "dragão", "castelo", "épico", "premium"],
    ai_tool: "dalle",
    rating: 4.8,
    downloads: 670,
    views: 1890,
    slug: "arte-conceitual-fantasia",
    difficulty: "intermediate"
  },
  // Stable Diffusion - Gratuito
  {
    title: "Anime Character Basic",
    description: "Prompt gratuito para personagens anime simples",
    content: "anime character, colorful hair, big eyes, simple background, kawaii style, clean art",
    category: "stable-diffusion",
    price: 0,
    is_paid: false,
    is_free: true,
    is_admin_created: true,
    featured: false,
    verified: true,
    active: true,
    author_id: "00000000-0000-0000-0000-000000000001",
    author: "Admin RePrompt",
    author_avatar: "/placeholder-user.jpg",
    thumbnail: "/placeholder.jpg",
    images: ["/placeholder.jpg"],
    tags: ["anime", "personagem", "kawaii", "simples", "gratuito"],
    ai_tool: "stable-diffusion",
    rating: 4.4,
    downloads: 2890,
    views: 6540,
    slug: "anime-character-basic",
    difficulty: "beginner"
  },
  // Stable Diffusion - Pago
  {
    title: "Hiper-realismo Profissional",
    description: "Prompt premium para imagens hiper-realistas com qualidade fotográfica",
    content: "hyperrealistic photography, ultra detailed, 8k resolution, perfect lighting, photorealistic skin texture, sharp focus, professional camera settings",
    category: "stable-diffusion",
    price: 34.90,
    is_paid: true,
    is_free: false,
    is_admin_created: true,
    featured: true,
    verified: true,
    active: true,
    author_id: "00000000-0000-0000-0000-000000000001",
    author: "Admin RePrompt",
    author_avatar: "/placeholder-user.jpg",
    thumbnail: "/placeholder.jpg",
    images: ["/placeholder.jpg"],
    tags: ["hiper-realismo", "fotografia", "qualidade", "premium"],
    ai_tool: "stable-diffusion",
    rating: 4.9,
    downloads: 450,
    views: 1230,
    slug: "hiper-realismo-profissional",
    difficulty: "expert"
  },
  // ChatGPT - Gratuito
  {
    title: "Assistente de Estudo",
    description: "Prompt gratuito para criar um assistente de estudos personalizado",
    content: "Você é um assistente de estudos especializado. Ajude o usuário a [TÓPICO] explicando conceitos de forma clara e criando exercícios práticos. Use exemplos do dia a dia e seja paciente.",
    category: "chatgpt",
    price: 0,
    is_paid: false,
    is_free: true,
    is_admin_created: true,
    featured: false,
    verified: true,
    active: true,
    author_id: "00000000-0000-0000-0000-000000000001",
    author: "Admin RePrompt",
    author_avatar: "/placeholder-user.jpg",
    thumbnail: "/placeholder.jpg",
    images: ["/placeholder.jpg"],
    tags: ["estudo", "educação", "assistente", "aprendizado", "gratuito"],
    ai_tool: "chatgpt",
    rating: 4.6,
    downloads: 3450,
    views: 7890,
    slug: "assistente-de-estudo",
    difficulty: "beginner"
  },
  // ChatGPT - Pago
  {
    title: "Estrategista de Marketing Digital",
    description: "Prompt premium para criar estratégias de marketing completas",
    content: "Você é um estrategista de marketing digital sênior. Crie uma estratégia completa para [EMPRESA/PRODUTO] incluindo: análise de mercado, personas, funil de vendas, campanhas para cada etapa, métricas KPI e cronograma detalhado. Use dados reais quando possível.",
    category: "chatgpt",
    price: 39.90,
    is_paid: true,
    is_free: false,
    is_admin_created: true,
    featured: true,
    verified: true,
    active: true,
    author_id: "00000000-0000-0000-0000-000000000001",
    author: "Admin RePrompt",
    author_avatar: "/placeholder-user.jpg",
    thumbnail: "/placeholder.jpg",
    images: ["/placeholder.jpg"],
    tags: ["marketing", "estratégia", "digital", "vendas", "premium"],
    ai_tool: "chatgpt",
    rating: 4.8,
    downloads: 720,
    views: 1980,
    slug: "estrategista-marketing-digital",
    difficulty: "expert"
  },
  // Claude - Gratuito
  {
    title: "Corretor de Textos",
    description: "Prompt gratuito para correção de textos em português",
    content: "Corrija o texto a seguir mantendo o sentido original, mas melhorando gramática, pontuação e clareza. Explique as principais mudanças feitas:",
    category: "claude",
    price: 0,
    is_paid: false,
    is_free: true,
    is_admin_created: true,
    featured: false,
    verified: true,
    active: true,
    author_id: "00000000-0000-0000-0000-000000000001",
    author: "Admin RePrompt",
    author_avatar: "/placeholder-user.jpg",
    thumbnail: "/placeholder.jpg",
    images: ["/placeholder.jpg"],
    tags: ["correção", "texto", "gramática", "português", "gratuito"],
    ai_tool: "claude",
    rating: 4.5,
    downloads: 2100,
    views: 4560,
    slug: "corretor-de-textos",
    difficulty: "beginner"
  },
  // Claude - Pago
  {
    title: "Analista de Código Avançado",
    description: "Prompt premium para análise detalhada de código e otimizações",
    content: "Analise o código fornecido e forneça: 1) Revisão de segurança detalhada, 2) Sugestões de otimização de performance, 3) Melhorias de legibilidade, 4) Identificação de code smells, 5) Refatoração sugerida com explicações técnicas.",
    category: "claude",
    price: 44.90,
    is_paid: true,
    is_free: false,
    is_admin_created: true,
    featured: true,
    verified: true,
    active: true,
    author_id: "00000000-0000-0000-0000-000000000001",
    author: "Admin RePrompt",
    author_avatar: "/placeholder-user.jpg",
    thumbnail: "/placeholder.jpg",
    images: ["/placeholder.jpg"],
    tags: ["código", "análise", "otimização", "segurança", "premium"],
    ai_tool: "claude",
    rating: 4.9,
    downloads: 380,
    views: 890,
    slug: "analista-codigo-avancado",
    difficulty: "expert"
  },
  // Leonardo AI - Gratuito
  {
    title: "Ilustração Cartoon",
    description: "Prompt gratuito para criar ilustrações cartoon simples",
    content: "cartoon illustration, cute character, bright colors, simple shapes, friendly expression, clean background",
    category: "leonardo-ai",
    price: 0,
    is_paid: false,
    is_free: true,
    is_admin_created: true,
    featured: false,
    verified: true,
    active: true,
    author_id: "00000000-0000-0000-0000-000000000001",
    author: "Admin RePrompt",
    author_avatar: "/placeholder-user.jpg",
    thumbnail: "/placeholder.jpg",
    images: ["/placeholder.jpg"],
    tags: ["cartoon", "ilustração", "personagem", "colorido", "gratuito"],
    ai_tool: "leonardo-ai",
    rating: 4.3,
    downloads: 1890,
    views: 3450,
    slug: "ilustracao-cartoon",
    difficulty: "beginner"
  },
  // Leonardo AI - Pago
  {
    title: "Arte Digital Profissional",
    description: "Prompt premium para arte digital de alta qualidade",
    content: "professional digital art, masterpiece quality, detailed rendering, perfect composition, artistic lighting, gallery worthy, high resolution artwork",
    category: "leonardo-ai",
    price: 27.90,
    is_paid: true,
    is_free: false,
    is_admin_created: true,
    featured: true,
    verified: true,
    active: true,
    author_id: "00000000-0000-0000-0000-000000000001",
    author: "Admin RePrompt",
    author_avatar: "/placeholder-user.jpg",
    thumbnail: "/placeholder.jpg",
    images: ["/placeholder.jpg"],
    tags: ["arte digital", "profissional", "alta qualidade", "premium"],
    ai_tool: "leonardo-ai",
    rating: 4.7,
    downloads: 560,
    views: 1340,
    slug: "arte-digital-profissional",
    difficulty: "advanced"
  },
  // Gemini - Gratuito
  {
    title: "Pesquisador Acadêmico",
    description: "Prompt gratuito para pesquisas acadêmicas simples",
    content: "Faça uma pesquisa sobre [TÓPICO] e forneça um resumo acadêmico com principais conceitos, autores relevantes e fontes confiáveis.",
    category: "gemini",
    price: 0,
    is_paid: false,
    is_free: true,
    is_admin_created: true,
    featured: false,
    verified: true,
    active: true,
    author_id: "00000000-0000-0000-0000-000000000001",
    author: "Admin RePrompt",
    author_avatar: "/placeholder-user.jpg",
    thumbnail: "/placeholder.jpg",
    images: ["/placeholder.jpg"],
    tags: ["pesquisa", "acadêmico", "educação", "fontes", "gratuito"],
    ai_tool: "gemini",
    rating: 4.4,
    downloads: 1670,
    views: 2890,
    slug: "pesquisador-academico",
    difficulty: "beginner"
  },
  // Gemini - Pago
  {
    title: "Analista de Dados Avançado",
    description: "Prompt premium para análise de dados complexa",
    content: "Analise os dados fornecidos e crie: 1) Estatísticas descritivas detalhadas, 2) Identificação de padrões e tendências, 3) Visualizações recomendadas, 4) Insights estratégicos, 5) Recomendações baseadas em dados.",
    category: "gemini",
    price: 49.90,
    is_paid: true,
    is_free: false,
    is_admin_created: true,
    featured: true,
    verified: true,
    active: true,
    author_id: "00000000-0000-0000-0000-000000000001",
    author: "Admin RePrompt",
    author_avatar: "/placeholder-user.jpg",
    thumbnail: "/placeholder.jpg",
    images: ["/placeholder.jpg"],
    tags: ["dados", "análise", "estatística", "insights", "premium"],
    ai_tool: "gemini",
    rating: 4.8,
    downloads: 290,
    views: 670,
    slug: "analista-dados-avancado",
    difficulty: "expert"
  },
  // Grok - Gratuito
  {
    title: "Assistente Criativo",
    description: "Prompt gratuito para brainstorming criativo",
    content: "Seja um assistente criativo e ajude com ideias inovadoras para [PROJETO]. Pense fora da caixa e sugira abordagens únicas.",
    category: "grok",
    price: 0,
    is_paid: false,
    is_free: true,
    is_admin_created: true,
    featured: false,
    verified: true,
    active: true,
    author_id: "00000000-0000-0000-0000-000000000001",
    author: "Admin RePrompt",
    author_avatar: "/placeholder-user.jpg",
    thumbnail: "/placeholder.jpg",
    images: ["/placeholder.jpg"],
    tags: ["criatividade", "brainstorming", "ideias", "inovação", "gratuito"],
    ai_tool: "grok",
    rating: 4.2,
    downloads: 1230,
    views: 2560,
    slug: "assistente-criativo",
    difficulty: "beginner"
  },
  // Grok - Pago
  {
    title: "Consultor de Inovação",
    description: "Prompt premium para consultoria em inovação empresarial",
    content: "Como consultor de inovação sênior, analise [EMPRESA/SETOR] e desenvolva: 1) Mapeamento de oportunidades, 2) Estratégias de disrupção, 3) Roadmap de inovação, 4) Análise de concorrentes, 5) Plano de implementação.",
    category: "grok",
    price: 54.90,
    is_paid: true,
    is_free: false,
    is_admin_created: true,
    featured: true,
    verified: true,
    active: true,
    author_id: "00000000-0000-0000-0000-000000000001",
    author: "Admin RePrompt",
    author_avatar: "/placeholder-user.jpg",
    thumbnail: "/placeholder.jpg",
    images: ["/placeholder.jpg"],
    tags: ["inovação", "consultoria", "estratégia", "disrupção", "premium"],
    ai_tool: "grok",
    rating: 4.9,
    downloads: 180,
    views: 450,
    slug: "consultor-inovacao",
    difficulty: "expert"
  },
  // FLUX - Gratuito
  {
    title: "Arte Abstrata Simples",
    description: "Prompt gratuito para criar arte abstrata básica",
    content: "abstract art, geometric shapes, flowing colors, modern composition, digital art style",
    category: "flux",
    price: 0,
    is_paid: false,
    is_free: true,
    is_admin_created: true,
    featured: false,
    verified: true,
    active: true,
    author_id: "00000000-0000-0000-0000-000000000001",
    author: "Admin RePrompt",
    author_avatar: "/placeholder-user.jpg",
    thumbnail: "/placeholder.jpg",
    images: ["/placeholder.jpg"],
    tags: ["abstrato", "arte", "geométrico", "moderno", "gratuito"],
    ai_tool: "flux",
    rating: 4.1,
    downloads: 980,
    views: 1890,
    slug: "arte-abstrata-simples",
    difficulty: "beginner"
  },
  // FLUX - Pago
  {
    title: "Composição Artística Complexa",
    description: "Prompt premium para composições artísticas sofisticadas",
    content: "complex artistic composition, masterful technique, intricate details, perfect balance, museum quality artwork, innovative style",
    category: "flux",
    price: 32.90,
    is_paid: true,
    is_free: false,
    is_admin_created: true,
    featured: true,
    verified: true,
    active: true,
    author_id: "00000000-0000-0000-0000-000000000001",
    author: "Admin RePrompt",
    author_avatar: "/placeholder-user.jpg",
    thumbnail: "/placeholder.jpg",
    images: ["/placeholder.jpg"],
    tags: ["composição", "artística", "complexo", "sofisticado", "premium"],
    ai_tool: "flux",
    rating: 4.6,
    downloads: 340,
    views: 780,
    slug: "composicao-artistica-complexa",
    difficulty: "advanced"
  },
  // Sora - Gratuito
  {
    title: "Vídeo Simples Natureza",
    description: "Prompt gratuito para vídeos simples de natureza",
    content: "calm nature scene, gentle wind through trees, peaceful lake, soft lighting, relaxing atmosphere",
    category: "sora",
    price: 0,
    is_paid: false,
    is_free: true,
    is_admin_created: true,
    featured: false,
    verified: true,
    active: true,
    author_id: "00000000-0000-0000-0000-000000000001",
    author: "Admin RePrompt",
    author_avatar: "/placeholder-user.jpg",
    thumbnail: "/placeholder.jpg",
    images: ["/placeholder.jpg"],
    tags: ["natureza", "vídeo", "calmo", "paisagem", "gratuito"],
    ai_tool: "sora",
    rating: 4.3,
    downloads: 1450,
    views: 3200,
    slug: "video-simples-natureza",
    difficulty: "beginner"
  },
  // Sora - Pago
  {
    title: "Produção Cinematográfica",
    description: "Prompt premium para vídeos com qualidade cinematográfica",
    content: "cinematic video production, professional camera movements, dramatic lighting, complex scenes, movie quality footage, storytelling elements",
    category: "sora",
    price: 79.90,
    is_paid: true,
    is_free: false,
    is_admin_created: true,
    featured: true,
    verified: true,
    active: true,
    author_id: "00000000-0000-0000-0000-000000000001",
    author: "Admin RePrompt",
    author_avatar: "/placeholder-user.jpg",
    thumbnail: "/placeholder.jpg",
    images: ["/placeholder.jpg"],
    tags: ["cinematográfico", "produção", "qualidade", "filme", "premium"],
    ai_tool: "sora",
    rating: 4.9,
    downloads: 120,
    views: 340,
    slug: "producao-cinematografica",
    difficulty: "expert"
  },
  // Vídeos - Gratuito
  {
    title: "Tutorial Básico",
    description: "Prompt gratuito para criar roteiros de tutoriais",
    content: "Crie um roteiro de tutorial sobre [TÓPICO] com introdução, 3 passos principais e conclusão. Use linguagem simples e exemplos práticos.",
    category: "videos",
    price: 0,
    is_paid: false,
    is_free: true,
    is_admin_created: true,
    featured: false,
    verified: true,
    active: true,
    author_id: "00000000-0000-0000-0000-000000000001",
    author: "Admin RePrompt",
    author_avatar: "/placeholder-user.jpg",
    thumbnail: "/placeholder.jpg",
    images: ["/placeholder.jpg"],
    tags: ["tutorial", "roteiro", "educação", "simples", "gratuito"],
    ai_tool: "videos",
    rating: 4.4,
    downloads: 2340,
    views: 5670,
    slug: "tutorial-basico",
    difficulty: "beginner"
  },
  // Vídeos - Pago
  {
    title: "Roteiro Publicitário Profissional",
    description: "Prompt premium para roteiros publicitários de alta conversão",
    content: "Desenvolva um roteiro publicitário profissional para [PRODUTO/SERVIÇO] incluindo: hook impactante, apresentação do problema, solução, benefícios, social proof, call-to-action poderoso e timing preciso.",
    category: "videos",
    price: 69.90,
    is_paid: true,
    is_free: false,
    is_admin_created: true,
    featured: true,
    verified: true,
    active: true,
    author_id: "00000000-0000-0000-0000-000000000001",
    author: "Admin RePrompt",
    author_avatar: "/placeholder-user.jpg",
    thumbnail: "/placeholder.jpg",
    images: ["/placeholder.jpg"],
    tags: ["publicitário", "roteiro", "conversão", "vendas", "premium"],
    ai_tool: "videos",
    rating: 4.8,
    downloads: 230,
    views: 560,
    slug: "roteiro-publicitario-profissional",
    difficulty: "expert"
  }
]

async function populateDatabase() {
  try {
    console.log('Inserindo prompts de exemplo...')
    
    for (const prompt of samplePrompts) {
      const { data, error } = await supabase
        .from('prompts')
        .insert([prompt])
        .select()
      
      if (error) {
        console.error(`Erro ao inserir "${prompt.title}":`, error)
      } else {
        console.log(`✅ Inserido: ${prompt.title} (${prompt.category} - ${prompt.is_free ? 'Gratuito' : `R$ ${prompt.price}`})`)
      }
    }
    
    console.log('\n🎉 Finalizado! Todos os prompts foram inseridos.')
    
  } catch (error) {
    console.error('Erro geral:', error)
  }
}

populateDatabase()
