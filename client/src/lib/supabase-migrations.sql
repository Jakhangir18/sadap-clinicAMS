-- Create profiles table for storing user information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create policy: users can only view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Create policy: users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create policy: users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at_trigger
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_profiles_updated_at();

-- =============================
-- Super Admin & Doctors schema
-- =============================

-- Ensure pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add role column to profiles for simple role management
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'
  CHECK (role IN ('user','admin'));

-- Helper function to check admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  );
$$;

-- Drop trigger from profiles if exists (to avoid conflicts when re-running)
DROP TRIGGER IF EXISTS update_profiles_updated_at_trigger ON profiles;

-- Doctors table
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  specialization_title TEXT NOT NULL,
  short_description TEXT,
  rating INT NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  experience_years INT NOT NULL DEFAULT 0,
  education_text TEXT,
  working_hours_text TEXT,
  directions JSONB NOT NULL DEFAULT '[]'::jsonb,
  disease_tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  avatar_url TEXT,
  certificates JSONB NOT NULL DEFAULT '[]'::jsonb, -- array of image URLs
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to keep updated_at fresh
CREATE OR REPLACE FUNCTION public.update_doctors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_doctors_updated_at_trigger ON public.doctors;
CREATE TRIGGER update_doctors_updated_at_trigger
BEFORE UPDATE ON public.doctors
FOR EACH ROW
EXECUTE FUNCTION public.update_doctors_updated_at();

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_doctors_is_published ON public.doctors (is_published);
CREATE INDEX IF NOT EXISTS idx_doctors_sort_order_name ON public.doctors (sort_order, full_name);
CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON public.doctors (specialization_title);

-- Enable RLS
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "public read published doctors" ON public.doctors;
DROP POLICY IF EXISTS "admin select doctors" ON public.doctors;
DROP POLICY IF EXISTS "admin insert doctors" ON public.doctors;
DROP POLICY IF EXISTS "admin update doctors" ON public.doctors;
DROP POLICY IF EXISTS "admin delete doctors" ON public.doctors;

-- Public can read only published doctors
CREATE POLICY "public read published doctors"
  ON public.doctors
  FOR SELECT
  USING (is_published = TRUE);

-- Admin full access on doctors
CREATE POLICY "admin select doctors"
  ON public.doctors
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "admin insert doctors"
  ON public.doctors
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "admin update doctors"
  ON public.doctors
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admin delete doctors"
  ON public.doctors
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Storage buckets for avatars and certificates (public read)
SELECT storage.create_bucket('avatars', public := TRUE);
SELECT storage.create_bucket('certificates', public := TRUE);

-- Storage policies: admin can write, public can read because bucket is public
-- Avatars
CREATE POLICY "admin write avatars"
  ON storage.objects
  FOR INSERT
  TO authenticated
  USING (public.is_admin() AND bucket_id = 'avatars')
  WITH CHECK (public.is_admin() AND bucket_id = 'avatars');

CREATE POLICY "admin update avatars"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (public.is_admin() AND bucket_id = 'avatars')
  WITH CHECK (public.is_admin() AND bucket_id = 'avatars');

CREATE POLICY "admin delete avatars"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (public.is_admin() AND bucket_id = 'avatars');

-- Certificates
CREATE POLICY "admin write certificates"
  ON storage.objects
  FOR INSERT
  TO authenticated
  USING (public.is_admin() AND bucket_id = 'certificates')
  WITH CHECK (public.is_admin() AND bucket_id = 'certificates');

CREATE POLICY "admin update certificates"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (public.is_admin() AND bucket_id = 'certificates')
  WITH CHECK (public.is_admin() AND bucket_id = 'certificates');

CREATE POLICY "admin delete certificates"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (public.is_admin() AND bucket_id = 'certificates');
