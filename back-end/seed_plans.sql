INSERT INTO plans (code, name, price_amount, currency, features, limits) VALUES
  ('basic', 'Basic', 49000, 'IDR',
   '[
     {"label": "RSVP online untuk konfirmasi tamu", "included": true},
     {"label": "Countdown acara otomatis", "included": true},
     {"label": "1 pilihan template undangan", "included": true},
     {"label": "Galeri foto hingga 4 foto", "included": true},
     {"label": "Amplop digital (hadiah cashless)", "included": false},
     {"label": "Background musik undangan", "included": false},
     {"label": "Timeline cerita cinta (Love Story)", "included": false}
   ]'::jsonb,
   '{"gallery_photos": 4, "love_story": false, "music": false, "gifts": false, "templates": "1"}'::jsonb),

  ('premium', 'Premium', 99000, 'IDR',
   '[
     {"label": "RSVP online untuk konfirmasi tamu", "included": true},
     {"label": "Countdown acara otomatis", "included": true},
     {"label": "Semua template undangan tersedia", "included": true},
     {"label": "Galeri foto hingga 8 foto", "included": true},
     {"label": "Amplop digital (hadiah cashless)", "included": true},
     {"label": "Background musik undangan", "included": true},
     {"label": "Timeline cerita cinta (Love Story)", "included": true}
   ]'::jsonb,
   '{"gallery_photos": 8, "love_story": true, "music": true, "gifts": true, "templates": "all"}'::jsonb),

  ('exclusive', 'Exclusive', 150000, 'IDR',
   '[
     {"label": "RSVP online untuk konfirmasi tamu", "included": true},
     {"label": "Countdown acara otomatis", "included": true},
     {"label": "Semua template undangan tersedia", "included": true},
     {"label": "Galeri foto hingga 12 foto", "included": true},
     {"label": "Amplop digital (hadiah cashless)", "included": true},
     {"label": "Background musik undangan", "included": true},
     {"label": "Timeline cerita cinta (Love Story)", "included": true},
     {"label": "Reminder tamu otomatis", "included": true}
   ]'::jsonb,
   '{"gallery_photos": 12, "love_story": true, "music": true, "gifts": true, "templates": "all"}'::jsonb)

ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  price_amount = EXCLUDED.price_amount,
  currency = EXCLUDED.currency,
  features = EXCLUDED.features,
  limits = EXCLUDED.limits;
