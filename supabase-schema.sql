-- PriceSpy India - Supabase Schema
-- Run this in Supabase SQL Editor to set up your database

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL DEFAULT 'shopping_bag',
  description TEXT,
  image_url TEXT,
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  brand TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  images JSONB DEFAULT '[]',
  video_url TEXT DEFAULT '',
  specs JSONB DEFAULT '{}',
  rating DECIMAL(2,1) DEFAULT 4.0,
  review_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prices table (current prices per platform)
CREATE TABLE prices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('amazon','flipkart','meesho','snapdeal','jiomart','tatacliq','indiamart','myntra','ajio','bewakoof','zivame','clovia','libas','fabindia','limeroad','nykaa','purplle','mamaearth','mcaffeine','plum','sugar','bigbasket','licious','freshtohome','countrydelight','croma','vijaysales','boat','noise','lenskart','coolwinks','pepperfry','urbanladder','wakefit','woodenstreet','onemg','netmeds','pharmeasy','healthkart','apollo','makemytrip','goibibo','ixigo','easemytrip','cleartrip','yatra','redbus','bookmyshow','cardekho','cars24','droom','99acres','magicbricks','housing','nobroker','policybazaar','groww','paytm','firstcry','hopscotch','agrostar','dehaat','moglix','industrybuying')),
  price INTEGER NOT NULL CHECK (price > 0),
  original_price INTEGER NOT NULL CHECK (original_price > 0),
  discount_percent INTEGER GENERATED ALWAYS AS (
    ROUND(((original_price - price)::NUMERIC / original_price) * 100)
  ) STORED,
  affiliate_link TEXT,
  in_stock BOOLEAN DEFAULT true,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, platform)
);

-- Price history (time-series tracking)
CREATE TABLE price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  price INTEGER NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Price alerts
CREATE TABLE price_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  target_price INTEGER NOT NULL CHECK (target_price > 0),
  is_active BOOLEAN DEFAULT true,
  triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wishlist / Favorites
CREATE TABLE wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Admin users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_prices_product_id ON prices(product_id);
CREATE INDEX idx_prices_platform ON prices(platform);
CREATE INDEX idx_price_history_product ON price_history(product_id, recorded_at DESC);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_alerts_user ON price_alerts(user_id);
CREATE INDEX idx_alerts_active ON price_alerts(is_active);
CREATE INDEX idx_wishlists_user ON wishlists(user_id);

-- Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Public read access for products, prices, categories
CREATE POLICY "Products are public" ON products FOR SELECT USING (true);
CREATE POLICY "Prices are public" ON prices FOR SELECT USING (true);
CREATE POLICY "Price history is public" ON price_history FOR SELECT USING (true);
CREATE POLICY "Categories are public" ON categories FOR SELECT USING (true);

-- Authenticated user policies for alerts
CREATE POLICY "Users can view own alerts" ON price_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create alerts" ON price_alerts FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can update own alerts" ON price_alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own alerts" ON price_alerts FOR DELETE USING (auth.uid() = user_id);

-- Admin users RLS
CREATE POLICY "Admins can read own access" ON admin_users FOR SELECT USING (auth.uid() = id);

-- Authenticated user policies for wishlists
CREATE POLICY "Users can view own wishlist" ON wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to wishlist" ON wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove from wishlist" ON wishlists FOR DELETE USING (auth.uid() = user_id);

-- Seed categories
INSERT INTO categories (name, slug, icon, description, product_count) VALUES
  ('Mobiles', 'mobiles', 'smartphone', 'Smartphones & feature phones', 28),
  ('Laptops', 'laptops', 'laptop_mac', 'Laptops & ultrabooks', 18),
  ('Earbuds', 'earbuds', 'headphones', 'True wireless & wired earphones', 15),
  ('Fashion', 'fashion', 'checkroom', 'Clothing, shoes & accessories', 22),
  ('Home & Kitchen', 'home-kitchen', 'kitchen', 'Home appliances & kitchenware', 14),
  ('Beauty', 'beauty', 'spa', 'Beauty & personal care', 12),
  ('Cameras', 'cameras', 'camera_alt', 'DSLR, mirrorless & action cams', 9),
  ('Accessories', 'accessories', 'watch', 'Watches, bags & gadgets', 20),
  ('Grocery & Food', 'grocery', 'restaurant', 'Groceries, meat & food delivery', 10),
  ('Health & Pharma', 'health', 'local_pharmacy', 'Pharmacy, health supplements & wellness', 15),
  ('Furniture & Home', 'furniture', 'chair', 'Furniture, decor & home improvement', 12),
  ('Travel', 'travel', 'flight', 'Flights, hotels & holiday packages', 8),
  ('Eyewear', 'eyewear', 'visibility', 'Eyeglasses, sunglasses & contact lenses', 6),
  ('Automobile', 'automobile', 'directions_car', 'Cars, bikes & auto accessories', 7),
  ('Real Estate', 'real-estate', 'real_estate_agent', 'Property listings & rentals', 5),
  ('Fintech', 'fintech', 'account_balance', 'Insurance, investments & payments', 9),
  ('Baby & Kids', 'baby-kids', 'child_care', 'Baby care, toys & kids clothing', 8),
  ('Events & Tickets', 'events', 'confirmation_number', 'Movies, events & entertainment', 4),
  ('Agriculture', 'agriculture', 'agriculture', 'Farming supplies & agri inputs', 3),
  ('B2B & Industrial', 'b2b', 'precision_manufacturing', 'Industrial goods & B2B supplies', 6);
