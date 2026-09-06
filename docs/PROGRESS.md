# PROGRESS

Diperbarui: 6 September 2026 (malam, lanjutan)

Berkas ini dibaca otomatis di awal setiap sesi. **Perbarui di akhir setiap sesi.** Tetap pendek — kalau melewati satu halaman, pindahkan riwayat lamanya ke bawah dan rangkum.

## Sedang Dikerjakan

Foto prewedding asli dari klien sudah masuk (`public/photos/`, 21 foto) — lihat "Selesai". Ini membuka blocker Sampul & Galeri, tapi **Mempelai** dan **Love Story** masih terkunci (lihat Terkunci) karena kebutuhannya beda: Mempelai butuh foto solo (semua 21 foto yang ada berdua), Love Story butuh naskah.

Berkas config konten acara sudah ada (`lib/event-config.ts`, baru mencakup data mempelai/jadwal/venue/rekening/foto sampul — akan bertambah seiring seksi lain diimplementasikan).

Firebase/Firestore/Auth dan lapisan akses data **belum** dikerjakan — masih di daftar "Berikutnya".

## Selesai

- PRD (`docs/PRD.md`)
- Spesifikasi arah desain (`docs/spesifikasi-arah-desain.md`)
- Data acara final dari klien: nama, orang tua, jadwal, venue, rekening
- Arah desain ditentukan klien lewat gambar referensi
- Mockup desain (`docs/mockup/Undangan Alwi & Septy.html`) — diapprove mempelai. Sebelumnya di Downloads klien, dipindah ke repo 6 Sep supaya tidak perlu dicari ulang
- Logo/monogram "A&S": 3 varian di Downloads klien (hitam solid, putih transparan, emas solid — semua 1254×1254 PNG, versi terpotong+dikompres di `public/logo/`). Varian putih transparan dipasang di monogram sampul & penutup mockup (ponsel & desktop, 4 titik total). Varian hitam dan emas belum dipakai di komponen — ditampilkan di `/styleguide` untuk referensi.
- Scaffold Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind v4 + ESLint. `bun run build` dan `bun run lint` bersih.
- Runtime/package manager diganti dari npm ke Bun (`bun.lock` menggantikan `package-lock.json`). Lihat `docs/DECISIONS.md`.
- Design system dikunci: palet (11 warna + rasio kontras), font (Cormorant Garamond + Crimson Pro via `next/font/google`), skala tipografi (kelas `text-*`/`text-*-lg` di `app/globals.css`) — semua ditranskrip dari blok "Catatan Desain" di mockup, bukan ditebak ulang.
- Sistem ornamen SVG diporting ke `components/ornaments.tsx` (sulur, spray, orn, wave, damaskPat, ico-cal/rings/pin) — dipasang sekali di root layout lewat `<OrnamentDefs />`.
- Route `/styleguide` — menampilkan palet, skala tipografi (termasuk uji nama bergelar 390px), ornamen, dan 3 varian logo.
- **Foto prewedding asli dari klien** (21 foto, `public/photos/`) — di-resize & dikompresi (lihat `docs/DECISIONS.md`), dikategorikan `modern-01..12.jpg` / `adat-sunda-01..09.jpg`. Semua foto berdua, tidak ada solo shot.
- **Berkas config konten acara** (`lib/event-config.ts`) — data mempelai, jadwal, venue, rekening (dari PRD §2), monogram, dan referensi foto sampul.
- **Seksi Sampul** (`components/sections/sampul.tsx`, dirender di `/`) — ponsel: 1 foto potret modern full-bleed; desktop: 2 panel potret (modern + adat Sunda). Guest name masih contoh statis ("Bapak/Ibu Budi Santoso") — sistem link/token tamu belum ada. Tombol "Buka Undangan" belum fungsional (reveal konten + trigger musik menyusul). Diverifikasi visual di 390×844 & 1280×900 lewat Chrome DevTools MCP dan **dikonfirmasi manusia di ponsel asli** (6 Sep) — cocok dengan mockup.
- **Pembatas Wavy di bawah Sampul diperkaya** — symbol `wave` di `components/ornaments.tsx` sekarang punya 2 garis emas paralel (path `#waveLine` dipakai 2× lewat `<use>`, ketebalan & offset beda) alih-alih 1 garis tunggal, supaya transisi ke seksi Ayat tidak terlihat seperti dipotong polos. Diverifikasi di 390px & 1280px, lolos code review. **Referensi klien untuk transisi ini sebenarnya lebih kaya** (sulur pojok foto yang menjuntai melewati wave, flourish kecil, motif damask) — bagian flourish & motif damask itu milik latar seksi Ayat, jadi sengaja tidak dikerjakan saat itu; klien memilih cukup garis ganda dulu.
- **Seksi Ayat** (`components/sections/ayat.tsx`, dirender di `/` setelah Sampul) — kutipan Q.S. Ar-Rum : 21 (terjemahan saja, tanpa teks Arab) di atas latar krem berornamen (damask + sulur 4 sudut di desktop/2 sudut di ponsel + pembatas `orn`). Konten baru di `lib/event-config.ts` (`openingVerse`) — tidak ada di PRD, ditranskrip dari mockup karena PRD memang tidak mencantumkan teks ayat. Dua utility tipografi baru di `app/globals.css` (`text-ayat-title(-lg)`, `text-ayat(-lg)`) ditranskrip persis dari mockup, sedikit beda dari `text-body` generik (lebih lega). Diverifikasi visual di 390×844 & 1280×900 lewat Chrome DevTools MCP, lolos code review, dan **dikonfirmasi manusia di ponsel asli** (6 Sep) — cocok dengan mockup.
- **Seksi Pembuka** (`components/sections/pembuka.tsx`, dirender di `/` setelah Ayat) — salam "Bismillahirrahmanirrahim" + "Assalamu'alaikum..." + kalimat pengantar, di atas foto adat Sunda gelap dengan scrim, wave divider atas-bawah, dan sulur pojok bawah. Konten baru di `lib/event-config.ts` (`openingGreeting`) — tidak ada di PRD, ditranskrip dari mockup yang sama dengan Ayat. **Beda dari Sampul:** ponsel & desktop pakai foto berbeda (`openingPhotos.portrait`/`landscape`, adat-sunda-03/04), bukan satu foto di-crop ulang — lihat `docs/DECISIONS.md`. Dua utility tipografi baru (`text-pembuka-greeting(-lg)`, `text-pembuka(-lg)`) dan 2 utility scrim baru (`bg-pembuka-scrim(-lg)`) ditranskrip dari mockup.
  Tiga putaran perbaikan pasca-implementasi awal (kronologi lengkap & alasan tiap fix ada di `docs/DECISIONS.md`, jangan diulang di sini): (1) `/code-review` menemukan risiko teks terpotong diam-diam → `h-` jadi `min-h-`; (2) fix itu sendiri regresi (teks salam nongol di atas, bukan di bawah) karena `h-full` tidak resolve terhadap parent `min-height` — ketahuan dari screenshot manusia, diperbaiki dengan pindahkan `justify-end` ke `<section>`; (3) di monitor lebar (>1920px) foto latar motong kepala pasangan karena kontainer jadi sangat pipih (tinggi nyaris tetap, lebar `100vw` tak terbatas) — diperbaiki dengan `max-w-[1600px]` khusus foto desktop + `object-position` custom (`object-[center_20%]`, dihitung dari posisi kepala asli di foto, bukan tebakan). **Pelajaran yang berulang di seksi ini: re-verifikasi visual wajib di setiap perubahan CSS/layout, jangan asumsi "aman" dari kode saja** (sudah disimpan ke memory).
  Diverifikasi ulang di 390px, ~1000px (kasus terburuk foto ponsel: tablet lanskap), 1280px (referensi mockup — tidak berubah), dan 2200px (monitor lebar) — kepala aman & framing wajar di semua titik itu. **Belum dikonfirmasi manusia di ponsel asli** untuk versi final ini.
  **Update:** `max-w-[1600px]` di atas dicabut lagi atas permintaan user sesi ini (dikonfirmasi dulu karena membalik keputusan sebelumnya — lihat `docs/DECISIONS.md`). Foto desktop kembali full-bleed 100vw tanpa batas lebar; `object-[center_20%]` tidak diubah. Diverifikasi ulang di 1280px/2200px/2560px/3440px — kepala masih aman di semua titik itu, tidak diuji di atas 3440px.

## Berikutnya

- Setup project Firebase — Firestore dan Auth
- Lapisan akses data
- Implementasi seksi berikutnya satu per satu — kandidat siap: **Galeri** (foto sudah ada). Detail Acara/RSVP/Buku Tamu/Hadiah/Penutup belum dicek blocker-nya secara spesifik.

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
