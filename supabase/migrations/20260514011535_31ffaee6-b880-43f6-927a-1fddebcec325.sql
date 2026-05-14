-- Expand price_modality enum by swapping column to text and rebuilding the type
ALTER TABLE public.properties ALTER COLUMN price_modality DROP DEFAULT;
ALTER TABLE public.properties ALTER COLUMN price_modality TYPE text USING price_modality::text;
DROP TYPE public.price_modality;
CREATE TYPE public.price_modality AS ENUM (
  'per_hour',
  'per_night',
  'per_week',
  'per_month',
  'annual',
  'full_weekend'
);
ALTER TABLE public.properties
  ALTER COLUMN price_modality TYPE public.price_modality
  USING price_modality::public.price_modality;
ALTER TABLE public.properties
  ALTER COLUMN price_modality SET DEFAULT 'per_night'::public.price_modality;

-- Storage bucket for property images
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read
CREATE POLICY "Property images are publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

-- Authenticated users can upload to their own folder (first path segment = user id)
CREATE POLICY "Users upload own property images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'property-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users update own property images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'property-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users delete own property images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'property-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);