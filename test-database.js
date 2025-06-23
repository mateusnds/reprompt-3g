
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Carregar variáveis de ambiente do .env.local
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

async function testDatabase() {
  try {
    console.log('Testando conexão com o banco de dados...\n')
    
    // Testar categorias
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
    
    if (catError) {
      console.error('Erro ao buscar categorias:', catError)
    } else {
      console.log(`✅ Categorias encontradas: ${categories?.length || 0}`)
      categories?.forEach(cat => console.log(`   - ${cat.name} (${cat.slug})`))
    }
    
    // Testar prompts
    const { data: prompts, error: promptError } = await supabase
      .from('prompts')
      .select('*')
    
    if (promptError) {
      console.error('Erro ao buscar prompts:', promptError)
    } else {
      console.log(`\n✅ Prompts encontrados: ${prompts?.length || 0}`)
      prompts?.forEach(prompt => console.log(`   - ${prompt.title} (${prompt.category})`))
    }
    
    // Testar FAQs
    const { data: faqs, error: faqError } = await supabase
      .from('faqs')
      .select('*')
    
    if (faqError) {
      console.error('Erro ao buscar FAQs:', faqError)
    } else {
      console.log(`\n✅ FAQs encontradas: ${faqs?.length || 0}`)
      faqs?.forEach(faq => console.log(`   - ${faq.question}`))
    }
    
    // Testar usuários
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('*')
    
    if (userError) {
      console.error('Erro ao buscar usuários:', userError)
    } else {
      console.log(`\n✅ Usuários encontrados: ${users?.length || 0}`)
      users?.forEach(user => console.log(`   - ${user.name} (${user.email})`))
    }
    
  } catch (error) {
    console.error('Erro geral:', error)
  }
}

testDatabase()
