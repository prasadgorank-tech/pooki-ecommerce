-- Create coupons table
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL,
  min_spend NUMERIC DEFAULT 0,
  max_discount NUMERIC,
  is_active BOOLEAN DEFAULT true,
  expiry_date TIMESTAMPTZ,
  usage_limit INTEGER DEFAULT NULL,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-only for active coupons"
  ON public.coupons FOR SELECT
  USING (is_active = true AND (expiry_date IS NULL OR expiry_date > now()));

CREATE POLICY "Allow admin full access to coupons"
  ON public.coupons FOR ALL
  USING (true);
