INSERT INTO plans (code, name, price_amount, currency, features, limits) VALUES
  ('basic', 'Basic', 150000, 'IDR',
   '{"templates": 1, "rsvp": true, "countdown": true}'::jsonb,
   '{"gallery_photos": 4, "love_story": false, "music": false, "gifts": false, "custom_domain": false}'::jsonb),
  ('premium', 'Premium', 350000, 'IDR',
   '{"templates": "all", "rsvp": true, "countdown": true}'::jsonb,
   '{"gallery_photos": 8, "love_story": true, "music": true, "gifts": true, "custom_domain": false}'::jsonb),
  ('exclusive', 'Exclusive', 750000, 'IDR',
   '{"templates": "all", "rsvp": true, "countdown": true, "reminder": true}'::jsonb,
   '{"gallery_photos": 12, "love_story": true, "music": true, "gifts": true, "custom_domain": true}'::jsonb)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  price_amount = EXCLUDED.price_amount,
  currency = EXCLUDED.currency,
  features = EXCLUDED.features,
  limits = EXCLUDED.limits;
