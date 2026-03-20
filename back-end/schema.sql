-- Database schema for wedding invitation SaaS (single customer per invitation)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Customers (end users)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  domain TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Admin users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS customer_refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  price_amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'IDR',
  features JSONB NOT NULL DEFAULT '{}'::jsonb,
  limits JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id),
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'IDR',
  proof_of_payment TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Invitation (1 customer = 1 invitation)
CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT,
  search_name TEXT,
  event_date DATE,
  theme_key TEXT NOT NULL DEFAULT 'elegant',
  is_published BOOLEAN NOT NULL DEFAULT false,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (customer_id, slug)
);

CREATE TABLE IF NOT EXISTS rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  attendance TEXT NOT NULL DEFAULT 'attending',
  guests_count INTEGER NOT NULL DEFAULT 1,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invitations_customer_slug ON invitations(customer_id, slug);
CREATE INDEX IF NOT EXISTS idx_invitations_customer_event_date ON invitations(customer_id, event_date);
CREATE INDEX IF NOT EXISTS idx_invitations_customer_search_name ON invitations(customer_id, search_name);
CREATE INDEX IF NOT EXISTS idx_rsvps_invitation_id ON rsvps(invitation_id);
CREATE INDEX IF NOT EXISTS idx_wishes_invitation_id ON wishes(invitation_id);

-- Seed default plans (idempotent)
INSERT INTO plans (code, name, price_amount, currency, features, limits) VALUES
  ('basic', 'Basic', 49000, 'IDR',
   '[{"label":"1 template undangan","included":true},{"label":"Countdown timer","included":true},{"label":"RSVP tamu","included":true},{"label":"Galeri foto (maks. 4)","included":true},{"label":"Musik latar","included":false},{"label":"Love story","included":false},{"label":"Fitur hadiah","included":false},{"label":"Custom domain","included":false}]'::jsonb,
   '{"gallery_photos": 4, "templates": "1"}'::jsonb),
  ('premium', 'Premium', 99000, 'IDR',
   '[{"label":"Semua template undangan","included":true},{"label":"Countdown timer","included":true},{"label":"RSVP tamu","included":true},{"label":"Galeri foto (maks. 8)","included":true},{"label":"Musik latar","included":true},{"label":"Love story","included":true},{"label":"Fitur hadiah","included":true},{"label":"Custom domain","included":false}]'::jsonb,
   '{"gallery_photos": 8, "templates": "all"}'::jsonb),
  ('exclusive', 'Exclusive', 150000, 'IDR',
   '[{"label":"Semua template undangan","included":true},{"label":"Countdown timer","included":true},{"label":"RSVP tamu","included":true},{"label":"Galeri foto (maks. 12)","included":true},{"label":"Musik latar","included":true},{"label":"Love story","included":true},{"label":"Fitur hadiah","included":true},{"label":"Custom domain","included":true}]'::jsonb,
   '{"gallery_photos": 12, "templates": "all"}'::jsonb)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  price_amount = EXCLUDED.price_amount,
  currency = EXCLUDED.currency,
  features = EXCLUDED.features,
  limits = EXCLUDED.limits;
