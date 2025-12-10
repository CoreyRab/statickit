-- AdForge Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  credits INTEGER DEFAULT 5 NOT NULL, -- Start with 5 free credits
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'agency')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ads table (original uploaded ads)
CREATE TABLE public.ads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  original_image_url TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  aspect_ratio TEXT NOT NULL, -- e.g., "4:5", "1:1"
  aspect_ratio_decimal DECIMAL(10, 4) NOT NULL,
  analysis JSONB, -- Stores AdAnalysis
  status TEXT DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'analyzing', 'analyzed', 'error')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Variations table (suggested/generated variations)
CREATE TABLE public.variations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ad_id UUID NOT NULL REFERENCES public.ads(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🎨',
  status TEXT DEFAULT 'suggested' CHECK (status IN ('suggested', 'approved', 'generating', 'completed', 'error')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated images table
CREATE TABLE public.generated_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variation_id UUID NOT NULL REFERENCES public.variations(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  aspect_ratio TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credit transactions table
CREATE TABLE public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- Positive for credits added, negative for usage
  type TEXT NOT NULL CHECK (type IN ('purchase', 'usage', 'bonus', 'refund')),
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_ads_project_id ON public.ads(project_id);
CREATE INDEX idx_variations_ad_id ON public.variations(ad_id);
CREATE INDEX idx_generated_images_variation_id ON public.generated_images(variation_id);
CREATE INDEX idx_credit_transactions_user_id ON public.credit_transactions(user_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view their own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- Ads policies
CREATE POLICY "Users can view their own ads"
  ON public.ads FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = ads.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can create ads in their own projects"
  ON public.ads FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = ads.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own ads"
  ON public.ads FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = ads.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own ads"
  ON public.ads FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = ads.project_id
    AND projects.user_id = auth.uid()
  ));

-- Variations policies
CREATE POLICY "Users can view variations of their own ads"
  ON public.variations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.ads
    JOIN public.projects ON projects.id = ads.project_id
    WHERE ads.id = variations.ad_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can create variations for their own ads"
  ON public.variations FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.ads
    JOIN public.projects ON projects.id = ads.project_id
    WHERE ads.id = variations.ad_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can update variations of their own ads"
  ON public.variations FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.ads
    JOIN public.projects ON projects.id = ads.project_id
    WHERE ads.id = variations.ad_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete variations of their own ads"
  ON public.variations FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.ads
    JOIN public.projects ON projects.id = ads.project_id
    WHERE ads.id = variations.ad_id
    AND projects.user_id = auth.uid()
  ));

-- Generated images policies
CREATE POLICY "Users can view generated images of their variations"
  ON public.generated_images FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.variations
    JOIN public.ads ON ads.id = variations.ad_id
    JOIN public.projects ON projects.id = ads.project_id
    WHERE variations.id = generated_images.variation_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can create generated images for their variations"
  ON public.generated_images FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.variations
    JOIN public.ads ON ads.id = variations.ad_id
    JOIN public.projects ON projects.id = ads.project_id
    WHERE variations.id = generated_images.variation_id
    AND projects.user_id = auth.uid()
  ));

-- Credit transactions policies
CREATE POLICY "Users can view their own credit transactions"
  ON public.credit_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own credit transactions"
  ON public.credit_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, credits, plan)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    5, -- 5 free credits
    'free'
  );

  -- Log the bonus credits
  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (NEW.id, 5, 'bonus', 'Welcome bonus - 5 free generations');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to deduct credits
CREATE OR REPLACE FUNCTION public.deduct_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_description TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_credits INTEGER;
BEGIN
  -- Get current credits
  SELECT credits INTO v_current_credits
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;

  -- Check if user has enough credits
  IF v_current_credits < p_amount THEN
    RETURN FALSE;
  END IF;

  -- Deduct credits
  UPDATE public.profiles
  SET credits = credits - p_amount,
      updated_at = NOW()
  WHERE id = p_user_id;

  -- Log transaction
  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (p_user_id, -p_amount, 'usage', p_description);

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Storage bucket for ad images
-- Run this in Supabase dashboard or use the API
-- INSERT INTO storage.buckets (id, name, public) VALUES ('ads', 'ads', true);

-- Storage policies (run after creating the bucket)
-- CREATE POLICY "Users can upload their own ad images"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'ads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Anyone can view ad images"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'ads');

-- CREATE POLICY "Users can delete their own ad images"
--   ON storage.objects FOR DELETE
--   USING (bucket_id = 'ads' AND auth.uid()::text = (storage.foldername(name))[1]);
