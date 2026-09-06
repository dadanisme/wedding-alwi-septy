# Undangan Pernikahan Digital — Alwi & Septy

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Bun](https://img.shields.io/badge/Runtime-Bun_v1.3-fbf0df?logo=bun)](https://bun.sh/)
[![Firebase](https://img.shields.io/badge/Backend-Firebase_Admin-ffca28?logo=firebase)](https://firebase.google.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://wedding-alwi.vercel.app)

Website undangan pernikahan digital personal dan eksklusif untuk pernikahan **Mochamad Ilham Alwi Rifa, S.T. & Septyara Khotimaharani, S.Pd.** (150 undangan / kapasitas 250 orang) yang diselenggarakan pada hari **Sabtu, 10 Oktober 2026** di Steikhaus (Area Pabrik Bajoe), Bandung.

- **Production Live URL:** [https://wedding-alwi.vercel.app](https://wedding-alwi.vercel.app)
- **Repository:** [https://github.com/dadanisme/wedding-alwi-septy](https://github.com/dadanisme/wedding-alwi-septy)

---

## 🌟 Fitur Utama

### 1. Undangan Tamu Personal & Privat
- **URL Tanpa Query String**: Format `/{nama-slug}-{token-acak}` (contoh: `/budi-santoso-a7f3k9m2`) yang aman dan elegan di WhatsApp preview.
- **Layar Sampul Wajib**: Menyaring bot WhatsApp preview (`autoVisitCount`), meminta interaksi pengguna sebelum audio diputar otomatis, dan mencatat waktu pertama buka (*first opened*).
- **Deteksi Perangkat Ganda**: Melacak frekuensi buka dan identifikasi perangkat unik (`uniqueDevices > 1`) untuk mendeteksi link yang diteruskan ke pihak lain.

### 2. Pengalaman Visual & Audio Sinematik
- **Animasi Terakselerasi GPU**: Transisi halus *scroll reveal* (fade-up, zoom-in, blur-in), floating monogram, dan Ken Burns prewedding.
- **Parallax Scroll Seksi Pembuka**: Kedalaman visual bertingkat foto adat Sunda di balik bingkai ganda *wave divider* atas-bawah.
- **Partikel Ambien Adat Sunda**: Kelopak bunga melati dan debu emas (*stardust*) mengambang sinusoidal dengan dukungan penuh `@media (prefers-reduced-motion: reduce)`.
- **Pemutar Musik Latar**: Animasi piringan hitam emas berputar dengan bilah gelombang audio dinamis (*soundwave equalizer*).
- **Styleguide & Token Desain**: Tersedia di route internal [`/styleguide`](https://wedding-alwi.vercel.app/styleguide).

### 3. Interaksi Tamu
- **RSVP Adaptif**: Konfirmasi kehadiran (Hadir/Tidak Hadir), opsi membawa pendamping (+1), nama pendamping, serta catatan kebutuhan/ucapan.
- **Buku Tamu Real-time**: Kirim ucapan selamat dan doa restu yang langsung terhubung ke Firestore.
- **Hadiah Pernikahan**: Tampilan nomor rekening statis Blu (BCA Digital) a.n. Septyara Khotimaharani dengan fitur salin nomor rekening satu-klik dan feedback centang animasi.
- **Kalender & Peta**: Tombol simpan agenda ke Google Calendar/iCal dan tautan navigasi Google Maps.

### 4. Admin Panel & Kendali Kapasitas
- **Autentikasi Server-Side**: Login aman via Firebase Auth REST API + Firebase Admin SDK session cookie 5 hari di HTTP-only cookie `__session` ([`/admin/login`](https://wedding-alwi.vercel.app/admin/login)).
- **Instrumen Kendali Kapasitas 250**: Menghitung proyeksi headcount langsung (`Hadir + Pendamping + 50 Keluarga Inti/Panitia`) dengan visualisasi warna dinamis (Hijau, Amber, Merah Rose).
- **Manajemen Tamu Lengkap (CRUD)**: Tambah tamu satuan, ubah data, hapus dengan proteksi konfirmasi, pencarian instan, dan filter status respons.
- **Generator Tautan & Pesan WhatsApp**: Template undangan resmi dan template pengingat (*reminder*) santun batas anjuran 26 September 2026.
- **Impor & Ekspor CSV**:
  - Impor massal 150 tamu dengan pemisah otomatis koma/titik koma dan validasi format sebelum simpan ke Firestore.
  - Ekspor CSV berformat UTF-8 BOM untuk koordinasi katering dan tata letak kursi di Microsoft Excel.
- **Moderasi Buku Tamu**: Sembunyikan atau tampilkan kembali ucapan tamu secara instan.
- **Pembaruan Data Instan**: Tombol *Refresh Data* 1-baris sejajar dengan Server Action live paralel.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16 (App Router + Turbopack)](https://nextjs.org/)
- **Library UI:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Runtime & Package Manager:** [Bun](https://bun.sh/)
- **Database & Auth:** [Firebase Firestore](https://firebase.google.com/docs/firestore) & [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) (Server-side data access layer murni)
- **Deployment & Hosting:** [Vercel](https://vercel.com/)

---

## 🚀 Menjalankan Proyek Secara Lokal

### Prasyarat
- [Bun](https://bun.sh/) (versi 1.1 ke atas)
- Proyek Firebase dengan Firestore dan Firebase Authentication diaktifkan

### 1. Kloning Repository
```bash
git clone https://github.com/dadanisme/wedding-alwi-septy.git
cd wedding-alwi-septy
```

### 2. Instalasi Dependensi
```bash
bun install
```

### 3. Konfigurasi Environment Variables
Salin berkas `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```

Isi variabel environment dengan kredensial Firebase Service Account Anda:
```env
# Firebase Admin SDK Credentials (Server-side only)
FIREBASE_PROJECT_ID="wedding-alwi"
FIREBASE_CLIENT_EMAIL="your-service-account-email@wedding-alwi.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Firebase Web API Key for Admin Auth (Server-side REST API verification)
FIREBASE_WEB_API_KEY="AIzaSy..."
```

### 4. Jalankan Development Server
```bash
bun dev
```

Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

### 5. Build dan Test
```bash
# Uji coba build produksi
bun run build

# Menjalankan linter
bun run lint
```

---

## 📁 Struktur Direktori

```
wedding-alwi/
├── app/
│   ├── actions/          # Next.js Server Actions (auth, guests, moderation, rsvp)
│   ├── admin/            # Halaman Admin Panel & Login
│   ├── [guestSlug]/      # Halaman Undangan Publik per Tamu Privat
│   ├── styleguide/       # Panduan Gaya & Token Desain Visual
│   ├── layout.tsx        # Root layout & konfigurasi font
│   └── page.tsx          # Halaman fallback umum
├── components/
│   ├── admin/            # Komponen Admin (Dashboard, Table, Modal, Icons)
│   ├── sections/         # Seksi Undangan (Cover, Pembuka, Mempelai, Acara, RSVP, dll.)
│   ├── ambient-petals.tsx# Partikel kelopak melati adat Sunda & stardust
│   ├── music-player.tsx  # Widget pemutar musik latar
│   └── scroll-reveal.tsx # Komponen animasi transisi scroll
├── config/
│   └── wedding.ts        # Data terpusat seluruh acara & mempelai
├── docs/
│   ├── PRD.md            # Product Requirements Document
│   ├── DECISIONS.md      # Catatan keputusan teknis & arsitektur
│   ├── PROGRESS.md       # Catatan kemajuan pengerjaan
│   └── spesifikasi-arah-desain.md # Spesifikasi desain & sistem ornamen
├── lib/
│   ├── auth.ts           # Logika sesi admin & verifikasi cookie
│   ├── bot-detection.ts  # Filter crawler / bot WhatsApp preview
│   ├── firebase-admin.ts # Inisialisasi Firebase Admin SDK server-side
│   └── db/               # Server-side data access layer (guests, messages, rsvp)
└── types/
    └── database.ts       # Definisi tipe data TypeScript
```

---

## 📄 Dokumentasi Proyek

Untuk rincian arsitektur, ketentuan produk, dan riwayat keputusan teknis, silakan merujuk ke folder `docs/`:
- [`docs/PRD.md`](docs/PRD.md) — Requirement produk, batasan kapasitas 250, dan alur persona.
- [`docs/DECISIONS.md`](docs/DECISIONS.md) — Alasan di balik setiap trade-off teknis dan desain.
- [`docs/PROGRESS.md`](docs/PROGRESS.md) — Rekap status pengerjaan dan log implementasi tiap sesi.
- [`docs/spesifikasi-arah-desain.md`](docs/spesifikasi-arah-desain.md) — Palet warna, tipografi, dan ornamen adat Sunda modern.

---

Dikembangkan dengan penuh dedikasi untuk pernikahan **Alwi & Septy** ❤️
