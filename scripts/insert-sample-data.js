const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente não configuradas!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function insertSampleData() {
  console.log('🎨 Inserindo dados de exemplo...')

  try {
    // Inserir categorias
    const categories = [
      { name: 'Midjourney', slug: 'midjourney', icon: '🎨', description: 'Prompts para geração de imagens com Midjourney' },
      { name: 'DALL-E', slug: 'dalle', icon: '🖼️', description: 'Prompts para criação de imagens com DALL-E' },
      { name: 'ChatGPT', slug: 'chatgpt', icon: '💬', description: 'Prompts para ChatGPT' },
      { name: 'Claude', slug: 'claude', icon: '🤖', description: 'Prompts para Claude AI' },
      { name: 'Stable Diffusion', slug: 'stable-diffusion', icon: '⚡', description: 'Prompts para Stable Diffusion' },
      { name: 'Leonardo AI', slug: 'leonardo-ai', icon: '🎭', description: 'Prompts para Leonardo AI' },
      { name: 'Gemini', slug: 'gemini', icon: '♊', description: 'Prompts para Google Gemini' },
      { name: 'Vídeos', slug: 'videos', icon: '📹', description: 'Prompts para geração de vídeos' }
    ]

    console.log('📂 Inserindo categorias...')
    for (const category of categories) {
      const { error } = await supabase
        .from('categories')
        .upsert(category, { onConflict: 'slug' })
      
      if (error) {
        console.error(`❌ Erro ao inserir categoria ${category.name}:`, error.message)
      } else {
        console.log(`✅ Categoria ${category.name} inserida/atualizada`)
      }
    }

    // Inserir prompts de exemplo
    const prompts = [
      {
        title: 'Retrato Fotográfico Profissional',
        description: 'Crie retratos fotográficos profissionais com iluminação perfeita',
        content: 'Um retrato fotográfico profissional de alta qualidade, com iluminação de estúdio perfeita, foco nítido nos olhos, fundo desfocado elegante, estilo editorial de revista',
        prompt: 'professional portrait photography, studio lighting, sharp focus on eyes, elegant bokeh background, editorial magazine style, high quality, 8k',
        category: 'Midjourney',
        price: 0,
        is_paid: false,
        is_free: true,
        author: 'RePrompt Team',
        author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        ai_tool: 'Midjourney',
        rating: 4.8,
        review_count: 127,
        downloads: 1543,
        views: 8921,
        difficulty: 'beginner',
        slug: 'retrato-fotografico-profissional',
        tags: ['retrato', 'fotografia', 'profissional', 'iluminação'],
        active: true,
        featured: true,
        verified: true
      },
      {
        title: 'Landscape Fantástico',
        description: 'Paisagens fantásticas com elementos mágicos e atmosfera épica',
        content: 'Uma paisagem fantástica épica com montanhas flutuantes, cascatas de cristal, árvores bioluminescentes, céu com aurora boreal, estilo cinematográfico',
        prompt: 'epic fantasy landscape, floating mountains, crystal waterfalls, bioluminescent trees, aurora borealis sky, cinematic style, magical atmosphere, 8k',
        category: 'Midjourney',
        price: 9.90,
        is_paid: true,
        is_free: false,
        author: 'ArtMaster AI',
        author_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        ai_tool: 'Midjourney',
        rating: 4.9,
        review_count: 89,
        downloads: 756,
        views: 3245,
        difficulty: 'intermediate',
        slug: 'landscape-fantastico',
        tags: ['fantasia', 'paisagem', 'épico', 'mágico'],
        active: true,
        featured: true,
        verified: true
      },
      {
        title: 'Assistente de Marketing Digital',
        description: 'Prompt para criar estratégias de marketing digital completas',
        content: 'Você é um especialista em marketing digital com 10 anos de experiência. Ajude-me a criar uma estratégia completa de marketing digital para [produto/serviço]. Inclua análise de público-alvo, canais de marketing, conteúdo, métricas e cronograma.',
        prompt: 'Você é um especialista em marketing digital com 10 anos de experiência. Ajude-me a criar uma estratégia completa de marketing digital para [produto/serviço]. Inclua análise de público-alvo, canais de marketing, conteúdo, métricas e cronograma.',
        category: 'ChatGPT',
        price: 0,
        is_paid: false,
        is_free: true,
        author: 'Marketing Pro',
        author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
        ai_tool: 'ChatGPT',
        rating: 4.7,
        review_count: 234,
        downloads: 2891,
        views: 15678,
        difficulty: 'beginner',
        slug: 'assistente-marketing-digital',
        tags: ['marketing', 'estratégia', 'digital', 'negócios'],
        active: true,
        featured: true,
        verified: true
      },
      {
        title: 'Análise de Dados Avançada',
        description: 'Prompt para análise profunda de dados e insights',
        content: 'Você é um cientista de dados sênior. Analise os seguintes dados e forneça insights profundos, tendências, correlações e recomendações acionáveis. Inclua visualizações sugeridas e métricas de performance.',
        prompt: 'Você é um cientista de dados sênior. Analise os seguintes dados e forneça insights profundos, tendências, correlações e recomendações acionáveis. Inclua visualizações sugeridas e métricas de performance.',
        category: 'ChatGPT',
        price: 14.90,
        is_paid: true,
        is_free: false,
        author: 'Data Scientist',
        author_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
        ai_tool: 'ChatGPT',
        rating: 4.9,
        review_count: 156,
        downloads: 892,
        views: 4567,
        difficulty: 'advanced',
        slug: 'analise-dados-avancada',
        tags: ['dados', 'análise', 'insights', 'ciência de dados'],
        active: true,
        featured: false,
        verified: true
      },
      {
        title: 'Personagem de RPG Detalhado',
        description: 'Crie personagens de RPG completos com backstory e características',
        content: 'Um personagem de RPG detalhado com aparência única, personalidade complexa, história de fundo rica, habilidades especiais, fraquezas e objetivos claros',
        prompt: 'detailed RPG character, unique appearance, complex personality, rich backstory, special abilities, clear weaknesses and goals, fantasy art style, 8k',
        category: 'DALL-E',
        price: 7.90,
        is_paid: true,
        is_free: false,
        author: 'RPG Master',
        author_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
        ai_tool: 'DALL-E',
        rating: 4.6,
        review_count: 78,
        downloads: 445,
        views: 2134,
        difficulty: 'intermediate',
        slug: 'personagem-rpg-detalhado',
        tags: ['rpg', 'personagem', 'fantasia', 'arte'],
        active: true,
        featured: false,
        verified: true
      }
    ]

    console.log('🎨 Inserindo prompts...')
    for (const prompt of prompts) {
      const { error } = await supabase
        .from('prompts')
        .upsert(prompt, { onConflict: 'slug' })
      
      if (error) {
        console.error(`❌ Erro ao inserir prompt ${prompt.title}:`, error.message)
      } else {
        console.log(`✅ Prompt "${prompt.title}" inserido/atualizado`)
      }
    }

    console.log('🎉 Dados de exemplo inseridos com sucesso!')
    console.log('\n📊 Resumo:')
    console.log('- ✅ Categorias inseridas')
    console.log('- ✅ Prompts de exemplo criados')
    console.log('- ✅ Dados prontos para teste')

  } catch (error) {
    console.error('❌ Erro durante a inserção:', error.message)
  }
}

insertSampleData() 