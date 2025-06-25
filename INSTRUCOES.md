# 📋 Instruções de Execução - RePrompt

## 🚀 Passo a Passo para Executar o Projeto

### 1. Preparação do Ambiente

Certifique-se de ter instalado:
- Node.js 18+ 
- pnpm (recomendado) ou npm

### 2. Instalar Dependências

```bash
cd reprompt
pnpm install
```

### 3. Configurar Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz do projeto com o conteúdo:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://mjgqetdjndsfycegaadr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3FldGRqbmRzZnljZWdhYWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MjYzMzUsImV4cCI6MjA2NjEwMjMzNX0.DKzdmjhgogQWwj0wfQQD5x0Z-M2EWdwwLnVcwhRIo3E

# URL do site para metadados SEO
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Service Role Key (obrigatório para operações administrativas)
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

### 4. Obter Service Role Key

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** > **API**
4. Copie a **service_role** key
5. Substitua `sua_service_role_key_aqui` no `.env.local`

### 5. Configurar Banco de Dados

Execute o script de configuração:

```bash
node scripts/setup-database.js
```

**O que este script faz:**
- ✅ Cria todas as tabelas necessárias
- ✅ Insere planos de assinatura (Mensal, Trimestral, Anual)
- ✅ Cria categorias padrão (Midjourney, ChatGPT, etc.)
- ✅ Configura usuário admin

### 6. Executar o Projeto

```bash
pnpm dev
```

### 7. Acessar o Projeto

Abra seu navegador e acesse:
**http://localhost:3000**

## 🎯 Funcionalidades Disponíveis

### ✅ Páginas Principais
- **Home** (`/`) - Landing page com planos
- **Explorar** (`/explorar`) - Marketplace de prompts
- **Planos** (`/planos`) - Página de assinaturas
- **Login** (`/login`) - Autenticação
- **Dashboard** (`/dashboard`) - Área do usuário

### ✅ Sistema de Assinaturas
- **Plano Mensal**: R$ 49,90/mês
- **Plano Trimestral**: R$ 149,70 (15% desconto)
- **Plano Anual**: R$ 499,90 (30% desconto + 2 meses grátis)

### ✅ Componentes Implementados
- Header responsivo com navegação
- Hero section com CTAs
- Cards de planos de assinatura
- Modal de checkout
- Banner de upgrade
- Benefícios premium

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
pnpm dev

# Build de produção
pnpm build

# Preview de produção
pnpm start

# Linting
pnpm lint

# Type checking
pnpm type-check

# Configurar banco
pnpm setup-db
```

## 🐛 Solução de Problemas

### Erro: "Cannot find module '@supabase/supabase-js'"
```bash
pnpm install @supabase/supabase-js
```

### Erro: "Cannot find module '@supabase/ssr'"
```bash
pnpm install @supabase/ssr
```

### Erro de conexão com Supabase
1. Verifique se as variáveis de ambiente estão corretas
2. Confirme se o projeto Supabase está ativo
3. Verifique se a service role key está correta

### Erro de build
```bash
# Limpar cache
rm -rf .next
pnpm install
pnpm build
```

## 📊 Estrutura do Banco

### Tabelas Criadas
1. **users** - Usuários do sistema
2. **subscription_plans** - Planos de assinatura
3. **user_subscriptions** - Assinaturas dos usuários
4. **payment_methods** - Métodos de pagamento
5. **categories** - Categorias de prompts
6. **prompts** - Prompts do marketplace

### Dados Iniciais
- 3 planos de assinatura
- 8 categorias de prompts
- 1 usuário admin

## 🎨 Design System

### Cores
- **Primary**: Purple (#8b5cf6)
- **Secondary**: Blue (#3b82f6)
- **Background**: Dark (#0f172a)
- **Text**: Light (#f8fafc)

### Componentes
- Glassmorphism cards
- Gradientes suaves
- Animações CSS
- Responsivo mobile-first

## 📱 Responsividade

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🚀 Próximos Passos

### Integração de Pagamentos
1. Configurar Stripe ou PagSeguro
2. Implementar webhooks
3. Gestão de assinaturas recorrentes

### Funcionalidades Avançadas
1. Sistema de cupons
2. Programa de afiliados
3. Analytics avançado
4. Blog integrado

## 📞 Suporte

Se encontrar problemas:
1. Verifique este guia
2. Consulte o arquivo `SETUP.md`
3. Verifique os logs do console
4. Confirme as variáveis de ambiente

---

**🎉 Parabéns!** Seu marketplace está funcionando localmente! 