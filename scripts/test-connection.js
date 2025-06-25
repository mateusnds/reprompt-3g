const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente não configuradas!')
  console.error('Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY estão definidas no .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('🔍 Testando conexão com Supabase...')
  console.log('URL:', supabaseUrl)
  console.log('Anon Key:', supabaseAnonKey.substring(0, 20) + '...')

  try {
    // Teste básico de conexão
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .limit(1)

    if (error) {
      console.error('❌ Erro na conexão:', error.message)
      
      if (error.message.includes('relation "subscription_plans" does not exist')) {
        console.log('💡 A tabela não existe. Execute o script de configuração primeiro.')
        console.log('Comando: node scripts/setup-database.js')
      }
    } else {
      console.log('✅ Conexão bem-sucedida!')
      console.log('📊 Dados encontrados:', data.length, 'registros')
    }

    // Teste de categorias
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .limit(5)

    if (catError) {
      console.error('❌ Erro ao buscar categorias:', catError.message)
    } else {
      console.log('📂 Categorias encontradas:', categories.length)
      categories.forEach(cat => {
        console.log(`  - ${cat.name} (${cat.slug})`)
      })
    }

    // Teste de prompts
    const { data: prompts, error: promptError } = await supabase
      .from('prompts')
      .select('*')
      .limit(5)

    if (promptError) {
      console.error('❌ Erro ao buscar prompts:', promptError.message)
    } else {
      console.log('🎨 Prompts encontrados:', prompts.length)
      prompts.forEach(prompt => {
        console.log(`  - ${prompt.title} (${prompt.category})`)
      })
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

testConnection() 