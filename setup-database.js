
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
    
    console.log('Arquivo .env.local carregado com sucesso!')
  } else {
    console.error('Arquivo .env.local não encontrado!')
    process.exit(1)
  }
}

// Carregar variáveis de ambiente
loadEnvFile()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('URL do Supabase:', supabaseUrl ? 'Carregada' : 'NÃO ENCONTRADA')
console.log('Chave do Supabase:', supabaseKey ? 'Carregada' : 'NÃO ENCONTRADA')

if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: Variáveis de ambiente do Supabase não encontradas')
  console.error('Verifique se o arquivo .env.local existe e contém:')
  console.error('NEXT_PUBLIC_SUPABASE_URL=sua_url')
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  try {
    console.log('Configurando banco de dados...')
    
    // Ler o script SQL
    const sqlScript = fs.readFileSync('database-setup.sql', 'utf8')
    
    // Executar o script (Note: você precisará executar este SQL diretamente no Supabase Dashboard)
    console.log('Por favor, execute o seguinte SQL no Supabase Dashboard:')
    console.log('=====================================')
    console.log(sqlScript)
    console.log('=====================================')
    
    // Testar conexão
    const { data, error } = await supabase.from('categories').select('count')
    
    if (error) {
      console.error('Erro ao conectar:', error)
    } else {
      console.log('Conexão estabelecida com sucesso!')
      console.log('Categorias encontradas:', data?.length || 0)
    }
    
  } catch (error) {
    console.error('Erro na configuração:', error)
  }
}

setupDatabase()
