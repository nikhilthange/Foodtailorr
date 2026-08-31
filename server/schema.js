// PostgreSQL Schema for Food Tailor
// Run this file to create tables: node schema.js

export const schema = `
-- Brands table
CREATE TABLE IF NOT EXISTS brands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  tagline VARCHAR(255),
  cuisine VARCHAR(100),
  description TEXT,
  why_we_picked TEXT,
  established INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Dishes table
CREATE TABLE IF NOT EXISTS dishes (
  id SERIAL PRIMARY KEY,
  brand_id INTEGER REFERENCES brands(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  price_per_head INTEGER NOT NULL,
  is_veg BOOLEAN DEFAULT FALSE,
  is_signature BOOLEAN DEFAULT TRUE,
  serves_min INTEGER DEFAULT 10,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Occasions table
CREATE TABLE IF NOT EXISTS occasions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(10),
  description TEXT
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_ref VARCHAR(50) UNIQUE NOT NULL,
  occasion_id INTEGER REFERENCES occasions(id),
  guest_count INTEGER NOT NULL CHECK (guest_count >= 10),
  budget_per_head INTEGER,
  dietary_preference VARCHAR(20) DEFAULT 'all',
  total_estimate INTEGER,
  status VARCHAR(30) DEFAULT 'pending',
  event_date DATE,
  venue_address TEXT,
  contact_name VARCHAR(200),
  contact_phone VARCHAR(20),
  contact_email VARCHAR(200),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Order Items table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  dish_id INTEGER REFERENCES dishes(id),
  quantity INTEGER NOT NULL,
  price_per_head INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_dishes_brand ON dishes(brand_id);
CREATE INDEX IF NOT EXISTS idx_dishes_category ON dishes(category);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
`;

export default schema;
