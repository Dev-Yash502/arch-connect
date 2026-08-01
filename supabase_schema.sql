-- ============================================================
-- Arch-Connect: Supabase Database Schema
-- Run this entire script in the Supabase SQL Editor
-- Project: uvdaqjfmvxzgrnqwhfdy
-- ============================================================

-- 1. User Profiles (extends Supabase auth.users)
create table if not exists user_profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  role text not null check (role in ('client', 'professional', 'admin')),
  joined_at timestamptz default now()
);

-- 2. Professionals Directory
create table if not exists professionals (
  id text primary key,
  name text,
  role text,
  title text,
  rating numeric default 4.5,
  review_count int default 0,
  experience_years int default 0,
  price_per_sqft numeric default 100,
  avatar text,
  badge text,
  location text,
  bio text,
  specialties text[],
  portfolio jsonb default '[]'::jsonb,
  phone text,
  email text,
  completed_projects_count int default 0,
  verification_status text default 'unverified' check (verification_status in ('unverified', 'pending', 'approved', 'rejected')),
  aadhaar_number text,
  aadhaar_file_name text,
  aadhaar_file_url text,
  pan_number text,
  pan_file_name text,
  pan_file_url text,
  license_type text,
  license_id text,
  license_file_name text,
  license_file_url text,
  owner_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

-- 3. Client Requirements
create table if not exists requirements (
  id text primary key,
  title text not null,
  category text,
  built_up_area_sqft numeric,
  location text,
  budget_range text,
  preferred_timeline text,
  architectural_style text,
  description text,
  status text default 'Open for Bids',
  owner_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

-- 4. Proposals & Interested Experts
create table if not exists proposals (
  id text primary key,
  requirement_id text references requirements(id) on delete cascade,
  professional_id text,
  professional_name text,
  professional_role text,
  professional_avatar text,
  rating numeric default 4.5,
  price_estimate_total numeric,
  timeline_estimate_months numeric,
  key_highlights text[],
  scope_breakdown jsonb default '[]'::jsonb,
  status text default 'Pending',
  rating_enabled boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table user_profiles enable row level security;
alter table professionals enable row level security;
alter table requirements enable row level security;
alter table proposals enable row level security;

-- user_profiles: users can read and insert their own profile
create policy "Users read own profile"
  on user_profiles for select
  using (auth.uid() = id);

create policy "Users insert own profile"
  on user_profiles for insert
  with check (auth.uid() = id);

create policy "Users update own profile"
  on user_profiles for update
  using (auth.uid() = id);

-- professionals: anyone can read, owner can insert/update
create policy "Public read professionals"
  on professionals for select
  using (true);

create policy "Owner upsert professional"
  on professionals for insert
  with check (true);

create policy "Owner update professional"
  on professionals for update
  using (true);

-- requirements: anyone can read, authenticated users can insert
create policy "Public read requirements"
  on requirements for select
  using (true);

create policy "Anyone insert requirement"
  on requirements for insert
  with check (true);

create policy "Owner update requirement"
  on requirements for update
  using (auth.uid() = owner_id);

-- proposals: public read and insert/update
create policy "Public read proposals"
  on proposals for select
  using (true);

create policy "Anyone insert proposal"
  on proposals for insert
  with check (true);

create policy "Anyone update proposal"
  on proposals for update
  using (true);

-- Create delete policies to fix Admin Panel deletion
create policy "Anyone delete user_profiles"
  on user_profiles for delete
  using (true);

create policy "Anyone delete professionals"
  on professionals for delete
  using (true);

create policy "Anyone delete requirements"
  on requirements for delete
  using (true);

create policy "Anyone delete proposals"
  on proposals for delete
  using (true);

-- 5. Active Projects (Progress Tracker)
create table if not exists active_projects (
  id text primary key,
  name text not null,
  client_name text,
  location text,
  overall_progress numeric default 0,
  lead_architect text,
  lead_engineer text,
  interior_designer text,
  material_supplier text,
  estimated_completion text,
  total_budget numeric,
  amount_paid numeric default 0,
  milestones jsonb default '[]'::jsonb,
  site_photos jsonb default '[]'::jsonb,
  client_id uuid,
  professional_id text,
  created_at timestamptz default now()
);

alter table active_projects enable row level security;
create policy "Public read active_projects" on active_projects for select using (true);
create policy "Anyone insert active_projects" on active_projects for insert with check (true);
create policy "Anyone update active_projects" on active_projects for update using (true);
create policy "Anyone delete active_projects" on active_projects for delete using (true);

-- 6. Ratings & Reviews System
create table if not exists reviews (
  id text primary key,
  professional_id text references professionals(id) on delete cascade,
  client_name text not null,
  rating numeric check (rating >= 1 and rating <= 5),
  comment text,
  project_title text,
  created_at timestamptz default now()
);

alter table reviews enable row level security;
create policy "Public read reviews" on reviews for select using (true);
create policy "Anyone insert reviews" on reviews for insert with check (true);
create policy "Anyone update reviews" on reviews for update using (true);
create policy "Anyone delete reviews" on reviews for delete using (true);


