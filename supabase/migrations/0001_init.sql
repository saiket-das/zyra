-- Supabase enables pgcrypto in most projects; enable it separately if needed.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  username text unique,
  height_cm numeric,
  weight_kg numeric,
  goal text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.food_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text,
  country text,
  source text not null default 'manual',
  verified boolean not null default false,
  confidence numeric(4,3),
  nutrition jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.food_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  food_item_id uuid references public.food_items (id) on delete set null,
  meal_type text,
  serving_size text,
  grams numeric,
  calories numeric,
  protein numeric,
  carbs numeric,
  fat numeric,
  logged_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.body_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  metric_type text not null,
  value numeric not null,
  unit text not null,
  measured_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- RLS and policy definitions will be added in a Supabase-specific migration.

-- Keep triggers/functions for a later migration when the SQL validator supports them.
