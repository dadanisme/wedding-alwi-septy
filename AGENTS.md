# CLAUDE.md

Website undangan pernikahan digital untuk **Alwi & Septy**, 150 tamu.
Sabtu, 10 Oktober 2026 · Akad 08.00 WIB · Resepsi 11.00–14.00 WIB · Steikhaus (Area Pabrik Bajoe), Bandung.

Fitur inti: link privat per tamu, pelacakan pembukaan, RSVP dengan opsi pendamping, buku tamu real-time, admin panel.

- **Live URL:** https://wedding-alwi.vercel.app
- **Repository:** https://github.com/dadanisme/wedding-alwi-septy

Data lengkap mempelai, venue, dan rekening ada di `docs/PRD.md` Bagian 2. Jangan menyalinnya ke dalam komponen — semua lewat berkas config.

## Status Terkini

@docs/PROGRESS.md

## Baca Saat Perlu

| Berkas | Isi |
|---|---|
| `docs/PRD.md` | Requirement produk. Sumber kebenaran untuk *apa* dan *mengapa* |
| `docs/spesifikasi-arah-desain.md` | Palet, tipografi, sistem ornamen, struktur halaman |
| `docs/DECISIONS.md` | Keputusan teknis dan alasannya. **Tulis di sini setiap kali ada trade-off yang dipilih** |

## Stack

Next.js 16 (App Router + Turbopack) · Bun · Vercel · Firebase Firestore · Firebase Auth (REST API) · Tailwind CSS v4

## Keputusan yang Sudah Dikunci

Alasan lengkap tiap butir ada di `docs/DECISIONS.md`.

**Produk**

- Link tamu tidak pakai query string. Format: `/{nama-slug}-{token-acak}`.
- Link boleh diteruskan. PIN ditolak karena gesekan UX.
- Plus-one terbuka untuk semua tamu. **Tidak ada kuota, penghitung, atau sakelar** — jangan membangun mekanisme pembatas. Kendalinya hanya angka proyeksi di dashboard.
- Tidak ada deadline RSVP keras. Hanya tanggal anjuran 26 September 2026.
- Layar sampul wajib. Menopang tiga hal sekaligus: izin memutar musik, penyaringan bot WhatsApp, dan momen pembukaan. **Jangan dihapus.**
- Nomor rekening tampil statis dengan tombol salin. **Jangan melebar ke pencatatan atau rekap hadiah.**
- Akad dan resepsi di venue yang sama. Jangan menduplikasi alamat dan peta dua kali.
- Gelar akademik mempelai (S.T., S.Pd.) ditampilkan.

**Desain**

- Arah desain ditentukan klien lewat gambar referensi, bukan lewat deskripsi kata. Kata "minimalist" dari klien hanya berlaku pada disiplin tata letak, bukan pada ornamen.
- Emas hanya untuk ornamen, ikon, dan garis. **Tidak pernah untuk teks isi** — gagal WCAG AA di atas krem.
- Halaman didominasi terang. Cokelat gelap maksimal sekitar seperlima tinggi halaman.
- Responsif penuh untuk ponsel dan desktop. Panjang baris teks dibatasi 60–70 karakter di desktop.

**Teknis**

- Seluruh konten acara terpusat di satu berkas config (`config/wedding.ts`).
- Akses basis data hanya dari server. Klien tidak pernah memegang kredensial baca langsung.
- Deployment Vercel terhubung ke repository GitHub `dadanisme/wedding-alwi-septy` (branch `main`).
- Kompatibilitas bundler: `serverExternalPackages: ["firebase-admin"]` di `next.config.ts` dan dependency override `jose@^4.15.9` di `package.json` untuk mencegah `ERR_REQUIRE_ESM` di Vercel.

## Konvensi

- Konten acara → berkas config, bukan di dalam komponen.
- Warna, spacing, tipografi → token dari design system, bukan nilai mentah.
- Mobile-first. Kerjakan dari viewport 390px, jangan turunkan dari desktop.
- Validasi seluruh input di server, bukan hanya di klien.

## Larangan

- Jangan menulis nilai warna atau spacing mentah. Selalu pakai token.
- Jangan mengerjakan lebih dari satu seksi dalam satu sesi.
- Jangan menambah dependensi tanpa persetujuan.
- Jangan mengubah keputusan di daftar atas tanpa mencatat alasannya di `docs/DECISIONS.md`.

## Protokol Sesi

1. Baca `PROGRESS.md` dan bagian PRD yang relevan.
2. **Nyatakan ulang requirement dan kriteria selesai sebelum menulis kode.**
3. Kerjakan satu seksi saja.
4. Jalankan `/code-review`.
5. Perbarui `docs/PROGRESS.md`, commit, tutup sesi.

Pemeriksaan visual di ponsel asli dilakukan manusia, bukan agent. Jangan menyatakan sebuah seksi selesai sebelum itu terjadi.

## Aturan Wajib: Tanya Dulu Kalau Tidak Yakin

**Kalau ada requirement, data, atau keputusan yang ambigu atau tidak jelas, TANYA ke user dulu. Jangan langsung asumsi dan mengerjakan.** Ini berlaku untuk apa pun — konten, desain, keputusan teknis, scope seksi yang dikerjakan, dsb. Lebih baik berhenti dan bertanya daripada salah asumsi lalu mengerjakan hal yang keliru.

## Catatan

- Route `/styleguide` **sudah ada** dan aktif sebagai living documentation untuk token desain visual, palet warna, tipografi, dan logo monogram resmi.
- Admin Panel berada di `/admin` dengan proteksi autentikasi di `/admin/login`.
- Seluruh 4 environment variables Firebase disinkronkan di Vercel (Production & Preview) via Secret.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
