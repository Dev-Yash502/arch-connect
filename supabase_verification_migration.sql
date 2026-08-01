-- ============================================================
-- SQL Migration: Add Document Verification Columns
-- Run this script in your Supabase SQL Editor to support
-- database-driven document verification states.
-- ============================================================

ALTER TABLE public.professionals 
ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS aadhaar_number text,
ADD COLUMN IF NOT EXISTS aadhaar_file_name text,
ADD COLUMN IF NOT EXISTS aadhaar_file_url text,
ADD COLUMN IF NOT EXISTS pan_number text,
ADD COLUMN IF NOT EXISTS pan_file_name text,
ADD COLUMN IF NOT EXISTS pan_file_url text,
ADD COLUMN IF NOT EXISTS license_type text,
ADD COLUMN IF NOT EXISTS license_id text,
ADD COLUMN IF NOT EXISTS license_file_name text,
ADD COLUMN IF NOT EXISTS license_file_url text;
