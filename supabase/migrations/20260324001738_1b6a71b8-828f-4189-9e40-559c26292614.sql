
CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  confirmation_code TEXT NOT NULL DEFAULT upper(substr(md5(random()::text), 1, 8)),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_count INTEGER NOT NULL DEFAULT 2,
  reservation_time TEXT NOT NULL,
  table_type TEXT NOT NULL DEFAULT 'Standard',
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create reservations"
  ON public.reservations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read reservations"
  ON public.reservations FOR SELECT
  TO anon, authenticated
  USING (true);
