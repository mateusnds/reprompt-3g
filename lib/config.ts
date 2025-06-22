const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  },
  site: {
    name: 'RePrompt',
    description: 'Marketplace #1 de Prompts para IA',
    url: 'https://reprompt.com.br'
  }
}

export function getConfig() {
  return config
}

export default config