
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS contact_phone text,
  ADD COLUMN IF NOT EXISTS check_in_time text,
  ADD COLUMN IF NOT EXISTS check_out_time text;

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS contact_phone text;
