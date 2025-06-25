const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas!')
  console.error('Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão definidas no .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log('🚀 Iniciando configuração do banco de dados...')

  try {
    // 1. Criar tabelas
    console.log('📋 Criando tabelas...')
    
    // Tabela de usuários
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          is_admin BOOLEAN DEFAULT false,
          avatar TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
      `
    })

    // Tabela de planos de assinatura
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS subscription_plans (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(100) NOT NULL,
          slug VARCHAR(100) UNIQUE NOT NULL,
          description TEXT,
          price DECIMAL(10,2) NOT NULL,
          original_price DECIMAL(10,2),
          duration VARCHAR(20) NOT NULL CHECK (duration IN ('monthly', 'quarterly', 'annual')),
          duration_months INTEGER NOT NULL,
          features TEXT[] DEFAULT '{}',
          is_popular BOOLEAN DEFAULT false,
          is_active BOOLEAN DEFAULT true,
          max_prompts_per_month INTEGER,
          discount_percentage INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
      `
    })

    // Tabela de assinaturas
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS user_subscriptions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          plan_id UUID REFERENCES subscription_plans(id),
          status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
          start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
          end_date TIMESTAMP WITH TIME ZONE NOT NULL,
          auto_renew BOOLEAN DEFAULT true,
          payment_method VARCHAR(50),
          last_payment_date TIMESTAMP WITH TIME ZONE,
          next_payment_date TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
      `
    })

    // Tabela de métodos de pagamento
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS payment_methods (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          type VARCHAR(20) NOT NULL CHECK (type IN ('credit_card', 'pix', 'paypal')),
          last4 VARCHAR(4),
          brand VARCHAR(50),
          is_default BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
      `
    })

    // Tabela de categorias
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS categories (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(100) NOT NULL,
          slug VARCHAR(100) UNIQUE NOT NULL,
          icon VARCHAR(50),
          description TEXT,
          count INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
      `
    })

    // Tabela de prompts
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS prompts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title VARCHAR(255) NOT NULL,
          description TEXT,
          content TEXT NOT NULL,
          prompt TEXT,
          category VARCHAR(100) NOT NULL,
          price DECIMAL(10,2) DEFAULT 0,
          is_paid BOOLEAN DEFAULT false,
          is_free BOOLEAN DEFAULT true,
          is_admin_created BOOLEAN DEFAULT false,
          featured BOOLEAN DEFAULT false,
          verified BOOLEAN DEFAULT false,
          active BOOLEAN DEFAULT true,
          author_id UUID REFERENCES users(id),
          author VARCHAR(255) NOT NULL,
          author_avatar TEXT,
          thumbnail TEXT,
          images TEXT[] DEFAULT '{}',
          preview_images TEXT[] DEFAULT '{}',
          video_url TEXT,
          video_preview TEXT,
          tags TEXT[] DEFAULT '{}',
          ai_tool VARCHAR(100),
          rating DECIMAL(3,2) DEFAULT 0,
          review_count INTEGER DEFAULT 0,
          downloads INTEGER DEFAULT 0,
          views INTEGER DEFAULT 0,
          difficulty VARCHAR(20) DEFAULT 'beginner',
          license VARCHAR(20) DEFAULT 'personal',
          slug VARCHAR(255) UNIQUE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
      `
    })

    console.log('✅ Tabelas criadas com sucesso!')

    // 2. Inserir dados iniciais
    console.log('📝 Inserindo dados iniciais...')

    // Inserir planos de assinatura
    const plans = [
      {
        name: 'Plano Mensal',
        slug: 'mensal',
        description: 'Acesso completo a todos os prompts premium por 1 mês',
        price: 49.90,
        original_price: 49.90,
        duration: 'monthly',
        duration_months: 1,
        features: [
          'Acesso a todos os prompts premium',
          'Downloads ilimitados',
          'Suporte por email',
          'Acesso antecipado a novos prompts',
          'Dashboard básico de analytics'
        ],
        is_popular: false,
        is_active: true
      },
      {
        name: 'Plano Trimestral',
        slug: 'trimestral',
        description: 'Acesso completo a todos os prompts premium por 3 meses com desconto',
        price: 149.70,
        original_price: 149.70,
        duration: 'quarterly',
        duration_months: 3,
        features: [
          'Acesso a todos os prompts premium',
          'Downloads ilimitados',
          'Suporte prioritário',
          'Acesso antecipado a novos prompts',
          'Dashboard de analytics',
          '15% de desconto no valor total'
        ],
        is_popular: true,
        is_active: true,
        discount_percentage: 15
      },
      {
        name: 'Plano Anual',
        slug: 'anual',
        description: 'Acesso completo a todos os prompts premium por 12 meses com máximo desconto',
        price: 499.90,
        original_price: 598.80,
        duration: 'annual',
        duration_months: 12,
        features: [
          'Acesso a todos os prompts premium',
          'Downloads ilimitados',
          'Suporte prioritário 24/7',
          'Acesso antecipado a novos prompts',
          'Dashboard de analytics avançado',
          '30% de desconto no valor total',
          '2 meses grátis',
          'Acesso exclusivo a prompts beta'
        ],
        is_popular: false,
        is_active: true,
        discount_percentage: 30
      }
    ]

    for (const plan of plans) {
      const { error } = await supabase
        .from('subscription_plans')
        .upsert(plan, { onConflict: 'slug' })
      
      if (error) {
        console.error(`❌ Erro ao inserir plano ${plan.name}:`, error)
      } else {
        console.log(`✅ Plano ${plan.name} inserido/atualizado`)
      }
    }

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

    for (const category of categories) {
      const { error } = await supabase
        .from('categories')
        .upsert(category, { onConflict: 'slug' })
      
      if (error) {
        console.error(`❌ Erro ao inserir categoria ${category.name}:`, error)
      } else {
        console.log(`✅ Categoria ${category.name} inserida/atualizada`)
      }
    }

    // Inserir usuário admin
    const adminUser = {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Admin RePrompt',
      email: 'admin@reprompt.com',
      password: 'hashed_password_here',
      is_admin: true
    }

    const { error: adminError } = await supabase
      .from('users')
      .upsert(adminUser, { onConflict: 'id' })

    if (adminError) {
      console.error('❌ Erro ao inserir usuário admin:', adminError)
    } else {
      console.log('✅ Usuário admin inserido/atualizado')
    }

    console.log('🎉 Configuração do banco de dados concluída com sucesso!')
    console.log('\n📊 Resumo:')
    console.log('- ✅ Tabelas criadas')
    console.log('- ✅ Planos de assinatura inseridos')
    console.log('- ✅ Categorias inseridas')
    console.log('- ✅ Usuário admin criado')

  } catch (error) {
    console.error('❌ Erro durante a configuração:', error)
    process.exit(1)
  }
}

setupDatabase() 