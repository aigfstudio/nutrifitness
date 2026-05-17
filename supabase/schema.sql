-- =====================================================================
-- NutriFitness.ch — Full Supabase Schema
-- Run this in your Supabase SQL Editor
-- =====================================================================

-- ── Profiles ──────────────────────────────────────────────────────────
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  phone text,
  address jsonb,
  role text default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Admin can view all profiles" on profiles for select
  using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- ── Banners (Hero Slider) ─────────────────────────────────────────────
create table if not exists banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  badge text,
  cta_text text default 'SHOP NOW',
  cta_link text default '/products',
  cta2_text text,
  cta2_link text,
  bg_color text default '#080808',
  image_url text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table banners enable row level security;
create policy "Public read banners" on banners for select using (true);
create policy "Admin manage banners" on banners for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- ── Promo Bar ─────────────────────────────────────────────────────────
create table if not exists promo_messages (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  link text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table promo_messages enable row level security;
create policy "Public read promo" on promo_messages for select using (true);
create policy "Admin manage promo" on promo_messages for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- ── Categories ────────────────────────────────────────────────────────
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  abbr text,
  bg_color text default '#1a1a3a',
  image_url text,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table categories enable row level security;
create policy "Public read categories" on categories for select using (true);
create policy "Admin manage categories" on categories for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- ── Products ──────────────────────────────────────────────────────────
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  sku text unique,
  name text not null,
  brand text,
  slug text unique not null,
  description_short text,
  description_long text,
  category text,
  subcategory text,
  price numeric(10,2) not null,
  price_original numeric(10,2),
  currency text default 'CHF',
  weight_g integer,
  flavors text[],
  images text[],
  in_stock boolean default true,
  is_featured boolean default false,
  is_new boolean default false,
  badge_text text,
  badge_color text default '#c8102e',
  rating numeric(2,1) default 0,
  review_count integer default 0,
  tags text[],
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table products enable row level security;
create policy "Public read products" on products for select using (true);
create policy "Admin manage products" on products for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- ── Offers ────────────────────────────────────────────────────────────
create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  offer_type text not null check (offer_type in ('bogo', 'percentage', 'fixed')),
  discount_value numeric(10,2),
  product_id uuid references products(id) on delete cascade,
  category text,
  is_active boolean default true,
  start_date timestamptz,
  end_date timestamptz,
  created_at timestamptz default now()
);

alter table offers enable row level security;
create policy "Public read offers" on offers for select using (true);
create policy "Admin manage offers" on offers for all
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- ── Orders ────────────────────────────────────────────────────────────
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique default 'NF-' || floor(random() * 900000 + 100000)::text,
  user_id uuid references profiles(id) on delete set null,
  items jsonb not null,
  subtotal numeric(10,2) not null,
  shipping_cost numeric(10,2) default 0,
  total numeric(10,2) not null,
  status text default 'pending' check (status in ('pending','processing','shipped','delivered','cancelled','refunded')),
  shipping_address jsonb,
  billing_address jsonb,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table orders enable row level security;
create policy "Users can view own orders" on orders for select using (auth.uid() = user_id);
create policy "Users can create orders" on orders for insert with check (auth.uid() = user_id);
create policy "Admin can view all orders" on orders for select
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));
create policy "Admin can update orders" on orders for update
  using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- ── Wishlist ──────────────────────────────────────────────────────────
create table if not exists wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

alter table wishlist enable row level security;
create policy "Users manage own wishlist" on wishlist for all using (auth.uid() = user_id);

-- ── Auto-update updated_at trigger ────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at before update on products
  for each row execute function update_updated_at();
create trigger banners_updated_at before update on banners
  for each row execute function update_updated_at();
create trigger profiles_updated_at before update on profiles
  for each row execute function update_updated_at();
create trigger orders_updated_at before update on orders
  for each row execute function update_updated_at();

-- ── Auto-create profile on signup ─────────────────────────────────────
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- =====================================================================
-- SEED DATA
-- =====================================================================

-- Promo messages
insert into promo_messages (text, link, sort_order) values
  ('Buy 1, Get 1 50% Off! — SHOP NOW', '/products', 1),
  ('Free Shipping on Orders over CHF 79', '/products', 2),
  ('Save 10% When You Pick Up In-Store!', '/products', 3);

-- Banners
insert into banners (title, subtitle, badge, cta_text, cta_link, cta2_text, cta2_link, bg_color, sort_order) values
  ('BUILD YOUR BEST BODY', 'Premium Swiss nutrition. Keto, protein & performance supplements delivered to your door.', 'New Drop 2025', 'SHOP NOW', '/products', 'VIEW KETO RANGE', '/products?cat=keto', '#080808', 1),
  ('KETO DONE DELICIOUSLY', 'Croissants, bars & snacks — only 2g net carbs. Taste the lifestyle.', 'Keto Collection', 'SHOP KETO', '/products?cat=keto', 'SEE ALL KETO', '/products?cat=keto', '#0d0d0d', 2),
  ('BUY 1 GET 1 FREE PROTEIN', 'Mix and match all whey flavours. This week only — don''t miss out.', 'Limited Deal', 'GRAB THE DEAL', '/products?cat=protein', 'VIEW ALL PROTEIN', '/products?cat=protein', '#0a0005', 3);

-- Categories
insert into categories (name, slug, abbr, bg_color, sort_order) values
  ('Protein', 'protein', 'PRO', '#1a3a6b', 1),
  ('Pre-Workout', 'pre-workout', 'PRE', '#0a0a1a', 2),
  ('Vitamins', 'vitamins', 'VIT', '#0a4a2a', 3),
  ('Weight Loss', 'weight-loss', 'FAT', '#c8102e', 4),
  ('Keto', 'keto', 'KET', '#3a1a6b', 5),
  ('Women''s Health', 'womens-health', 'WMN', '#6b1a3a', 6),
  ('Men''s Health', 'mens-health', 'MEN', '#1a4a1a', 7),
  ('Energy', 'energy', 'NRG', '#4a3a00', 8),
  ('Recovery', 'recovery', 'REC', '#003a4a', 9),
  ('Herbs & Naturals', 'herbs-naturals', 'HRB', '#1a3a1a', 10),
  ('Food & Snacks', 'food-snacks', 'SNK', '#4a2a00', 11),
  ('Sports Performance', 'sports-performance', 'SPT', '#2a2a4a', 12);

-- Products
insert into products (sku, name, brand, slug, description_short, description_long, category, price, price_original, flavors, images, in_stock, is_featured, is_new, badge_text, badge_color, rating, review_count, tags) values
  ('NF-001', 'Animal Creatine Chews - Candy Crushed', 'UNIVERSAL NUTRITION', 'animal-creatine-chews', 'Chewable creatine tablets with 5g creatine monohydrate per serving. Delicious candy flavour with no mixing required.', '<p>Animal Creatine Chews deliver clinically dosed creatine monohydrate in a convenient, delicious chewable format. Each serving provides 5g of pure creatine monohydrate — the gold standard for strength, power, and muscle gains.</p><h3>Key Benefits</h3><ul><li>5g Creatine Monohydrate per serving</li><li>No mixing required</li><li>30 servings per container</li><li>Supports ATP regeneration for explosive power</li></ul>', 'Pre-Workout', 36.99, null, ARRAY['Candy Crushed'], ARRAY[]::text[], true, true, true, 'New Flavor', '#00704a', 5.0, 205, ARRAY['creatine','chews','pre-workout']),
  ('NF-002', 'Creatine Monohydrate', 'GNC PRO PERFORMANCE', 'gnc-creatine-monohydrate', 'Pure creatine monohydrate powder. 50 servings of 5g creatine. Unflavored and easy to mix.', '<p>GNC Pro Performance Creatine Monohydrate provides 5g of pure, pharmaceutical-grade creatine per serving. Mix it into your pre or post-workout shake for maximum muscle gains and recovery.</p><h3>Key Benefits</h3><ul><li>5g pure creatine monohydrate</li><li>Increases strength and power output</li><li>Supports muscle growth</li><li>Unflavoured — mixes with anything</li></ul>', 'Pre-Workout', 24.99, null, ARRAY['Unflavored'], ARRAY[]::text[], true, true, false, 'BOGO 50%', '#006400', 4.5, 82, ARRAY['creatine','gnc','performance']),
  ('NF-003', 'Gold Standard 100% Whey - Vanilla', 'OPTIMUM NUTRITION', 'on-gold-standard-whey-vanilla', 'The world''s best-selling whey protein. 24g protein per serving, low fat, low carb. Incredible taste.', '<p>Gold Standard 100% Whey has been the world''s best-selling whey protein powder for over a decade. With 24g of protein, 5.5g of naturally occurring BCAAs, and 11g of EAAs per serving, it delivers exactly what your muscles need to recover and grow.</p><h3>Key Benefits</h3><ul><li>24g whey protein per serving</li><li>5.5g naturally occurring BCAAs</li><li>Low fat (1.5g) and low sugar (1g)</li><li>120+ delicious flavours</li></ul>', 'Protein', 89.99, 109.99, ARRAY['Vanilla','Chocolate','Strawberry','Banana'], ARRAY[]::text[], true, true, false, 'Top Rated', '#8B4513', 4.5, 1203, ARRAY['whey','protein','gold-standard']),
  ('NF-004', 'L-Carnitine 500mg Tablets', 'GNC PRO PERFORMANCE', 'gnc-l-carnitine-500mg', 'L-Carnitine supports fat metabolism and energy production. 60 tablets, 500mg each.', '<p>L-Carnitine is a naturally occurring amino acid derivative that plays a critical role in the transportation of fatty acids into the mitochondria. This process is essential for the production of energy from fat stores.</p><h3>Key Benefits</h3><ul><li>500mg L-Carnitine per tablet</li><li>Supports fat metabolism</li><li>May improve exercise performance</li><li>60 tablets per bottle</li></ul>', 'Weight Loss', 19.99, 39.99, ARRAY['Unflavored'], ARRAY[]::text[], true, false, false, 'LAST CHANCE! 75% OFF', '#c8102e', 4.5, 10, ARRAY['l-carnitine','weight-loss','fat-burner']),
  ('NF-005', 'Whey More - Christmas Cookie', 'AXE & SLEDGE SUPPLEMENTS', 'axe-sledge-whey-more-cookie', 'Premium whey protein blend with an incredible Christmas Cookie flavour. 30 servings of 25g protein.', '<p>Whey More from Axe & Sledge Supplements is a premium whey protein blend featuring whey protein concentrate and isolate. Formulated for serious athletes who demand the best in taste and nutrition.</p><h3>Key Benefits</h3><ul><li>25g protein per serving</li><li>Whey concentrate + isolate blend</li><li>Incredible Christmas Cookie flavor</li><li>30 servings per bag</li></ul>', 'Protein', 37.97, 54.99, ARRAY['Christmas Cookie','Chocolate','Vanilla'], ARRAY[]::text[], true, true, true, '25% Off', '#6b21a8', 5.0, 126, ARRAY['whey','protein','axe-sledge']),
  ('NF-006', 'C4 Original Pre-Workout - Fruit Punch', 'CELLUCOR', 'c4-original-preworkout-fruit-punch', 'The #1 selling pre-workout in America. Explosive energy, endurance and pumps. 30 servings.', '<p>C4 Original is America''s #1 pre-workout supplement, and for good reason. Each scoop delivers explosive energy, enhanced endurance, and skin-splitting pumps thanks to a scientifically-developed formula.</p><h3>Key Benefits</h3><ul><li>150mg caffeine for explosive energy</li><li>1.6g Beta-Alanine for endurance</li><li>1g Creatine Nitrate for pumps</li><li>30 explosive servings</li></ul>', 'Pre-Workout', 32.99, null, ARRAY['Fruit Punch','Blue Raspberry','Watermelon','Orange'], ARRAY[]::text[], true, false, false, null, '#c8102e', 4.0, 456, ARRAY['c4','pre-workout','cellucor','energy']),
  ('NF-007', 'LIT Pre-Workout - Gummy Worm', 'GNC BEYOND RAW', 'beyond-raw-lit-preworkout-gummy', 'Clinical doses of clinically proven ingredients. Massive energy, focus, and pumps. 30 servings.', '<p>Beyond Raw LIT is one of the most powerful pre-workouts on the market, featuring clinical doses of beta-alanine, caffeine, and other performance-enhancing compounds in a delicious Gummy Worm flavor.</p><h3>Key Benefits</h3><ul><li>250mg Caffeine Anhydrous</li><li>3.2g Beta-Alanine</li><li>1.5g Nitric Oxide precursors</li><li>Clinical dosing, not proprietary blends</li></ul>', 'Pre-Workout', 44.99, null, ARRAY['Gummy Worm','Fruit Punch','Blue Raspberry'], ARRAY[]::text[], true, true, false, 'Best Seller', '#003087', 4.5, 334, ARRAY['lit','beyond-raw','gnc','pre-workout']),
  ('NF-008', 'Platinum Creatine Monohydrate 400g', 'MUSCLETECH', 'muscletech-platinum-creatine-400g', 'Pure, pharmaceutical-grade creatine monohydrate. 80 servings. Build muscle, increase strength.', '<p>MuscleTech Platinum Creatine is ultrapure creatine monohydrate — nothing added, nothing removed. This unflavoured powder mixes instantly and completely, delivering 5g of creatine per serving.</p><h3>Key Benefits</h3><ul><li>5g ultra-pure creatine monohydrate</li><li>80 servings per container</li><li>Mixes instantly</li><li>No filler, no artificial colours</li></ul>', 'Pre-Workout', 18.99, 29.99, ARRAY['Unflavored'], ARRAY[]::text[], true, false, false, '37% OFF', '#d4a017', 4.0, 278, ARRAY['creatine','muscletech','strength']),
  ('NF-009', 'Keto Croissant - Original', 'NUTRIFITNESS', 'keto-croissant-original', 'Indulge without guilt. Our signature keto croissant with only 2g net carbs. Crispy outside, soft inside.', '<p>The NutriFitness Keto Croissant is a revolution in keto baking. Made with premium almond flour and organic butter, each croissant delivers authentic bakery taste with zero sugar and only 2g net carbs.</p><h3>Key Benefits</h3><ul><li>Only 2g net carbs</li><li>0g sugar</li><li>High in healthy fats</li><li>Perfect for keto & low-carb diets</li></ul>', 'Keto', 4.99, null, ARRAY['Original','Cheese','Chocolate'], ARRAY[]::text[], true, true, true, 'Swiss Made', '#c8102e', 4.8, 87, ARRAY['keto','croissant','low-carb','swiss']);
