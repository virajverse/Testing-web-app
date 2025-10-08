
CREATE TABLE services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
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
  category_id INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_services_category_id ON services(category_id);
CREATE INDEX idx_services_is_active ON services(is_active);
