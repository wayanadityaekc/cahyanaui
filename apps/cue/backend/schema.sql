-- Skema tabel booking.
-- Jalanin SEKALI di Railway: buka service Postgres > tab "Query" > paste ini > Run.

CREATE TABLE IF NOT EXISTS bookings (
  id          SERIAL PRIMARY KEY,
  name        TEXT        NOT NULL,
  phone       TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  pickup      TEXT,
  referral    TEXT,
  guests      TEXT,
  service     TEXT        NOT NULL,
  date        DATE,
  price_text  TEXT,
  currency    TEXT,
  status      TEXT        NOT NULL DEFAULT 'new',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index biar sortir booking terbaru cepat (kepakai nanti di halaman admin).
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings (created_at DESC);
