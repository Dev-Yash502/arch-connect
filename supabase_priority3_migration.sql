-- ============================================================
-- SQL Migration: Add Tables for Priority 3 Features
-- 1. Active Projects (Progress Tracker)
-- 2. Ratings & Reviews System
-- Run this script in your Supabase SQL Editor.
-- ============================================================

-- 1. Active Projects Table
CREATE TABLE IF NOT EXISTS public.active_projects (
  id text PRIMARY KEY,
  name text NOT NULL,
  client_name text,
  location text,
  overall_progress numeric DEFAULT 0,
  lead_architect text,
  lead_engineer text,
  interior_designer text,
  material_supplier text,
  estimated_completion text,
  total_budget numeric,
  amount_paid numeric DEFAULT 0,
  milestones jsonb DEFAULT '[]'::jsonb,
  site_photos jsonb DEFAULT '[]'::jsonb,
  client_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  professional_id text REFERENCES public.professionals(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- RLS for Active Projects
ALTER TABLE public.active_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active_projects" ON public.active_projects FOR SELECT USING (true);
CREATE POLICY "Anyone insert active_projects" ON public.active_projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone update active_projects" ON public.active_projects FOR UPDATE USING (true);
CREATE POLICY "Anyone delete active_projects" ON public.active_projects FOR DELETE USING (true);

-- 2. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id text PRIMARY KEY,
  professional_id text REFERENCES public.professionals(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  rating numeric CHECK (rating >= 1 AND rating <= 5),
  comment text,
  project_title text,
  created_at timestamptz DEFAULT now()
);

-- RLS for Reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Anyone insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone update reviews" ON public.reviews FOR UPDATE USING (true);
CREATE POLICY "Anyone delete reviews" ON public.reviews FOR DELETE USING (true);
