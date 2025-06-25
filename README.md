# 🚀 RePrompt - Marketplace de Prompts de IA

Um marketplace moderno para venda de prompts de IA, com sistema de assinaturas e pagamentos integrados.

## ✨ Funcionalidades

- 🎨 **Marketplace de Prompts** - Milhares de prompts premium
- 💳 **Sistema de Assinaturas** - Planos mensal, trimestral e anual
- 🔐 **Autenticação Segura** - Supabase Auth integrado
- 📱 **Design Responsivo** - Mobile-first com UI moderna
- ⚡ **Performance Otimizada** - Next.js 15 + TypeScript
- 🎯 **SEO Otimizado** - Metadados estruturados
- 💰 **Múltiplos Pagamentos** - Cartão, PIX, PayPal

## 🛠️ Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deploy**: Vercel (recomendado)

## 🚀 Configuração Rápida

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/reprompt.git
cd reprompt
```

### 2. Instale as Dependências

```bash
pnpm install
```

### 3. Configure as Variáveis de Ambiente

Crie um arquivo `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://mjgqetdjndsfycegaadr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZ3FldGRqbmRzZnljZWdhYWRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MjYzMzUsImV4cCI6MjA2NjEwMjMzNX0.DKzdmjhgogQWwj0wfQQD5x0Z-M2EWdwwLnVcwhRIo3E

# URL do site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Service Role Key (obrigatório)
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

### 4. Configure o Banco de Dados

```bash
pnpm setup-db
```

### 5. Execute o Projeto

```bash
pnpm dev
```

Acesse: http://localhost:3000

## 📊 Estrutura do Projeto

```
reprompt/
├── app/                    # App Router (Next.js 15)
│   ├── (auth)/            # Rotas de autenticação
│   ├── admin/             # Painel administrativo
│   ├── api/               # API Routes
│   ├── dashboard/         # Dashboard do usuário
│   ├── explorar/          # Página de exploração
│   ├── planos/            # Página de planos
│   └── prompt/            # Páginas de prompts
├── components/            # Componentes React
│   ├── ui/               # Componentes base (Radix UI)
│   ├── layout/           # Componentes de layout
│   └── forms/            # Formulários
├── lib/                  # Utilitários e configurações
├── utils/                # Funções utilitárias
├── hooks/                # Custom hooks
├── types/                # Tipos TypeScript
└── public/               # Arquivos estáticos
```

## 💳 Sistema de Assinaturas

### Planos Disponíveis

- **Mensal**: R$ 49,90/mês
- **Trimestral**: R$ 149,70 (15% desconto)
- **Anual**: R$ 499,90 (30% desconto + 2 meses grátis)

### Benefícios Premium

- ✅ Downloads ilimitados
- ✅ Acesso a todos os prompts premium
- ✅ Suporte prioritário
- ✅ Acesso antecipado a novos prompts
- ✅ Dashboard de analytics
- ✅ Garantia de 7 dias

## 🎨 Design System

### Cores Principais

```css
--primary: #8b5cf6 (Purple)
--secondary: #3b82f6 (Blue)
--accent: #10b981 (Green)
--background: #0f172a (Dark)
--foreground: #f8fafc (Light)
```

### Componentes

- **Cards**: Glassmorphism com bordas suaves
- **Buttons**: Gradientes e hover effects
- **Forms**: Validação em tempo real
- **Modals**: Animações suaves

## 📱 Responsividade

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🔐 Autenticação

### Fluxo de Login

1. Usuário acessa `/login`
2. Preenche credenciais
3. Supabase valida e cria sessão
4. Redireciona para dashboard

### Proteção de Rotas

```typescript
// Middleware verifica autenticação
export function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user && protectedRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return response
}
```

## 💰 Integração de Pagamentos

### Estrutura Atual

- ✅ Checkout modal
- ✅ Múltiplos métodos de pagamento
- ✅ Gestão de assinaturas
- ✅ Cálculo de preços

### Próximos Passos

- [ ] Integração com Stripe/PagSeguro
- [ ] Webhooks para confirmação
- [ ] Gestão de assinaturas recorrentes
- [ ] Sistema de cupons

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Variáveis de Produção

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_producao
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com
```

## 📊 Analytics

### Google Analytics

```typescript
// Adicione no layout.tsx
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
  strategy="afterInteractive"
/>
```

### Supabase Analytics

- Monitoramento automático de queries
- Logs de erro
- Métricas de performance

## 🛠️ Comandos Úteis

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

## 🐛 Troubleshooting

### Erro de Conexão com Supabase

```bash
# Verificar variáveis
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
# Reconfigurar
pnpm setup-db
```

## 📈 Métricas de Sucesso

### KPIs Principais

- **Conversão**: Taxa de assinaturas
- **Retenção**: Churn rate mensal
- **Receita**: MRR (Monthly Recurring Revenue)
- **Engajamento**: Downloads por usuário

### A/B Testing

- Teste diferentes preços
- Experimente CTAs
- Otimize landing pages

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- **Email**: suporte@reprompt.com
- **Discord**: [Comunidade RePrompt](https://discord.gg/reprompt)
- **Documentação**: [docs.reprompt.com](https://docs.reprompt.com)

---

**🎉 Parabéns!** Seu marketplace de prompts está pronto para gerar receita!