
-- Limpar dados existentes
DROP TABLE IF EXISTS purchases CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS prompts CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS users CASCADE;

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
  icon VARCHAR(100),
  description TEXT,
  order_num INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela principal de prompts
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  price DECIMAL(10,2) DEFAULT 0,
  ai_tool VARCHAR(100),
  author VARCHAR(255) NOT NULL,
  author_id UUID REFERENCES users(id),
  author_avatar TEXT,
  slug VARCHAR(255) NOT NULL,
  preview_images TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  difficulty VARCHAR(20) DEFAULT 'beginner',
  license VARCHAR(20) DEFAULT 'personal',
  views INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  is_free BOOLEAN DEFAULT true,
  is_paid BOOLEAN DEFAULT false,
  is_admin_created BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  user_name VARCHAR(255) NOT NULL,
  user_avatar TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  helpful_votes INTEGER DEFAULT 0,
  reported BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de compras
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  prompt_id UUID REFERENCES prompts(id),
  price DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_prompts_category ON prompts(category);
CREATE INDEX idx_prompts_featured ON prompts(featured);
CREATE INDEX idx_prompts_slug ON prompts(slug);
CREATE INDEX idx_prompts_author ON prompts(author_id);
CREATE INDEX idx_reviews_prompt ON reviews(prompt_id);
CREATE INDEX idx_purchases_user ON purchases(user_id);

-- Inserir dados de exemplo
INSERT INTO categories (name, slug, icon, description, order_num) VALUES
('Midjourney', 'midjourney', '🎨', 'Prompts para Midjourney', 1),
('ChatGPT', 'chatgpt', '💬', 'Prompts para ChatGPT', 2),
('DALL-E', 'dalle', '🖼️', 'Prompts para DALL-E', 3),
('Claude', 'claude', '🤖', 'Prompts para Claude', 4),
('Stable Diffusion', 'stable-diffusion', '🎭', 'Prompts para Stable Diffusion', 5),
('Leonardo AI', 'leonardo-ai', '🎪', 'Prompts para Leonardo AI', 6),
('Gemini', 'gemini', '💎', 'Prompts para Gemini', 7),
('Grok', 'grok', '⚡', 'Prompts para Grok', 8),
('FLUX', 'flux', '🌊', 'Prompts para FLUX', 9),
('Sora', 'sora', '🎬', 'Prompts para Sora', 10),
('Vídeos', 'videos', '📹', 'Prompts para vídeos', 11);

INSERT INTO tags (name, slug, category, is_active) VALUES
('retrato', 'retrato', 'midjourney', true),
('profissional', 'profissional', 'midjourney', true),
('mulher', 'mulher', 'midjourney', true),
('fotografia', 'fotografia', 'midjourney', true),
('jaguar', 'jaguar', 'dalle', true),
('místico', 'mistico', 'dalle', true),
('fantasia', 'fantasia', 'dalle', true),
('animal', 'animal', 'dalle', true),
('anime', 'anime', 'stable-diffusion', true),
('super saiyajin', 'super-saiyajin', 'stable-diffusion', true),
('dragon ball', 'dragon-ball', 'stable-diffusion', true),
('logo', 'logo', 'dalle', true),
('design', 'design', 'dalle', true),
('minimalista', 'minimalista', 'dalle', true),
('gratuito', 'gratuito', 'geral', true),
('cyberpunk', 'cyberpunk', 'midjourney', true),
('futurista', 'futurista', 'midjourney', true),
('cidade', 'cidade', 'midjourney', true),
('neon', 'neon', 'midjourney', true),
('marketing', 'marketing', 'chatgpt', true),
('instagram', 'instagram', 'chatgpt', true),
('redes sociais', 'redes-sociais', 'chatgpt', true),
('cta', 'cta', 'chatgpt', true),
('engajamento', 'engajamento', 'chatgpt', true);

-- Inserir usuário admin
INSERT INTO users (id, name, email, password, is_admin, avatar) VALUES
('00000000-0000-0000-0000-000000000001', 'Admin RePrompt', 'admin@reprompt.com', '$2a$10$dummy.hash.for.admin', true, '/placeholder-user.jpg');

-- Inserir prompts de exemplo
INSERT INTO prompts (
  id, title, description, content, category, tags, price, ai_tool, author, author_id, 
  slug, preview_images, images, difficulty, license, views, downloads, rating, 
  review_count, featured, verified, is_free, is_paid, is_admin_created
) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'Retrato Profissional de Mulher',
  'Prompt avançado para criar retratos profissionais femininos com iluminação cinematográfica',
  'professional portrait of a woman, cinematic lighting, high quality, detailed, studio lighting, elegant pose, professional makeup, business attire --ar 3:4 --v 6',
  'midjourney',
  ARRAY['retrato', 'profissional', 'mulher', 'fotografia'],
  15.99,
  'Midjourney',
  'Admin RePrompt',
  '00000000-0000-0000-0000-000000000001',
  'retrato-profissional-mulher',
  ARRAY['/images/woman-portrait-preview.jpg'],
  ARRAY['/images/woman-portrait-preview.jpg'],
  'intermediate',
  'commercial',
  1250,
  89,
  4.8,
  23,
  true,
  true,
  false,
  true,
  true
),
(
  '22222222-2222-2222-2222-222222222222',
  'Jaguar Místico',
  'Crie imagens impressionantes de jaguares com elementos místicos e mágicos',
  'mystical jaguar with glowing eyes, magical forest setting, ethereal lighting, fantasy art style, detailed fur texture, ancient ruins background --ar 16:9 --v 6',
  'dalle',
  ARRAY['jaguar', 'místico', 'fantasia', 'animal'],
  22.50,
  'DALL-E',
  'Admin RePrompt',
  '00000000-0000-0000-0000-000000000001',
  'jaguar-mistico',
  ARRAY['/images/jaguar-prompt-result.png'],
  ARRAY['/images/jaguar-prompt-result.png'],
  'advanced',
  'commercial',
  2100,
  156,
  4.9,
  45,
  true,
  true,
  false,
  true,
  true
),
(
  '33333333-3333-3333-3333-333333333333',
  'Mulher Super Saiyajin',
  'Transforme personagens em poderosas guerreiras do estilo Dragon Ball',
  'super saiyan woman warrior, golden aura, spiky blonde hair, dragon ball z anime style, powerful pose, energy blast, detailed anime art --ar 2:3 --v 6',
  'stable-diffusion',
  ARRAY['anime', 'super saiyajin', 'dragon ball', 'mulher'],
  18.00,
  'Stable Diffusion',
  'Admin RePrompt',
  '00000000-0000-0000-0000-000000000001',
  'mulher-super-saiyajin',
  ARRAY['/images/super-saiyan-woman-preview.jpg'],
  ARRAY['/images/super-saiyan-woman-preview.jpg'],
  'intermediate',
  'personal',
  3200,
  234,
  4.7,
  67,
  true,
  true,
  false,
  true,
  true
),
(
  '44444444-4444-4444-4444-444444444444',
  'Logo Minimalista',
  'Prompt gratuito para criar logos minimalistas e modernos',
  'minimalist logo design, clean lines, modern typography, simple geometric shapes, professional branding, vector style --v 6',
  'dalle',
  ARRAY['logo', 'design', 'minimalista', 'gratuito'],
  0,
  'DALL-E',
  'Admin RePrompt',
  '00000000-0000-0000-0000-000000000001',
  'logo-minimalista',
  ARRAY['/placeholder.jpg'],
  ARRAY['/placeholder.jpg'],
  'beginner',
  'personal',
  3421,
  892,
  4.6,
  134,
  false,
  true,
  true,
  false,
  true
),
(
  '55555555-5555-5555-5555-555555555555',
  'Paisagem Cyberpunk',
  'Crie paisagens futurísticas com estética cyberpunk',
  'cyberpunk cityscape at night, neon lights, futuristic architecture, rain-soaked streets, flying cars, holographic advertisements, dark atmosphere --ar 21:9 --v 6',
  'midjourney',
  ARRAY['cyberpunk', 'futurista', 'cidade', 'neon'],
  12.99,
  'Midjourney',
  'Admin RePrompt',
  '00000000-0000-0000-0000-000000000001',
  'paisagem-cyberpunk',
  ARRAY['/placeholder.jpg'],
  ARRAY['/placeholder.jpg'],
  'intermediate',
  'commercial',
  1890,
  203,
  4.5,
  89,
  false,
  false,
  false,
  true,
  true
),
(
  '66666666-6666-6666-6666-666666666666',
  'Gerador de Posts para Instagram',
  'Crie posts envolventes para Instagram com CTAs poderosos que convertem seguidores em clientes',
  'Crie um post para Instagram sobre [TÓPICO] que seja envolvente e inclua um CTA forte. Use emojis relevantes e hashtags estratégicas. Mantenha o tom [CASUAL/PROFISSIONAL] e foque em [OBJETIVO]. Estruture o post com: 1) Hook inicial cativante 2) Desenvolvimento do conteúdo 3) CTA claro e direto 4) Hashtags relevantes (máximo 10)',
  'chatgpt',
  ARRAY['marketing', 'instagram', 'redes sociais', 'cta', 'engajamento'],
  29.90,
  'ChatGPT',
  'Admin RePrompt',
  '00000000-0000-0000-0000-000000000001',
  'gerador-posts-instagram',
  ARRAY['/placeholder.jpg'],
  ARRAY['/placeholder.jpg'],
  'beginner',
  'commercial',
  4521,
  678,
  4.7,
  156,
  true,
  true,
  false,
  true,
  true
);

-- Inserir algumas reviews de exemplo
INSERT INTO reviews (prompt_id, user_id, user_name, user_avatar, rating, comment, is_verified_purchase) VALUES
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'João Silva', '/placeholder-user.jpg', 5, 'Excelente prompt! Resultados incríveis!', true),
('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', 'Maria Santos', '/placeholder-user.jpg', 5, 'Adorei o resultado místico, muito detalhado!', true),
('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 'Pedro Costa', '/placeholder-user.jpg', 4, 'Bom prompt para anime, recomendo!', true);
