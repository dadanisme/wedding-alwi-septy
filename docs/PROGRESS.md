# PROGRESS

Diperbarui: 6 September 2026 (malam)

Berkas ini dibaca otomatis di awal setiap sesi. **Perbarui di akhir setiap sesi.** Tetap pendek — kalau melewati satu halaman, pindahkan riwayat lamanya ke bawah dan rangkum.

## Sedang Dikerjakan

Route `/styleguide` sudah ada dan gate desain (lihat `CLAUDE.md` bagian Catatan) sudah **tutup** — design system dikunci dari mockup yang diapprove. Implementasi seksi (Sampul, Ayat, Pembuka, dst.) boleh dimulai sesi berikutnya, satu seksi per sesi, tapi sebagian besar seksi masih menunggu foto prewedding asli (lihat Terkunci).

Firebase/Firestore/Auth dan lapisan akses data **belum** dikerjakan — masih di daftar "Berikutnya".

## Selesai

- PRD (`docs/PRD.md`)
- Spesifikasi arah desain (`docs/spesifikasi-arah-desain.md`)
- Data acara final dari klien: nama, orang tua, jadwal, venue, rekening
- Arah desain ditentukan klien lewat gambar referensi
- Mockup desain (`Undangan Alwi & Septy.html`) — diapprove mempelai
- Logo/monogram "A&S": 3 varian di Downloads klien (hitam solid, putih transparan, emas solid — semua 1254×1254 PNG, versi terpotong+dikompres di `public/logo/`). Varian putih transparan dipasang di monogram sampul & penutup mockup (ponsel & desktop, 4 titik total). Varian hitam dan emas belum dipakai di komponen — ditampilkan di `/styleguide` untuk referensi.
- Scaffold Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind v4 + ESLint. `bun run build` dan `bun run lint` bersih.
- Runtime/package manager diganti dari npm ke Bun (`bun.lock` menggantikan `package-lock.json`). Lihat `docs/DECISIONS.md`.
- Design system dikunci: palet (11 warna + rasio kontras), font (Cormorant Garamond + Crimson Pro via `next/font/google`), skala tipografi (kelas `text-*`/`text-*-lg` di `app/globals.css`) — semua ditranskrip dari blok "Catatan Desain" di mockup, bukan ditebak ulang.
- Sistem ornamen SVG diporting ke `components/ornaments.tsx` (sulur, spray, orn, wave, damaskPat, ico-cal/rings/pin) — dipasang sekali di root layout lewat `<OrnamentDefs />`.
- Route `/styleguide` — menampilkan palet, skala tipografi (termasuk uji nama bergelar 390px), ornamen, dan 3 varian logo.

## Berikutnya

- Setup project Firebase — Firestore dan Auth
- Berkas config konten acara
- Lapisan akses data
- Implementasi seksi satu per satu (menunggu foto untuk sebagian besar — lihat Terkunci)

## Terkunci

| Item | Menunggu |
|---|---|
| Implementasi seksi (Sampul, Pembuka, Mempelai, Love Story, Galeri) | Foto prewedding asli — klien bilang sudah ada (6 Sep), tapi belum ditemukan berkasnya (dicek di Downloads, belum ada) |
| Akurasi proyeksi total di dashboard | Jumlah pasti keluarga inti dan panitia |

## Menunggu dari Klien

1. **Foto prewedding** (minimal 2: satu modern, satu adat Sunda, potret) — paling mendesak, sudah dua kali jadi penyebab masalah. Klien bilang sudah ada (6 Sep) tapi berkasnya belum ditemukan.
2. ~~Foto berorientasi lanskap untuk sampul desktop~~ — tidak lagi relevan. Mockup yang diapprove memakai 2 foto **potret** (4:5) berdampingan untuk sampul desktop, foto yang sama dengan versi ponsel.
3. Jumlah pasti keluarga inti dan panitia — dibutuhkan sebelum 3 Oktober 2026 (lihat Tanggal Penting)
4. Naskah love story
5. Dress code
6. Pilihan musik latar
7. Handle Instagram
8. Daftar 150 nama tamu beserta format sapaannya

## Tanggal Penting

| Tanggal | Item |
|---|---|
| 31 Agustus 2026 | Undangan mulai disebar |
| 26 September 2026 | Tanggal anjuran RSVP, mulai kirim reminder |
| 3 Oktober 2026 | Angka headcount dikunci untuk katering |
| 10 Oktober 2026 | Hari-H |
