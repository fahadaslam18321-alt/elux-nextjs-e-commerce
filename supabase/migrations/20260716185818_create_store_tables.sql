/*
# Create ELUX store tables: products, orders, order_items

## Purpose
Unify the storefront and admin dashboard around a single shared data source.
Products are CRUD-managed from /admin and displayed on Home/Shop/Product pages.
Orders are placed at checkout and drive the admin KPIs (revenue, orders, customers)
and analytics (monthly revenue chart, top products by quantity sold).

## New Tables

### products
- id (uuid, PK, default gen_random_uuid)
- name (text, not null)
- tagline (text, not null)
- description (text, not null)
- category (text, not null)
- price (integer, not null) — USD whole dollars
- rating (numeric(2,1), default 4.5)
- reviews (integer, default 0)
- image (text, not null) — URL
- stock (integer, default 0)
- featured (boolean, default false)
- badge (text, nullable)
- created_at (timestamptz, default now())

### orders
- id (uuid, PK)
- email (text, not null)
- total (integer, not null)
- status (text, default 'completed')
- created_at (timestamptz, default now())

### order_items
- id (uuid, PK)
- order_id (uuid, FK -> orders.id ON DELETE CASCADE)
- product_id (uuid, FK -> products.id ON DELETE SET NULL)
- product_name (text, not null)
- quantity (integer, not null)
- price (integer, not null)

## Security
- Single-tenant app (no sign-in). RLS enabled on all tables.
- Policies allow anon + authenticated full CRUD on all three tables.
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  category text NOT NULL,
  price integer NOT NULL,
  rating numeric(2,1) DEFAULT 4.5,
  reviews integer DEFAULT 0,
  image text NOT NULL,
  stock integer DEFAULT 0,
  featured boolean DEFAULT false,
  badge text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_products" ON products;
CREATE POLICY "anon_insert_products" ON products FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_products" ON products;
CREATE POLICY "anon_update_products" ON products FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_products" ON products;
CREATE POLICY "anon_delete_products" ON products FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  total integer NOT NULL,
  status text NOT NULL DEFAULT 'completed',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL,
  price integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_order_items" ON order_items;
CREATE POLICY "anon_select_order_items" ON order_items FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_order_items" ON order_items;
CREATE POLICY "anon_insert_order_items" ON order_items FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_order_items" ON order_items;
CREATE POLICY "anon_update_order_items" ON order_items FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_order_items" ON order_items;
CREATE POLICY "anon_delete_order_items" ON order_items FOR DELETE TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

INSERT INTO products (id, name, tagline, description, category, price, rating, reviews, image, stock, featured, badge)
VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Aura Wireless Headphones', 'Immersive adaptive sound', 'Studio-grade drivers with adaptive noise cancellation and 40-hour battery life. Machined aluminum ear cups with memory-foam cushions for all-day comfort.', 'Audio', 349, 4.8, 1284, 'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg?auto=compress&cs=tinysrgb&w=800', 50, true, 'Best Seller'),
  ('a1b2c3d4-0001-4000-8000-000000000002', 'Pulse Pro Earbuds', 'Sound without limits', 'Compact true-wireless earbuds with spatial audio, transparency mode, and a wireless charging case. Sweat and water resistant for any workout.', 'Audio', 199, 4.6, 842, 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=800', 80, false, NULL),
  ('a1b2c3d4-0001-4000-8000-000000000003', 'Chrono Smartwatch', 'Your day, on your wrist', 'A stunning always-on AMOLED display, advanced health tracking, GPS, and multi-day battery. Swap bands to match any moment.', 'Wearables', 429, 4.7, 967, 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800', 35, true, 'New'),
  ('a1b2c3d4-0001-4000-8000-000000000004', 'Flex Fitness Band', 'Move with intention', 'Lightweight fitness tracker with continuous heart-rate, sleep insights, and a 14-day battery. Slim, comfortable, and always motivating.', 'Wearables', 129, 4.4, 531, 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=800', 100, false, NULL),
  ('a1b2c3d4-0001-4000-8000-000000000005', 'Nova Ultrabook 14', 'Power that travels light', 'A featherweight aluminum ultrabook with a brilliant 14-inch display, all-day battery, and blazing performance for work and play.', 'Computing', 1299, 4.9, 402, 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600', 20, true, 'Editor''s Choice'),
  ('a1b2c3d4-0001-4000-8000-000000000006', 'Glide Wireless Mouse', 'Precision in your palm', 'Ergonomic wireless mouse with silent clicks, adjustable DPI, and a rechargeable battery that lasts for months on a single charge.', 'Computing', 79, 4.5, 288, 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=800', 150, false, NULL),
  ('a1b2c3d4-0001-4000-8000-000000000007', 'Halo Smart Speaker', 'Fill every room', 'Room-filling 360-degree sound with a built-in voice assistant and elegant fabric finish that complements any space.', 'Home', 179, 4.6, 654, 'https://images.pexels.com/photos/4790255/pexels-photo-4790255.jpeg?auto=compress&cs=tinysrgb&w=600', 45, false, NULL),
  ('a1b2c3d4-0001-4000-8000-000000000008', 'Lumen Desk Lamp', 'Light that adapts to you', 'Smart LED desk lamp with tunable warmth, wireless charging base, and touch controls. Designed to reduce eye strain during long sessions.', 'Home', 149, 4.7, 219, 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=800', 60, false, 'New'),
  ('a1b2c3d4-0001-4000-8000-000000000009', 'Vista Mirrorless Camera', 'Capture the extraordinary', 'A compact mirrorless camera with a full-frame sensor, 4K video, and lightning-fast autofocus. The perfect companion for creators.', 'Photography', 1599, 4.9, 176, 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=800', 15, true, 'Best Seller'),
  ('a1b2c3d4-0001-4000-8000-000000000010', 'Orbit Camera Drone', 'See the world from above', 'Foldable 4K camera drone with obstacle avoidance, 34-minute flight time, and cinematic auto-flight modes for stunning aerial footage.', 'Photography', 899, 4.8, 143, 'https://images.pexels.com/photos/336232/pexels-photo-336232.jpeg?auto=compress&cs=tinysrgb&w=800', 25, false, NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO orders (id, email, total, status, created_at)
VALUES
  ('a1b2c3d4-0002-4000-8000-000000000001', 'sarah.chen@example.com', 548, 'completed', '2025-01-15T10:30:00Z'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'mike.rivera@example.com', 199, 'completed', '2025-02-08T14:20:00Z'),
  ('a1b2c3d4-0002-4000-8000-000000000003', 'sarah.chen@example.com', 429, 'completed', '2025-03-22T09:15:00Z'),
  ('a1b2c3d4-0002-4000-8000-000000000004', 'james.park@example.com', 1299, 'completed', '2025-04-05T16:45:00Z'),
  ('a1b2c3d4-0002-4000-8000-000000000005', 'lisa.wong@example.com', 179, 'completed', '2025-05-12T11:00:00Z'),
  ('a1b2c3d4-0002-4000-8000-000000000006', 'mike.rivera@example.com', 349, 'completed', '2025-06-18T13:30:00Z'),
  ('a1b2c3d4-0002-4000-8000-000000000007', 'sarah.chen@example.com', 899, 'completed', '2025-07-01T08:20:00Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
VALUES
  ('a1b2c3d4-0002-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000001', 'Aura Wireless Headphones', 1, 349),
  ('a1b2c3d4-0002-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000006', 'Glide Wireless Mouse', 1, 79),
  ('a1b2c3d4-0002-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000008', 'Lumen Desk Lamp', 1, 149),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'a1b2c3d4-0001-4000-8000-000000000002', 'Pulse Pro Earbuds', 1, 199),
  ('a1b2c3d4-0002-4000-8000-000000000003', 'a1b2c3d4-0001-4000-8000-000000000003', 'Chrono Smartwatch', 1, 429),
  ('a1b2c3d4-0002-4000-8000-000000000004', 'a1b2c3d4-0001-4000-8000-000000000005', 'Nova Ultrabook 14', 1, 1299),
  ('a1b2c3d4-0002-4000-8000-000000000005', 'a1b2c3d4-0001-4000-8000-000000000007', 'Halo Smart Speaker', 1, 179),
  ('a1b2c3d4-0002-4000-8000-000000000006', 'a1b2c3d4-0001-4000-8000-000000000001', 'Aura Wireless Headphones', 1, 349),
  ('a1b2c3d4-0002-4000-8000-000000000007', 'a1b2c3d4-0001-4000-8000-000000000010', 'Orbit Camera Drone', 1, 899)
ON CONFLICT DO NOTHING;
