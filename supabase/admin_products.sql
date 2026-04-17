-- Run this in Supabase SQL Editor (drop old table first if needed)
DROP TABLE IF EXISTS admin_products;

CREATE TABLE admin_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Basic Info
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Tees',
  fit TEXT NOT NULL DEFAULT 'Oversized',
  description TEXT,
  material TEXT,
  care_instructions TEXT,
  sku TEXT UNIQUE,
  tags TEXT, -- comma separated e.g. "summer,oversized,black"

  -- Pricing
  price DECIMAL(10, 2) NOT NULL,        -- MRP / original price
  sale_price DECIMAL(10, 2),            -- Offer/Sale price (NULL = no offer)
  is_on_sale BOOLEAN DEFAULT false,

  -- Inventory
  stock INTEGER NOT NULL DEFAULT 0,
  track_inventory BOOLEAN DEFAULT true,

  -- Media
  image_url TEXT DEFAULT '/images/product1.png',
  image_url_2 TEXT,
  image_url_3 TEXT,
  image_url_4 TEXT,

  -- Flags
  is_drop BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,

  -- SEO Fields
  seo_title TEXT,
  seo_description TEXT,
  seo_slug TEXT UNIQUE,
  seo_keywords TEXT,

  -- Schema.org structured data (auto-generated or custom)
  schema_json TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Allow public reads of active products
ALTER TABLE admin_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads active products"
  ON admin_products FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users manage products"
  ON admin_products FOR ALL USING (auth.role() = 'authenticated');
