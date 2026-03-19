-- Create a private table to support backend abuse throttling
CREATE TABLE IF NOT EXISTS public.rate_limit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  identifier TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.rate_limit_events ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_rate_limit_events_action_identifier_created_at
ON public.rate_limit_events (action, identifier, created_at DESC);

DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contact_submissions;

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_tracking_number_unique
ON public.orders (tracking_number)
WHERE tracking_number IS NOT NULL;