
-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  avatar TEXT DEFAULT '/placeholder-user.jpg',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT NOT NULL,
  description TEXT NOT NULL,
  count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de prompts
CREATE TABLE IF NOT EXISTS prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) DEFAULT 0,
  is_paid BOOLEAN DEFAULT FALSE,
  is_free BOOLEAN DEFAULT TRUE,
  is_admin_created BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  author_id TEXT NOT NULL,
  author TEXT NOT NULL,
  author_avatar TEXT DEFAULT '/placeholder-user.jpg',
  thumbnail TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  video_preview TEXT,
  tags TEXT[] DEFAULT '{}',
  rating DECIMAL(3,2) DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  slug TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category, slug)
);

-- Criar tabela de tags
CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  category TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, category)
);

-- Criar tabela de reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_avatar TEXT DEFAULT '/placeholder-user.jpg',
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_votes INTEGER DEFAULT 0,
  reported BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id TEXT NOT NULL,
  author TEXT NOT NULL,
  author_avatar TEXT DEFAULT '/placeholder-user.jpg',
  thumbnail TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de FAQs
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  order_num INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir dados fictícios (usar DO block para evitar conflitos)
DO $$
BEGIN
  -- Categorias
  IF NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'midjourney') THEN
    INSERT INTO categories (name, slug, icon, description, count) VALUES
    ('Midjourney', 'midjourney', '🎨', 'Prompts para geração de imagens com Midjourney', 25);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'dalle') THEN
    INSERT INTO categories (name, slug, icon, description, count) VALUES
    ('DALL-E', 'dalle', '🖼️', 'Prompts para criação de imagens com DALL-E', 18);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'stable-diffusion') THEN
    INSERT INTO categories (name, slug, icon, description, count) VALUES
    ('Stable Diffusion', 'stable-diffusion', '⚡', 'Prompts para Stable Diffusion e derivados', 32);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'chatgpt') THEN
    INSERT INTO categories (name, slug, icon, description, count) VALUES
    ('ChatGPT', 'chatgpt', '💬', 'Prompts para conversas e assistência com ChatGPT', 44);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'leonardo-ai') THEN
    INSERT INTO categories (name, slug, icon, description, count) VALUES
    ('Leonardo AI', 'leonardo-ai', '🎭', 'Prompts para Leonardo AI e criação artística', 15);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM categories WHERE slug = 'photorealistic') THEN
    INSERT INTO categories (name, slug, icon, description, count) VALUES
    ('Photorealistic', 'photorealistic', '📸', 'Prompts para imagens fotorrealistas', 28);
  END IF;

  -- Usuários de exemplo
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@prompts.com') THEN
    INSERT INTO users (name, email, password, is_admin) VALUES
    ('Admin User', 'admin@prompts.com', 'admin123', true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'maria@example.com') THEN
    INSERT INTO users (name, email, password, is_admin) VALUES
    ('Maria Silva', 'maria@example.com', '123456', false);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'joao@example.com') THEN
    INSERT INTO users (name, email, password, is_admin) VALUES
    ('João Santos', 'joao@example.com', '123456', false);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'ana@example.com') THEN
    INSERT INTO users (name, email, password, is_admin) VALUES
    ('Ana Costa', 'ana@example.com', '123456', false);
  END IF;

  -- Prompts de exemplo
  IF NOT EXISTS (SELECT 1 FROM prompts WHERE slug = 'retrato-fotorrealista-profissional' AND category = 'midjourney') THEN
    INSERT INTO prompts (title, description, content, category, price, is_paid, is_free, featured, author_id, author, thumbnail, images, tags, rating, downloads, views, slug) VALUES
    ('Retrato Fotorrealista Profissional', 'Crie retratos incrivelmente realistas com detalhes profissionais', 'professional portrait of a [person], ultra realistic, detailed facial features, perfect lighting, 8k resolution, photographic quality', 'midjourney', 15.99, true, false, true, '1', 'Maria Silva', '/images/woman-portrait-preview.jpg', '{"/images/woman-portrait-preview.jpg"}', '{"retrato", "fotorrealista", "profissional"}', 4.8, 150, 1200, 'retrato-fotorrealista-profissional');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM prompts WHERE slug = 'paisagem-fantastica-epica' AND category = 'dalle') THEN
    INSERT INTO prompts (title, description, content, category, price, is_paid, is_free, featured, author_id, author, thumbnail, images, tags, rating, downloads, views, slug) VALUES
    ('Paisagem Fantástica Épica', 'Gere paisagens fantásticas de tirar o fôlego', 'epic fantasy landscape, mystical mountains, magical atmosphere, dramatic lighting, cinematic composition, highly detailed', 'dalle', 12.50, true, false, true, '2', 'João Santos', '/placeholder.jpg', '{"/placeholder.jpg"}', '{"paisagem", "fantasia", "épico"}', 4.6, 89, 856, 'paisagem-fantastica-epica');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM prompts WHERE slug = 'assistente-programacao-ia' AND category = 'chatgpt') THEN
    INSERT INTO prompts (title, description, content, category, price, is_paid, is_free, featured, author_id, author, thumbnail, images, tags, rating, downloads, views, slug) VALUES
    ('Assistente de Programação IA', 'Prompt para assistente especializado em programação', 'You are an expert programming assistant. Help with code review, debugging, and optimization. Provide clear explanations and best practices.', 'chatgpt', 0, false, true, true, '3', 'Ana Costa', '/placeholder.jpg', '{"/placeholder.jpg"}', '{"programação", "código", "assistente"}', 4.9, 245, 1580, 'assistente-programacao-ia');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM prompts WHERE slug = 'arte-digital-anime-kawaii' AND category = 'stable-diffusion') THEN
    INSERT INTO prompts (title, description, content, category, price, is_paid, is_free, featured, author_id, author, thumbnail, images, tags, rating, downloads, views, slug) VALUES
    ('Arte Digital Anime Kawaii', 'Crie personagens anime super fofinhos', 'kawaii anime character, big eyes, pastel colors, cute expression, digital art style, high quality illustration', 'stable-diffusion', 8.99, true, false, false, '1', 'Maria Silva', '/images/cat-bird-jar-preview.jpg', '{"/images/cat-bird-jar-preview.jpg"}', '{"anime", "kawaii", "personagem"}', 4.7, 178, 920, 'arte-digital-anime-kawaii');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM prompts WHERE slug = 'arquitetura-moderna-minimalista' AND category = 'leonardo-ai') THEN
    INSERT INTO prompts (title, description, content, category, price, is_paid, is_free, featured, author_id, author, thumbnail, images, tags, rating, downloads, views, slug) VALUES
    ('Arquitetura Moderna Minimalista', 'Designs arquitetônicos modernos e minimalistas', 'modern minimalist architecture, clean lines, glass and steel, geometric shapes, natural lighting, contemporary design', 'leonardo-ai', 18.50, true, false, true, '2', 'João Santos', '/placeholder.jpg', '{"/placeholder.jpg"}', '{"arquitetura", "moderno", "minimalista"}', 4.5, 67, 432, 'arquitetura-moderna-minimalista');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM prompts WHERE slug = 'jaguar-selva-amazonica' AND category = 'photorealistic') THEN
    INSERT INTO prompts (title, description, content, category, price, is_paid, is_free, featured, author_id, author, thumbnail, images, tags, rating, downloads, views, slug) VALUES
    ('Jaguar na Selva Amazônica', 'Imagem realista de jaguar em seu habitat natural', 'majestic jaguar in amazon rainforest, photorealistic, detailed fur texture, natural habitat, cinematic lighting, wildlife photography style', 'photorealistic', 14.99, true, false, true, '3', 'Ana Costa', '/images/jaguar-prompt-result.png', '{"/images/jaguar-prompt-result.png"}', '{"jaguar", "selva", "realista"}', 4.8, 201, 1340, 'jaguar-selva-amazonica');
  END IF;

  -- Tags
  IF NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Retrato' AND category = 'midjourney') THEN
    INSERT INTO tags (name, slug, category, is_active) VALUES
    ('Retrato', 'retrato', 'midjourney', true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Fotorrealista' AND category = 'midjourney') THEN
    INSERT INTO tags (name, slug, category, is_active) VALUES
    ('Fotorrealista', 'fotorrealista', 'midjourney', true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Paisagem' AND category = 'dalle') THEN
    INSERT INTO tags (name, slug, category, is_active) VALUES
    ('Paisagem', 'paisagem', 'dalle', true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Fantasia' AND category = 'dalle') THEN
    INSERT INTO tags (name, slug, category, is_active) VALUES
    ('Fantasia', 'fantasia', 'dalle', true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Programação' AND category = 'chatgpt') THEN
    INSERT INTO tags (name, slug, category, is_active) VALUES
    ('Programação', 'programacao', 'chatgpt', true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Assistente' AND category = 'chatgpt') THEN
    INSERT INTO tags (name, slug, category, is_active) VALUES
    ('Assistente', 'assistente', 'chatgpt', true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Anime' AND category = 'stable-diffusion') THEN
    INSERT INTO tags (name, slug, category, is_active) VALUES
    ('Anime', 'anime', 'stable-diffusion', true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Kawaii' AND category = 'stable-diffusion') THEN
    INSERT INTO tags (name, slug, category, is_active) VALUES
    ('Kawaii', 'kawaii', 'stable-diffusion', true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Arquitetura' AND category = 'leonardo-ai') THEN
    INSERT INTO tags (name, slug, category, is_active) VALUES
    ('Arquitetura', 'arquitetura', 'leonardo-ai', true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Moderno' AND category = 'leonardo-ai') THEN
    INSERT INTO tags (name, slug, category, is_active) VALUES
    ('Moderno', 'moderno', 'leonardo-ai', true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Animais' AND category = 'photorealistic') THEN
    INSERT INTO tags (name, slug, category, is_active) VALUES
    ('Animais', 'animais', 'photorealistic', true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM tags WHERE name = 'Natureza' AND category = 'photorealistic') THEN
    INSERT INTO tags (name, slug, category, is_active) VALUES
    ('Natureza', 'natureza', 'photorealistic', true);
  END IF;
END $$;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_prompts_category ON prompts(category);
CREATE INDEX IF NOT EXISTS idx_prompts_featured ON prompts(featured);
CREATE INDEX IF NOT EXISTS idx_prompts_slug ON prompts(slug);
CREATE INDEX IF NOT EXISTS idx_reviews_prompt_id ON reviews(prompt_id);
CREATE INDEX IF NOT EXISTS idx_tags_category ON tags(category);

-- Função para incrementar visualizações
CREATE OR REPLACE FUNCTION increment_views(prompt_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE prompts 
  SET views = views + 1 
  WHERE id = prompt_id;
END;
$$;

-- Função para incrementar downloads
CREATE OR REPLACE FUNCTION increment_downloads(prompt_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE prompts 
  SET downloads = downloads + 1 
  WHERE id = prompt_id;
END;
$$;
