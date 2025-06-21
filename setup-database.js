
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: Variáveis de ambiente do Supabase não encontradas')
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
