-- Supabase Database Setup Script
-- Run this in your Supabase SQL Editor to create all necessary tables

-- Create banners table
CREATE TABLE IF NOT EXISTS banners (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  published BOOLEAN NOT NULL DEFAULT true
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  role TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  published BOOLEAN NOT NULL DEFAULT true
);

-- Create history_items table
CREATE TABLE IF NOT EXISTS history_items (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create contact_cards table
CREATE TABLE IF NOT EXISTS contact_cards (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('image', 'text')),
  title TEXT,
  content TEXT,
  image_url TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_banners_order ON banners(order_index);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_testimonials_created ON testimonials(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_testimonials_published ON testimonials(published);
CREATE INDEX IF NOT EXISTS idx_history_order ON history_items(order_index);
CREATE INDEX IF NOT EXISTS idx_contact_order ON contact_cards(order_index);
CREATE INDEX IF NOT EXISTS idx_admin_username ON admin_users(username);

-- Enable Row Level Security (RLS)
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE history_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for banners" ON banners FOR SELECT USING (true);
CREATE POLICY "Public read access for posts" ON posts FOR SELECT USING (published = true);
CREATE POLICY "Public read access for testimonials" ON testimonials FOR SELECT USING (published = true);
CREATE POLICY "Public read access for history" ON history_items FOR SELECT USING (true);
CREATE POLICY "Public read access for contact cards" ON contact_cards FOR SELECT USING (true);

-- Create policies for service role (admin) full access
-- Note: These policies use the service_role which bypasses RLS by default
-- But we define them for clarity and potential future use with custom roles

CREATE POLICY "Service role full access to banners" ON banners 
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to posts" ON posts 
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to testimonials" ON testimonials 
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to history" ON history_items 
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to contact cards" ON contact_cards 
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to admin users" ON admin_users 
  FOR ALL USING (auth.role() = 'service_role');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;
