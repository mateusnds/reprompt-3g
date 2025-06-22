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

-- Criando a estrutura do banco de dados
CREATE TABLE IF NOT EXISTS prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT,
  prompt TEXT,
  category VARCHAR(100),
  tags TEXT[],
  price DECIMAL(10,2) DEFAULT 0,
  is_free BOOLEAN DEFAULT false,
  ai_tool VARCHAR(100),
  author_name VARCHAR(255),
  author_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  views INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  slug VARCHAR(255),
  preview_images TEXT[],
  images TEXT[],
  difficulty VARCHAR(50) DEFAULT 'beginner',
  license VARCHAR(50) DEFAULT 'personal',
  is_admin_created BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  video_url TEXT
);

-- Tabela de reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_id UUID REFERENCES prompts(id),
  user_id VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  helpful_votes INTEGER DEFAULT 0,
  reported BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de FAQs
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  order_num INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de compras (para verificação de reviews)
CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_id UUID REFERENCES prompts(id),
  user_id VARCHAR(255) NOT NULL,
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  amount DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'completed'
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

-- Função para incrementar views
CREATE OR REPLACE FUNCTION increment_views(prompt_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE prompts 
  SET views = views + 1, updated_at = now()
  WHERE id = prompt_id;
END;
$$ LANGUAGE plpgsql;

-- Função para incrementar downloads
CREATE OR REPLACE FUNCTION increment_downloads(prompt_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE prompts 
  SET downloads = downloads + 1, updated_at = now()
  WHERE id = prompt_id;
END;
$$ LANGUAGE plpgsql;

-- Inserir dados de exemplo apenas se não existirem
INSERT INTO prompts (title, description, content, category, tags, price, is_free, ai_tool, author_name, featured, verified, slug, difficulty, license, is_admin_created)
SELECT * FROM (VALUES
  ('Retrato Profissional de Mulher', 'Prompt avançado para criar retratos profissionais femininos com iluminação cinematográfica', 'professional portrait of a woman, cinematic lighting, high quality, detailed', 'midjourney', ARRAY['retrato', 'profissional', 'mulher', 'fotografia'], 15.99, false, 'Midjourney', 'Ana Silva', true, true, 'retrato-profissional-mulher', 'intermediate', 'commercial', false),
  ('Jaguar Místico', 'Crie imagens impressionantes de jaguares com elementos místicos e mágicos', 'mystical jaguar, magical elements, fantasy art style', 'dall-e', ARRAY['jaguar', 'místico', 'fantasia', 'animal'], 22.50, false, 'DALL-E', 'Carlos Santos', true, true, 'jaguar-mistico', 'advanced', 'commercial', false),
  ('Mulher Super Saiyajin', 'Transforme personagens em poderosas guerreiras do estilo Dragon Ball', 'super saiyan woman, dragon ball style, powerful aura', 'stable-diffusion', ARRAY['anime', 'super saiyajin', 'dragon ball', 'mulher'], 18.00, false, 'Stable Diffusion', 'Maria Costa', true, true, 'mulher-super-saiyajin', 'intermediate', 'personal', false),
  ('Logo Minimalista Gratuito', 'Prompt gratuito para criar logos minimalistas e modernos', 'minimalist logo design, clean lines, modern typography', 'dall-e', ARRAY['logo', 'design', 'minimalista', 'gratuito'], 0, true, 'DALL-E', 'Admin RePrompt', false, true, 'logo-minimalista-gratuito', 'beginner', 'personal', true),
  ('Paisagem Cyberpunk', 'Crie paisagens futurísticas com estética cyberpunk', 'cyberpunk cityscape, neon lights, futuristic architecture', 'midjourney', ARRAY['cyberpunk', 'futurista', 'cidade', 'neon'], 12.99, false, 'Midjourney', 'Tech Artist', false, false, 'paisagem-cyberpunk', 'intermediate', 'commercial', false)
) AS v(title, description, content, category, tags, price, is_free, ai_tool, author_name, featured, verified, slug, difficulty, license, is_admin_created)
WHERE NOT EXISTS (SELECT 1 FROM prompts WHERE slug = v.slug);

-- Inserir FAQs de exemplo
INSERT INTO faqs (question, answer, category, order_num)
SELECT * FROM (VALUES
  ('Como funciona o marketplace de prompts?', 'Nosso marketplace conecta criadores de prompts com usuários que precisam de prompts de qualidade. Você pode comprar, vender e descobrir prompts para diversas ferramentas de IA.', 'Geral', 1),
  ('Como posso vender meus prompts?', 'Para vender prompts, você precisa criar uma conta, acessar o dashboard e clicar em "Adicionar Novo Prompt". Defina título, descrição, preço e faça upload das imagens.', 'Vendas', 2),
  ('Quais formas de pagamento são aceitas?', 'Aceitamos cartão de crédito, débito, PIX, boleto bancário e PayPal. Todos os pagamentos são processados de forma segura.', 'Pagamentos', 3),
  ('Posso solicitar reembolso?', 'Sim, oferecemos reembolso integral em até 7 dias após a compra se você não estiver satisfeito com o prompt.', 'Pagamentos', 4),
  ('Como funciona o sistema de avaliações?', 'Apenas usuários que compraram o prompt podem avaliá-lo. As avaliações incluem nota de 1 a 5 estrelas e comentários.', 'Avaliações', 5)
) AS v(question, answer, category, order_num)
WHERE NOT EXISTS (SELECT 1 FROM faqs WHERE question = v.question);

-- Inserir algumas reviews de exemplo
INSERT INTO reviews (prompt_id, user_id, user_name, rating, comment, is_verified_purchase)
SELECT p.id, 'user1', 'João Silva', 5, 'Excelente prompt! Resultados incríveis.', true
FROM prompts p WHERE p.slug = 'retrato-profissional-mulher'
AND NOT EXISTS (SELECT 1 FROM reviews WHERE prompt_id = p.id AND user_id = 'user1');

INSERT INTO reviews (prompt_id, user_id, user_name, rating, comment, is_verified_purchase)
SELECT p.id, 'user2', 'Maria Santos', 4, 'Muito bom, recomendo!', true
FROM prompts p WHERE p.slug = 'jaguar-mistico'
AND NOT EXISTS (SELECT 1 FROM reviews WHERE prompt_id = p.id AND user_id = 'user2');

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_prompts_category ON prompts(category);
CREATE INDEX IF NOT EXISTS idx_prompts_featured ON prompts(featured);
CREATE INDEX IF NOT EXISTS idx_prompts_slug ON prompts(slug);
CREATE INDEX IF NOT EXISTS idx_reviews_prompt_id ON reviews(prompt_id);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS idx_tags_category ON tags(category);