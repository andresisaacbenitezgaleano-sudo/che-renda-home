
-- 1) Profiles: auditoría legal
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS terminos_aceptados boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS fecha_aceptacion timestamptz,
  ADD COLUMN IF NOT EXISTS version_terminos text NOT NULL DEFAULT '1.0';

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_accept boolean := COALESCE((NEW.raw_user_meta_data->>'accepted_terms')::boolean, false)
                  AND COALESCE((NEW.raw_user_meta_data->>'accepted_privacy')::boolean, false);
BEGIN
  INSERT INTO public.profiles (
    id, email, full_name,
    accepted_privacy, accepted_terms, accepted_at,
    terminos_aceptados, fecha_aceptacion, version_terminos
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'accepted_privacy')::boolean, false),
    COALESCE((NEW.raw_user_meta_data->>'accepted_terms')::boolean, false),
    CASE WHEN v_accept THEN now() ELSE NULL END,
    v_accept,
    CASE WHEN v_accept THEN now() ELSE NULL END,
    COALESCE(NEW.raw_user_meta_data->>'version_terminos', '1.0')
  );
  RETURN NEW;
END;
$function$;

-- 2) Bookings: cambiar default a pending_payment (ahora sí, el enum ya está commiteado)
ALTER TABLE public.bookings
  ALTER COLUMN status SET DEFAULT 'pending_payment'::booking_status;

-- 3) Código legible
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS reserva_codigo text UNIQUE;

CREATE OR REPLACE FUNCTION public.gen_reserva_codigo()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
DECLARE
  v_year text;
  v_short text;
BEGIN
  IF NEW.reserva_codigo IS NULL OR NEW.reserva_codigo = '' THEN
    v_year := to_char(COALESCE(NEW.created_at, now()), 'YYYY');
    v_short := upper(substring(replace(NEW.id::text, '-', '') FROM 1 FOR 6));
    NEW.reserva_codigo := '#CR-' || v_year || '-' || v_short;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_bookings_reserva_codigo ON public.bookings;
CREATE TRIGGER trg_bookings_reserva_codigo
BEFORE INSERT ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.gen_reserva_codigo();

UPDATE public.bookings
SET reserva_codigo = '#CR-' || to_char(created_at, 'YYYY') || '-' || upper(substring(replace(id::text, '-', '') FROM 1 FOR 6))
WHERE reserva_codigo IS NULL;
