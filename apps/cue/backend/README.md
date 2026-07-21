# Backend — Cahyana Ubud Experience

API kecil buat nyimpen **booking** ke PostgreSQL. Stack: Node.js + Express + `pg`.

Frontend static (di Hostinger) manggil API ini lewat `fetch`. Backend + database
jalan di **Railway**.

```
Frontend (Hostinger)  ──fetch──►  API ini (Railway)  ──►  PostgreSQL (Railway)
```

## Isi folder
| File | Fungsi |
|---|---|
| `server.js` | App Express + endpoint `POST /api/bookings` & `GET /health` |
| `db.js` | Koneksi PostgreSQL (`pg` Pool) |
| `schema.sql` | Bikin tabel `bookings` (jalanin sekali) |
| `package.json` | Daftar dependency + script `start` |
| `.env.example` | Contoh environment variables |

---

## Langkah setup di Railway (yang Wayan lakuin)

### 1. Bikin project
1. Daftar/login di [railway.app](https://railway.app) (bisa pakai akun GitHub).
2. **New Project** → **Deploy from GitHub repo** → pilih repo `CUE`.
3. Di Settings service → **Root Directory** → isi `backend`.
   (Biar Railway cuma jalanin folder ini, bukan site static-nya.)

### 2. Tambah database PostgreSQL
1. Di project yang sama: **New** → **Database** → **Add PostgreSQL**.
2. Railway otomatis bikin variable `DATABASE_URL`. Service API bakal kebaca sendiri
   (satu project sharing variables). Kalau nggak kebaca, di service API tab
   **Variables** → **Add Reference** → pilih `DATABASE_URL` dari Postgres.

### 3. Bikin tabel
1. Klik service **Postgres** → tab **Data** / **Query**.
2. Paste seluruh isi `schema.sql` → **Run**. Tabel `bookings` jadi.

### 4. Set environment variable
Di service **API** → tab **Variables** → tambah:
- `ALLOWED_ORIGIN` = `https://cahyanaubudexperience.com`

(`DATABASE_URL` udah otomatis, `PORT` di-set Railway sendiri.)

### 5. Deploy & cek
1. Railway auto-deploy tiap push ke GitHub.
2. Di Settings service → **Networking** → **Generate Domain** → dapet URL publik,
   misal `https://cue-backend-production.up.railway.app`.
3. Tes health check: buka `https://<url>/health` di browser → harus muncul
   `{"ok":true}`.
4. Tes simpan booking (dari terminal / HP pakai app REST):
   ```bash
   curl -X POST https://<url>/api/bookings \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","phone":"+6281","email":"t@e.com","service":"Ubud Tour","date":"2026-08-01","guests":"2","price":"USD 45"}'
   ```
   Harus balik `{"ok":true,"id":1}`. Cek di Postgres > Data, row-nya masuk.

### 6. Kasih URL ke Claude
Copy URL publik tadi → nanti dipakai buat nyambungin form booking di frontend
(ganti `SHEET_ENDPOINT` yang lama).

---

## Jalanin lokal (opsional, buat ngoprek)
```bash
cd backend
npm install
cp .env.example .env      # isi DATABASE_URL dari Railway
npm start                 # API jalan di http://localhost:3000
```

## Endpoint
| Method | Path | Fungsi |
|---|---|---|
| `GET` | `/health` | Cek service hidup → `{ ok: true }` |
| `POST` | `/api/bookings` | Simpan booking. Body JSON: `name, phone, email, service` (wajib) + `pickup, referral, guests, date, price, currency` (opsional) |
