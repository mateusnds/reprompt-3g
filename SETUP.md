# 🚀 Guia de Configuração - RePrompt

## 📋 Pré-requisitos

- Node.js 18+ 
- pnpm (recomendado) ou npm
- Conta no Supabase
- Editor de código (VS Code recomendado)

## 🔧 Configuração Inicial

### 1. Instalar Dependências

```bash
cd reprompt
pnpm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://mjgqetdjndsfycegaadr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3FldGRqbmRzZnljZWdhYWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MjYzMzUsImV4cCI6MjA2NjEwMjMzNX0.DKzdmjhgogQWwj0wfQQD5x0Z-M2EWdwwLnVcwhRIo3E

# URL do site para metadados SEO
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Service Role Key (obrigatório para operações administrativas)
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
```

### 3. Obter Service Role Key

1. Acesse o [Dashboard do Supabase](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **Settings** > **API**
4. Copie a **service_role** key
5. Cole no arquivo `.env.local`

### 4. Configurar Banco de Dados

Execute o script de configuração:

```bash
node scripts/setup-database.js
```

Este script irá:
- ✅ Criar todas as tabelas necessárias
- ✅ Inserir planos de assinatura
- ✅ Criar categorias padrão
- ✅ Configurar usuário admin

### 5. Executar o Projeto

```bash
pnpm dev
```

O projeto estará disponível em: http://localhost:3000

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

1. **users** - Usuários do sistema
2. **subscription_plans** - Planos de assinatura
3. **user_subscriptions** - Assinaturas dos usuários
4. **payment_methods** - Métodos de pagamento
5. **categories** - Categorias de prompts
6. **prompts** - Prompts do marketplace

### Planos de Assinatura

- **Mensal**: R$ 49,90/mês
- **Trimestral**: R$ 149,70 (15% desconto)
- **Anual**: R$ 499,90 (30% desconto + 2 meses grátis)

## 🎨 Funcionalidades Implementadas

### ✅ Sistema de Assinaturas
- [x] Planos mensal, trimestral e anual
- [x] Verificação de assinatura ativa
- [x] Controle de downloads baseado no plano
- [x] Cálculo de preços e descontos

### ✅ UI/UX Moderna
- [x] Design responsivo (mobile + desktop)
- [x] Gradientes e glassmorphism
- [x] Animações suaves
- [x] CTAs otimizados

### ✅ SEO e Performance
- [x] Metadados estruturados
- [x] URLs semânticas
- [x] Lazy loading
- [x] Otimização de imagens

## 🔐 Autenticação

O projeto usa Supabase Auth com fallback para autenticação local:

- **Login/Registro** via Supabase
- **Sessões persistentes**
- **Proteção de rotas**
- **Controle de permissões**

## 💳 Sistema de Pagamentos

### Implementação Atual
- ✅ Estrutura de checkout
- ✅ Múltiplos métodos de pagamento
- ✅ Gestão de assinaturas

### Próximos Passos
- [ ] Integração com gateway de pagamento
- [ ] Webhooks para confirmação
- [ ] Gestão de assinaturas recorrentes

## 📱 Responsividade

O projeto é totalmente responsivo:

- **Mobile**: 1 coluna, botões empilhados
- **Tablet**: 2 colunas
- **Desktop**: 3+ colunas

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Outras Plataformas

- **Netlify**: Suporte completo
- **Railway**: Configuração similar
- **DigitalOcean**: App Platform

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
```

## 📊 Analytics e Monitoramento

### Google Analytics
Adicione seu ID do GA4 no `.env.local`:

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Supabase Analytics
- Monitoramento automático de queries
- Logs de erro
- Métricas de performance

## 🛠️ Troubleshooting

### Erro de Conexão com Supabase
```bash
# Verificar variáveis de ambiente
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Erro de Build
```bash
# Limpar cache
rm -rf .next
pnpm install
pnpm build
```

### Problemas de Banco
```bash
# Reconfigurar banco
node scripts/setup-database.js
```

## 📞 Suporte

- **Documentação**: Este arquivo
- **Issues**: GitHub Issues
- **Comunidade**: Discord/Slack

## 🎯 Próximos Passos

1. **Integração de Pagamentos**
   - Stripe/PagSeguro
   - Webhooks
   - Gestão de assinaturas

2. **Funcionalidades Avançadas**
   - Sistema de cupons
   - Programa de afiliados
   - Gamificação

3. **Marketing e SEO**
   - Blog integrado
   - Tutoriais
   - Casos de sucesso

---

**🎉 Parabéns!** Seu marketplace de prompts está pronto para uso! 