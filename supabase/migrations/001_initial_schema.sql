-- Taliyo Marketplace - Initial Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories Table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);

-- Insert default categories
INSERT INTO categories (name_en, name_hi, slug) VALUES 
('Websites', 'वेबसाइट्स', 'websites'),
('Mobile Apps', 'मोबाइल ऐप्स', 'mobile-apps'),
('Digital Marketing', 'डिजिटल मार्केटिंग', 'digital-marketing'),
('Branding', 'ब्रांडिंग', 'branding');

-- Services Table
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  price INTEGER NOT NULL,
  delivery_time INTEGER NOT NULL,
  short_desc_en TEXT,
  short_desc_hi TEXT,
  full_desc_en TEXT,
  full_desc_hi TEXT,
  features_en TEXT,
  features_hi TEXT,
  image_url TEXT,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_services_category_id ON services(category_id);
CREATE INDEX idx_services_is_active ON services(is_active);

-- Orders Table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  client_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'contacted',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_service_id ON orders(service_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Public read access for categories and services
CREATE POLICY "Public can view categories" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Public can view active services" ON services
    FOR SELECT USING (is_active = true);

-- Admin policies (you'll need to set up auth)
-- For now, allow all operations (update this after setting up auth)
CREATE POLICY "Allow all for categories" ON categories
    FOR ALL USING (true);

CREATE POLICY "Allow all for services" ON services
    FOR ALL USING (true);

CREATE POLICY "Allow all for orders" ON orders
    FOR ALL USING (true);
