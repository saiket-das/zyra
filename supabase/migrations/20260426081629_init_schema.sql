-- Create public.users table extending auth.users
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT,
  avatar_url TEXT,
  age INTEGER,
  gender TEXT,
  height_cm NUMERIC,
  weight_kg NUMERIC,
  body_fat_percentage NUMERIC,
  activity_level TEXT,
  goal TEXT,
  dietary_preferences TEXT[],
  macro_strategy TEXT,
  protein_target NUMERIC,
  carbs_target NUMERIC,
  fat_target NUMERIC,
  water_target_ml NUMERIC
);

-- Create foods table
CREATE TABLE public.foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  brand TEXT,
  serving_size TEXT,
  grams NUMERIC,
  calories NUMERIC NOT NULL,
  protein NUMERIC NOT NULL,
  carbs NUMERIC NOT NULL,
  fat NUMERIC NOT NULL,
  fiber NUMERIC,
  sugar NUMERIC,
  sodium NUMERIC,
  region TEXT, -- For Malaysia, Bangladesh, India localization
  source TEXT, -- 'usda', 'open_food_facts', 'ai_generated', 'user_submitted'
  verification_status TEXT DEFAULT 'pending_review' -- 'verified', 'community_verified', 'ai_generated', 'pending_review'
);

-- Create ai_generated_foods table for tracking AI generation origins
CREATE TABLE public.ai_generated_foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  original_query TEXT,
  food_id UUID REFERENCES public.foods(id) ON DELETE CASCADE,
  confidence_score NUMERIC,
  ai_provider TEXT DEFAULT 'gemini'
);

-- Create food_logs table
CREATE TABLE public.food_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  food_id UUID REFERENCES public.foods(id) ON DELETE SET NULL,
  custom_food_name TEXT, -- If manual quick add without db food
  grams_consumed NUMERIC,
  calories NUMERIC NOT NULL,
  protein NUMERIC,
  carbs NUMERIC,
  fat NUMERIC,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_type TEXT -- 'breakfast', 'lunch', 'dinner', 'snack'
);

-- RLS Policies

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generated_foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;

-- Users can only read and update their own profiles
CREATE POLICY "Users can view own profile" 
  ON public.users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.users FOR UPDATE 
  USING (auth.uid() = id);

-- Foods are readable by everyone
CREATE POLICY "Foods are viewable by everyone" 
  ON public.foods FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert foods" 
  ON public.foods FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- AI Generated Foods are viewable by everyone
CREATE POLICY "AI generated foods are viewable by everyone" 
  ON public.ai_generated_foods FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert ai generated foods" 
  ON public.ai_generated_foods FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Food logs are strictly private
CREATE POLICY "Users can manage their own food logs" 
  ON public.food_logs FOR ALL 
  USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger to automatically create a user profile when a new user signs up via auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
