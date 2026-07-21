// API Cahyana Ubud Experience
// Milestone 1: terima booking dari form frontend, simpan ke PostgreSQL.
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { pool } = require("./db");

const app = express();

/* ==================== MIDDLEWARE ==================== */

// Cuma izinin domain frontend (Hostinger) yang boleh manggil API ini.
// Set ALLOWED_ORIGIN di Railway Variables. Default "*" = semua (buat tes doang).
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";
app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json());

/* ==================== ROUTES ==================== */

// Health check: buat mastiin service hidup (buka URL/health di browser).
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// POST /api/bookings: terima 1 booking dari form, simpan ke DB.
app.post("/api/bookings", async (req, res) => {
  const b = req.body || {};

  // Field wajib
  if (!b.name || !b.phone || !b.email || !b.service) {
    return res.status(400).json({
      ok: false,
      error: "name, phone, email, dan service wajib diisi.",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO bookings
         (name, phone, email, pickup, referral, guests, service, date, price_text, currency)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [
        b.name,
        b.phone,
        b.email,
        b.pickup || null,
        b.referral || null,
        b.guests || null,
        b.service,
        b.date || null,
        b.price || null,
        b.currency || null,
      ]
    );
    res.json({ ok: true, id: result.rows[0].id });
  } catch (err) {
    console.error("Gagal simpan booking:", err);
    res.status(500).json({ ok: false, error: "Server error. Coba lagi." });
  }
});

/* ==================== START ==================== */

// Railway set PORT otomatis. Lokal default 3000.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API jalan di port ${PORT}`);
});
