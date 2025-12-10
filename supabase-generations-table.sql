-- Simplified generations table for storing generation history
-- Run this in your Supabase SQL editor

-- Drop old complex tables if migrating (optional - comment out if you want to keep them)
-- DROP TABLE IF EXISTS public.generated_images CASCADE;
-- DROP TABLE IF EXISTS public.variations CASCADE;
-- DROP TABLE IF EXISTS public.ads CASCADE;
-- DROP TABLE IF EXISTS public.projects CASCADE;

-- Simple generations table
CREATE TABLE IF NOT EXISTS public.generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  original_image_url TEXT NOT NULL,
  original_filename TEXT,
  aspect_ratio TEXT NOT NULL,
  analysis JSONB,
  variations JSONB NOT NULL DEFAULT '[]', -- Array of { id, title, description, image_url }
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON public.generations(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON public.generations(created_at DESC);

-- Enable RLS
ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own generations"
  ON public.generations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own generations"
  ON public.generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own generations"
  ON public.generations FOR DELETE
  USING (auth.uid() = user_id);
