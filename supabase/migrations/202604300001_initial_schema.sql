CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE food_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  dish_name TEXT NOT NULL,
  restaurant_name TEXT NOT NULL,
  restaurant_address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  cuisine_tags TEXT[],
  overall_rating INTEGER,
  flavor_umami INTEGER DEFAULT 0,
  flavor_spicy INTEGER DEFAULT 0,
  flavor_sweet INTEGER DEFAULT 0,
  flavor_aromatic INTEGER DEFAULT 0,
  flavor_sour INTEGER DEFAULT 0,
  flavor_rich INTEGER DEFAULT 0,
  tasting_notes TEXT,
  cost_per_person DECIMAL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE food_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id UUID REFERENCES food_records(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  is_cover BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  achievement_key TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  description TEXT,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  is_scratched BOOLEAN DEFAULT false,
  UNIQUE(user_id, achievement_key)
);

CREATE TABLE explored_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  area_name TEXT NOT NULL,
  area_center_lat DOUBLE PRECISION,
  area_center_lng DOUBLE PRECISION,
  first_visited_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, area_name)
);
