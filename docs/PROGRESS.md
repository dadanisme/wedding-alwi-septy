# PROGRESS

Diperbarui: 6 September 2026 (malam)

Berkas ini dibaca otomatis di awal setiap sesi. **Perbarui di akhir setiap sesi.** Tetap pendek — kalau melewati satu halaman, pindahkan riwayat lamanya ke bawah dan rangkum.

## Sedang Dikerjakan

Seksi **Sampul** sudah diimplementasikan (`components/sections/sampul.tsx`, dirender di `/`) dan lolos code review. **Belum diverifikasi manusia di ponsel asli** — jangan tandai selesai sepenuhnya sampai itu terjadi (lihat CLAUDE.md § Protokol Sesi).

Foto prewedding asli dari klien sudah masuk (`public/photos/`, 21 foto) — lihat "Selesai". Ini membuka blocker Sampul & Galeri, tapi **Mempelai** dan **Love Story** masih terkunci (lihat Terkunci) karena kebutuhannya beda: Mempelai butuh foto solo (semua 21 foto yang ada berdua), Love Story butuh naskah.

Berkas config konten acara sudah ada (`lib/event-config.ts`, baru mencakup data mempelai/jadwal/venue/rekening/foto sampul — akan bertambah seiring seksi lain diimplementasikan).

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
- **Foto prewedding asli dari klien** (21 foto, `public/photos/`) — di-resize & dikompresi (lihat `docs/DECISIONS.md`), dikategorikan `modern-01..12.jpg` / `adat-sunda-01..09.jpg`. Semua foto berdua, tidak ada solo shot.
- **Berkas config konten acara** (`lib/event-config.ts`) — data mempelai, jadwal, venue, rekening (dari PRD §2), monogram, dan referensi foto sampul.
- **Seksi Sampul** (`components/sections/sampul.tsx`, dirender di `/`) — ponsel: 1 foto potret modern full-bleed; desktop: 2 panel potret (modern + adat Sunda). Guest name masih contoh statis ("Bapak/Ibu Budi Santoso") — sistem link/token tamu belum ada. Tombol "Buka Undangan" belum fungsional (reveal konten + trigger musik menyusul). Diverifikasi visual di 390×844 & 1280×900 lewat Chrome DevTools MCP — cocok dengan mockup, tidak ada console error.

## Berikutnya

- **Verifikasi manusia**: buka `/` di ponsel asli, bandingkan dengan mockup (lihat CLAUDE.md § Protokol Sesi)
- Setup project Firebase — Firestore dan Auth
- Lapisan akses data
- Implementasi seksi berikutnya satu per satu — kandidat siap: **Galeri** (foto sudah ada, tidak ada blocker konten). Ayat/Pembuka/Detail Acara/RSVP/Buku Tamu/Hadiah/Penutup belum dicek blocker-nya secara spesifik.

## Terkunci

| Item | Menunggu |
|---|---|
| Seksi Mempelai | Foto **solo** pria & wanita — 21 foto yang ada semuanya foto berdua |
| Seksi Love Story | Naskah + tahun tiap momen (PRD §11 poin 3) |
| Akurasi proyeksi total di dashboard | Jumlah pasti keluarga inti dan panitia |

## Menunggu dari Klien

1. ~~Foto prewedding~~ — **sudah masuk** (6 Sep), 21 foto di `public/photos/`. Tapi semuanya foto berdua — kalau seksi Mempelai butuh foto solo per orang, itu perlu diminta terpisah.
2. ~~Foto berorientasi lanskap untuk sampul desktop~~ — tidak lagi relevan. Mockup yang diapprove memakai 2 foto **potret** (4:5) berdampingan untuk sampul desktop, foto yang sama dengan versi ponsel.
3. Jumlah pasti keluarga inti dan panitia — dibutuhkan sebelum 3 Oktober 2026 (lihat Tanggal Penting)
4. Naskah love story (termasuk berapa momen & tahunnya)
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
