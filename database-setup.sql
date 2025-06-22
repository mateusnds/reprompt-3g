-- Limpar tabelas existentes se necessário
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS purchases CASCADE;
DROP TABLE IF EXISTS prompts CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;

-- Tabela de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de categorias
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(50),
  description TEXT,
  count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de prompts
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  prompt TEXT, -- alias para content
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

-- Tabela de reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user_name VARCHAR(255) NOT NULL,
  user_avatar TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  helpful_votes INTEGER DEFAULT 0,
  reported BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de compras (para verificação de reviews)
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de posts do blog
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id),
  author VARCHAR(255) NOT NULL,
  author_avatar TEXT,
  thumbnail TEXT,
  category VARCHAR(100),
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de FAQs
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  order_num INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inserir dados iniciais
INSERT INTO categories (name, slug, icon, description) VALUES
('Midjourney', 'midjourney', '🎨', 'Prompts para geração de imagens com Midjourney'),
('DALL-E', 'dalle', '🖼️', 'Prompts para criação de imagens com DALL-E'),
('Stable Diffusion', 'stable-diffusion', '⚡', 'Prompts para Stable Diffusion'),
('ChatGPT', 'chatgpt', '💬', 'Prompts para ChatGPT'),
('Claude', 'claude', '🤖', 'Prompts para Claude AI'),
('Leonardo AI', 'leonardo-ai', '🎭', 'Prompts para Leonardo AI'),
('Gemini', 'gemini', '♊', 'Prompts para Google Gemini'),
('Grok', 'grok', '🚀', 'Prompts para Grok'),
('FLUX', 'flux', '⚡', 'Prompts para FLUX'),
('Sora', 'sora', '🎬', 'Prompts para Sora'),
('Vídeos', 'videos', '📹', 'Prompts para geração de vídeos');

-- Inserir usuário admin
INSERT INTO users (id, name, email, password, is_admin) VALUES
('00000000-0000-0000-0000-000000000001', 'Admin RePrompt', 'admin@reprompt.com', 'hashed_password', true);

-- Inserir prompts de exemplo
INSERT INTO prompts (
  id, title, description, content, category, price, is_paid, is_free, 
  is_admin_created, featured, verified, active, author_id, author, slug, images, tags, rating, downloads, views
) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'Retrato Profissional de Mulher',
  'Prompt avançado para criar retratos profissionais femininos com iluminação cinematográfica',
  'professional portrait of a woman, cinematic lighting, high quality, detailed',
  'midjourney',
  15.99,
  true,
  false,
  true,
  true,
  false,
  true,
  '00000000-0000-0000-0000-000000000001',
  'Admin RePrompt',
  'retrato-profissional-de-mulher',
  ARRAY['/images/woman-portrait-preview.jpg'],
  ARRAY['retrato', 'profissional', 'mulher', 'fotografia'],
  4.8,
  89,
  1250
),
(
  '22222222-2222-2222-2222-222222222222',
  'Jaguar Místico',
  'Crie imagens impressionantes de jaguares com elementos místicos e mágicos',
  'mystical jaguar, magical elements, fantasy art style',
  'dalle',
  22.50,
  true,
  false,
  true,
  true,
  false,
  true,
  '00000000-0000-0000-0000-000000000001',
  'Admin RePrompt',
  'jaguar-mistico',
  ARRAY['/images/jaguar-prompt-result.png'],
  ARRAY['jaguar', 'místico', 'fantasia', 'animal'],
  4.9,
  156,
  2100
),
(
  '33333333-3333-3333-3333-333333333333',
  'Mulher Super Saiyajin',
  'Transforme personagens em poderosas guerreiras do estilo Dragon Ball',
  'super saiyan woman, dragon ball style, powerful aura',
  'stable-diffusion',
  18.00,
  true,
  false,
  true,
  true,
  false,
  true,
  '00000000-0000-0000-0000-000000000001',
  'Admin RePrompt',
  'mulher-super-saiyajin',
  ARRAY['/images/super-saiyan-woman-preview.jpg'],
  ARRAY['anime', 'super saiyajin', 'dragon ball', 'mulher'],
  4.7,
  234,
  3200
),
(
  '44444444-4444-4444-4444-444444444444',
  'Logo Minimalista',
  'Prompt gratuito para criar logos minimalistas e modernos',
  'minimalist logo design, clean lines, modern typography',
  'dalle',
  0,
  false,
  true,
  true,
  false,
  false,
  true,
  '00000000-0000-0000-0000-000000000001',
  'Admin RePrompt',
  'logo-minimalista',
  ARRAY['/placeholder.jpg'],
  ARRAY['logo', 'design', 'minimalista', 'gratuito'],
  4.6,
  892,
  3421
);

-- Inserir FAQs de exemplo
INSERT INTO faqs (question, answer, category, order_num) VALUES
('Como funciona o RePrompt?', 'O RePrompt é um marketplace onde você pode comprar e vender prompts para inteligência artificial.', 'geral', 1),
('Os prompts funcionam mesmo?', 'Sim! Todos os prompts são testados antes de serem publicados.', 'geral', 2),
('Posso vender meus prompts?', 'Claro! Cadastre-se e comece a vender seus prompts hoje mesmo.', 'vendas', 3);

-- Criar índices para performance
CREATE INDEX idx_prompts_category ON prompts(category);
CREATE INDEX idx_prompts_featured ON prompts(featured);
CREATE INDEX idx_prompts_author ON prompts(author_id);
CREATE INDEX idx_prompts_slug ON prompts(slug);
CREATE INDEX idx_prompts_active ON prompts(active);
CREATE INDEX idx_reviews_prompt ON reviews(prompt_id);
CREATE INDEX idx_purchases_user ON purchases(user_id);

-- Funções para incrementar contadores (caso necessário)
CREATE OR REPLACE FUNCTION increment_views(prompt_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE prompts SET views = views + 1 WHERE id = prompt_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_downloads(prompt_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE prompts SET downloads = downloads + 1 WHERE id = prompt_id;
END;
$$ LANGUAGE plpgsql;