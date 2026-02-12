
-- =============================================
-- 1. Extend home_profiles with new columns
-- =============================================

-- Change existing boolean defaults from true to NULL (null = unknown)
ALTER TABLE public.home_profiles
  ALTER COLUMN has_basement SET DEFAULT null,
  ALTER COLUMN has_ceiling_fans SET DEFAULT null,
  ALTER COLUMN has_central_ac SET DEFAULT null,
  ALTER COLUMN has_deck SET DEFAULT null,
  ALTER COLUMN has_fireplace SET DEFAULT null,
  ALTER COLUMN has_furnace_humidifier SET DEFAULT null,
  ALTER COLUMN has_garage SET DEFAULT null,
  ALTER COLUMN has_gas SET DEFAULT null,
  ALTER COLUMN has_hoa SET DEFAULT null,
  ALTER COLUMN has_lawn SET DEFAULT null,
  ALTER COLUMN has_septic SET DEFAULT null,
  ALTER COLUMN has_sprinkler_system SET DEFAULT null;

-- Core property data (API-filled)
ALTER TABLE public.home_profiles
  ADD COLUMN IF NOT EXISTS address_line text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS zip text,
  ADD COLUMN IF NOT EXISTS year_built integer,
  ADD COLUMN IF NOT EXISTS square_footage integer,
  ADD COLUMN IF NOT EXISTS lot_size integer,
  ADD COLUMN IF NOT EXISTS bedrooms integer,
  ADD COLUMN IF NOT EXISTS bathrooms numeric(3,1),
  ADD COLUMN IF NOT EXISTS property_type text,
  ADD COLUMN IF NOT EXISTS last_sale_date date,
  ADD COLUMN IF NOT EXISTS last_sale_price integer,
  ADD COLUMN IF NOT EXISTS climate_zone text;

-- New boolean features
ALTER TABLE public.home_profiles
  ADD COLUMN IF NOT EXISTS has_pool boolean DEFAULT null,
  ADD COLUMN IF NOT EXISTS has_sump_pump boolean DEFAULT null;

-- System details (user-entered, enriched over time)
ALTER TABLE public.home_profiles
  ADD COLUMN IF NOT EXISTS heating_type text,
  ADD COLUMN IF NOT EXISTS cooling_type text,
  ADD COLUMN IF NOT EXISTS water_heater_type text,
  ADD COLUMN IF NOT EXISTS water_heater_age integer,
  ADD COLUMN IF NOT EXISTS roof_type text,
  ADD COLUMN IF NOT EXISTS roof_age integer,
  ADD COLUMN IF NOT EXISTS foundation_type text,
  ADD COLUMN IF NOT EXISTS exterior_type text,
  ADD COLUMN IF NOT EXISTS electrical_panel_amps integer;

-- Metadata / enrichment tracking
ALTER TABLE public.home_profiles
  ADD COLUMN IF NOT EXISTS data_source text,
  ADD COLUMN IF NOT EXISTS enrichment_raw jsonb,
  ADD COLUMN IF NOT EXISTS enriched_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS last_updated_by text;

-- =============================================
-- 2. Create home_documents table
-- =============================================
CREATE TABLE public.home_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  home_id uuid NOT NULL REFERENCES public.home_profiles(id) ON DELETE CASCADE,
  category text NOT NULL,
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  file_type text NOT NULL,
  file_size integer,
  appliance_name text,
  expiration_date date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.home_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Full access home_documents"
  ON public.home_documents
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Timestamp trigger
CREATE TRIGGER update_home_documents_updated_at
  BEFORE UPDATE ON public.home_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 3. Create storage bucket for home documents
-- =============================================
INSERT INTO storage.buckets (id, name, public)
  VALUES ('home-documents', 'home-documents', false)
  ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can upload home documents"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'home-documents');

CREATE POLICY "Anyone can view home documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'home-documents');

CREATE POLICY "Anyone can delete home documents"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'home-documents');
