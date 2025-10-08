
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name_en TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_slug ON categories(slug);

INSERT INTO categories (name_en, name_hi, slug) VALUES 
('Websites', 'वेबसाइट्स', 'websites'),
('Mobile Apps', 'मोबाइल ऐप्स', 'mobile-apps'),
('Digital Marketing', 'डिजिटल मार्केटिंग', 'digital-marketing'),
('Branding', 'ब्रांडिंग', 'branding');
