
const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },
  app: {
    name: 'RePrompt',
    description: 'Marketplace de prompts para IA',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  }
}

export default config
