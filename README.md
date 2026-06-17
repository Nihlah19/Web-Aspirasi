Lapor Wong Cerbon

Platform pelaporan dan aspirasi warga Cirebon berbasis web, dengan analisis tingkat urgensi laporan menggunakan kecerdasan buatan (AI) Gemini. Dibangun menggunakan **TanStack Start**, **React 19**, **Tailwind CSS v4**, dan **Supabase**.

## Deskripsi Singkat

**Lapor Wong Cerbon** adalah kanal digital bagi warga Cirebon untuk menyampaikan laporan, pengaduan, atau aspirasi seputar kehidupan kota. Setiap laporan akan dianalisis oleh AI untuk menentukan tingkat urgensi sehingga pihak terkait dapat memprioritaskan penanganan dengan lebih cepat dan tepat.

## Fitur Utama

- **Buat Laporan** — formulir laporan dengan kategori, lokasi, dan lampiran.
- **Analisis Urgensi AI** — AI Gemini memberikan skor urgensi (1–10), level, alasan, dan rekomendasi tindak lanjut.
- **Daftar Laporan** — lihat semua laporan yang masuk beserta statusnya.
- **Detail Laporan** — pantau perkembangan laporan dan diskusi terkait.
- **Anggaran & Leaderboard** — transparansi anggaran dan partisipasi warga.
- **Autentikasi** — login/registrasi menggunakan Supabase Auth.
- **Panel Admin** — kelola laporan dan pengguna untuk operator terkait.

## Teknologi

- **Framework:** TanStack Start v1 (React 19 + Vite 8)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Backend/Database:** Supabase (PostgreSQL + Auth + Realtime)
- **AI:** Google Gemini 2.0 Flash via API
- **Bahasa:** TypeScript

## Menjalankan di Lokal (VS Code / Terminal)

Pastikan kamu sudah menginstal [Node.js](https://nodejs.org/) (disarankan versi LTS) dan **npm**.

1. **Clone / export proyek** ke folder lokal:

   ```bash
   cd lapor-wong-cerbon
   ```

2. **Install dependensi** dengan npm:

   ```bash
   npm install
   ```

3. **Salin file environment** dan isi dengan kredensial milikmu:

   ```bash
   cp .env.example .env
   ```

4. **Isi variabel di `.env`:**

   ```env
   VITE_SUPABASE_URL=...........
   VITE_SUPABASE_PUBLISHABLE_KEY=...........
   SUPABASE_URL=.....................
   SUPABASE_PUBLISHABLE_KEY=.....
   GEMINI_API_KEY=.....
   ```

5. **Jalankan server pengembangan:**

   ```bash
   npm run dev
   ```

6. **Buka browser** di alamat:
   ```
   http://localhost:3000
   ```

## Perintah yang Sering Digunakan

| Perintah          | Fungsi                          |
| ----------------- | ------------------------------- |
| `npm run dev`     | Menjalankan server pengembangan |
| `npm run build`   | Build untuk production          |
| `npm run preview` | Preview build production        |
| `npm run lint`    | Pemeriksaan kode dengan ESLint  |
| `npm run format`  | Format kode dengan Prettier     |

## Cara Mengedit Database Supabase

1. Buka dashboard Supabase:
2. Masuk dengan akun Supabase-mu.
3. Gunakan menu **Table Editor** untuk membuat/mengubah tabel.
4. Gunakan **SQL Editor** untuk menjalankan query, membuat kebijakan **Row Level Security (RLS)**, dan migrasi.
5. Pastikan setiap tabel baru di schema `public` memiliki `GRANT` ke role `authenticated` (dan `service_role` jika diakses dari server) agar bisa dijangkau oleh aplikasi.

Contoh tabel dasar yang biasanya dibutuhkan:

- `profiles` — data profil pengguna
- `reports` — data laporan warga
- `user_roles` — peran pengguna (admin, moderator, user)

## Cara Mengedit AI / Gemini

File utama integrasi AI berada di:

```
src/lib/ai.functions.ts
```

Fungsi `analisisUrgensi` menerima teks laporan dan mengirimkannya ke API Google Gemini, lalu mengembalikan skor urgensi (1–10), level, alasan, dan rekomendasi. API key dibaca dari variabel lingkungan `GEMINI_API_KEY` yang **hanya berada di server** (tidak diekspos ke browser).

Jika ingin mengganti model atau menyesuaikan prompt, edit bagian `model` dan `contents` di dalam `src/lib/ai.functions.ts`. Jangan lupa untuk mengatur ulang (rotate) API key di Google AI Studio jika key sudah pernah terlihat orang lain.

## Menambahkan Ikon Wong Cerbon

Ikon aplikasi berada di `public/favicon.svg`. Ikon tersebut menggunakan siluet batik Mega Mendung yang merupakan salah satu motif khas Cirebon. Jika ingin mengganti, cukup edit file SVG tersebut dengan editor vektor atau teks.

## Catatan Keamanan

- **Jangan** menyimpan `GEMINI_API_KEY` atau kunci pribadi lainnya di dalam kode client-side.
- Gunakan `.env` untuk menyimpan rahasia dan pastikan file `.env` tidak ikut ter-commit (sudah ada di `.gitignore`).
- Selalu aktifkan **Row Level Security (RLS)** di tabel Supabase untuk melindungi data pengguna.
- Periksa role pengguna melalui tabel `user_roles`, bukan dari localStorage atau nilai yang dikirim client.

## Lisensi

Proyek ini dibuat untuk keperluan komunitas warga Cirebon. Silakan berkontribusi dan laporkan masalah melalui issues.

---

**Project PPKN team pengembang 3 STMIK IKMI CIREBON.**
