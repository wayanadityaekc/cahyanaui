// Koneksi ke PostgreSQL pakai library `pg`.
// DATABASE_URL disediakan OTOMATIS oleh Railway (tab Variables > DATABASE_URL).
const { Pool } = require("pg");

const url = process.env.DATABASE_URL || "";

const pool = new Pool({
  connectionString: url,
  // Railway wajib SSL. Kalau koneksi lokal (localhost) -> matiin SSL.
  ssl: url.includes("localhost") || url.includes("127.0.0.1")
    ? false
    : { rejectUnauthorized: false },
});

module.exports = { pool };
