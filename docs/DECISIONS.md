# DECISIONS

Keputusan yang sudah diambil, alasannya, dan apa yang ditolak. Ditulis supaya keputusan tidak dibongkar ulang tanpa sengaja di sesi berikutnya.

Format tiap entri: keputusan, alasan, alternatif yang ditolak.

---

## Firestore, bukan Supabase

**Keputusan:** Firebase Firestore sebagai basis data.

**Alasan:** perilaku free tier. Supabase menonaktifkan project setelah sekitar tujuh hari tanpa aktivitas. Pola pemakaian produk ini punya periode sepi panjang — undangan disebar akhir Agustus, acaranya 10 Oktober, dan di antaranya hampir pasti ada minggu ketika semua yang ingin RSVP sudah RSVP. Jika project menonaktifkan diri di minggu seperti itu dan ada tamu membuka linknya, tamu itu menerima error, pada produk yang hanya punya satu kesempatan memberi kesan pertama.

**Ditolak:** Supabase. Perlu dicatat bahwa Supabase juga mampu real-time — itu bukan faktor pembedanya. Yang membedakan hanya perilaku auto-pause.

---

## Next.js dan Vercel

**Keputusan:** Next.js App Router di Vercel.

**Alasan:** requirement penentunya adalah gambar preview WhatsApp yang berbeda untuk setiap tamu, dihasilkan otomatis. Kemampuan ini paling matang di Next.js.

**Ditolak:** Astro, karena kemampuan yang sama harus disusun manual dan lebih rawan.

---

## Link boleh diteruskan, tanpa PIN

**Keputusan:** keamanan link hanya berasal dari token acak. Tidak ada PIN atau penguncian perangkat.

**Alasan:** untuk 150 tamu yang saling mengenal, risiko link diteruskan itu kecil, sementara gesekan UX dari PIN dibayar oleh semua tamu.

**Risiko yang diterima:** penerima teruskan bisa mengisi RSVP atas nama tamu asli. Dimitigasi dengan menghitung jumlah perangkat berbeda per link dan menandai anomali di dashboard.

---

## Tidak ada mekanisme pembatas plus-one

**Keputusan:** plus-one terbuka untuk semua tamu. Tidak ada kuota, penghitung, maupun sakelar penutup.

**Alasan:** kuota otomatis menyelesaikan masalah sosial dengan cara teknis, dan ongkosnya dua sisi. Dari sisi kerja: penghitung transaksional, penanganan pengiriman bersamaan, tampilan formulir berubah kondisi. Dari sisi tamu: orang yang menjawab lebih lambat ditolak membawa pasangannya semata-mata karena urutan waktu, yang canggung di acara pernikahan.

Pengendaliannya bersifat pengamatan. RSVP masuk bertahap selama enam minggu, jadi tren yang mengkhawatirkan terlihat berminggu-minggu sebelum menjadi masalah.

**Konsekuensi:** angka proyeksi total di dashboard naik pangkat menjadi satu-satunya alat kendali kapasitas. Ia harus terbaca sekilas dan berubah warna saat mendekati 250.

**Risiko yang diterima:** jika proyeksi melewati 250, satu-satunya jalan tersisa adalah menghubungi tamu yang sudah mengonfirmasi. Kemungkinannya kecil, tapi ini arah pemulihan yang paling mahal secara sosial.

**Ditolak:** kuota bersama otomatis, lalu sakelar manual dengan ambang peringatan. Keduanya dianggap terlalu berat untuk risiko yang kecil.

---

## Tidak ada deadline RSVP keras

**Keputusan:** formulir tetap terbuka sampai hari-H. Hanya ada tanggal anjuran 26 September 2026.

**Alasan:** deadline keras memblokir tamu yang terlambat, padahal mereka tetap ingin datang. Tanggal anjuran ditambah daftar reminder di admin panel memberi angka yang dibutuhkan katering tanpa memblokir siapa pun.

---

## Layar sampul sebagai gerbang

**Keputusan:** halaman undangan tidak langsung menampilkan isinya. Ada layar sampul dengan tombol buka.

**Alasan:** satu elemen ini menopang tiga requirement berbeda. Ia menyediakan interaksi pengguna yang dibutuhkan browser sebelum mengizinkan pemutaran musik, ia memisahkan pembukaan asli oleh manusia dari kunjungan otomatis sistem preview WhatsApp, dan ia menciptakan momen pembukaan yang terasa personal.

**Penting:** karena satu elemen menopang tiga hal, penghapusannya merusak fitur musik dan fitur pelacakan sekaligus.

---

## Rekening statis, bukan amplop digital

**Keputusan:** nomor rekening ditampilkan sebagai teks dengan tombol salin. Tidak ada pencatatan transaksi, konfirmasi kirim, atau rekap hadiah.

**Alasan:** fitur amplop digital penuh menambah beberapa hari pekerjaan ke Minggu 3 yang sudah terisi penuh. Tampilan statis memenuhi kebutuhan praktis tamu tanpa membebani jadwal.

**Catatan:** fitur hadiah punya kecenderungan melebar sendiri — dari tombol salin menjadi konfirmasi kirim, lalu rekap di admin. Batas ini sengaja ditulis di tiga tempat.

---

## Arah desain dari referensi visual, bukan dari eksplorasi

**Keputusan:** eksplorasi tiga konsep dibatalkan. Satu arah, mengikuti gambar referensi dari klien, termasuk tata letaknya.

**Alasan:** klien sudah menunjukkan referensi yang mewakili selera mereka, jadi menghasilkan tiga arah berbeda hanya membakar waktu. Referensinya hasil generate AI sehingga tidak ada aset atau susunan milik pihak lain yang perlu dihindari.

**Pelajaran yang perlu diingat:** dua kali klien memakai kata yang tidak sejalan dengan selera aslinya — "gemas", lalu "minimalist" — sementara referensi yang mereka pilih justru padat ornamen dan hangat. **Untuk klien ini, minta referensi visual, jangan minta deskripsi kata.**

**Catatan teknis:** ornamen di gambar referensi berbentuk raster dan tidak bisa dipakai ulang sebagai SVG. Ornamen untuk implementasi harus digambar khusus atau diambil dari sumber berlisensi bebas yang jelas.

---

## Emas tidak untuk teks isi

**Keputusan:** emas hanya untuk ornamen, ikon, dan garis.

**Alasan:** emas di atas krem hampir pasti gagal kontras WCAG AA. Ini kesalahan paling umum pada desain bernuansa emas, dan referensinya sendiri sudah benar soal ini — teks ayat di referensi memakai cokelat gelap, bukan emas.

---

## Responsif penuh, bukan frame terpusat

**Keputusan:** halaman undangan menata ulang dirinya untuk desktop, bukan tampil sebagai kolom selebar ponsel di tengah layar.

**Alasan:** keputusan klien proyek.

**Ongkos yang diterima:** kira-kira menggandakan kerja tata letak — sebelas seksi dikali dua susunan — dan itu jatuh di Minggu 2 yang sudah padat.

**Masalah yang belum selesai (diperbarui 6 Sep 2026 — lihat "Sampul desktop: dua panel potret" di bawah):** ~~foto prewedding berorientasi potret... Butuh foto berorientasi lanskap dari klien.~~ Sudah diselesaikan di mockup tanpa perlu foto lanskap.

**Ditolak:** frame terpusat dengan latar berornamen, yang lebih murah dan menjaga irama gulir vertikal.

---

## Tanpa subagent kustom

**Keputusan:** tidak ada berkas di `.claude/agents/`.

**Alasan:** dua rencana subagent gugur karena alat bawaan sudah menanganinya. Eksplorasi desain ditangani Claude Design. Peninjauan kode ditangani `/code-review`, yang sudah tersedia sebagai plugin bawaan dan memeriksa kepatuhan terhadap `CLAUDE.md` — persis tugas yang direncanakan untuk subagent `reviewer`.

**Konsisten dengan keputusan lebih awal:** Everything Claude Code ditolak dengan alasan sama, yaitu overhead lapisan agent melebihi manfaatnya pada proyek sekecil ini.

**Yang tidak tergantikan:** pemeriksaan visual di ponsel asli. Tidak ada agent yang bisa menilai apakah ornamen terasa berjejal di 390px.

---

## Konten terpusat di satu berkas config

**Keputusan:** seluruh konten acara berada di satu berkas config, bukan tersebar di komponen.

**Alasan:** revisi teks dari mempelai pasti terjadi dan biasanya berulang. Jika konten tersebar, setiap revisi kecil menjadi pekerjaan pencarian. Nama mempelai secara khusus dipakai berulang di seluruh halaman dan di preview WhatsApp.

---

## Sampul desktop: dua panel potret, bukan satu foto lanskap

**Keputusan:** sampul desktop dibelah dua panel foto potret berdampingan (640×840, ≈4:5), bukan satu foto lanskap penuh lebar.

**Alasan:** ini keputusan yang sudah diambil di dalam mockup yang diapprove mempelai (bukan keputusan baru sesi ini) — direkam di sini karena entri "Responsif penuh, bukan frame terpusat" di atas masih mencatatnya sebagai masalah terbuka yang butuh foto lanskap dari klien. Faktanya foto prewedding yang direncanakan semuanya potret (modern + adat Sunda), jadi sampul dirancang agar cocok dengan itu, bukan sebaliknya.

**Ditolak (tercatat di mockup):** satu foto potret dibentang selebar 1280px — kepala terpangkas, dan sampul jadi terbatas tinggi dengan bidang kosong di kiri-kanan.

**Konsekuensi:** item "foto lanskap untuk sampul desktop" di `PROGRESS.md` sudah tidak relevan. Foto yang masih ditunggu dari klien hanya foto potret (modern + adat Sunda), sama seperti untuk versi ponsel.

---

## Design system dikunci lewat token CSS (Tailwind v4), bukan file config terpisah

**Keputusan:** palet, tipografi, dan ornamen dari mockup yang diapprove dituangkan sebagai token `@theme`/`@utility` di `app/globals.css`, bukan `tailwind.config.ts`.

**Alasan:** `create-next-app@latest` men-generate Tailwind v4 dengan CSS-first config (tidak ada `tailwind.config.ts` lagi) — mengikuti default tooling saat ini alih-alih memaksa pola v3 yang sudah tidak dipakai versi terpasang.

**Skala tipografi:** dienkode sebagai pasangan kelas eksplisit (`text-guest-name` + `lg:text-guest-name-lg`) persis mengikuti dua breakpoint yang didokumentasikan di mockup (390px/1280px) — bukan `clamp()` fluida, karena mockup tidak pernah memutuskan kurva interpolasi di antaranya, hanya dua titik tetap.

**Ornamen:** seluruh simbol SVG (`sulur`, `spray`, `orn`, `wave`, `damaskPat`, `ico-cal/rings/pin`) diporting apa adanya dari mockup ke `components/ornaments.tsx` — sudah memenuhi syarat lisensi PRD (digambar khusus, bukan aset stok) karena memang aset yang sama.

**Logo:** dari 3 varian PNG hasil generate (hitam/putih-transparan/emas), hanya varian putih yang bertransparansi alpha, sehingga hanya itu yang dipasang di monogram sampul & penutup (latar gelap). Varian hitam dan emas disimpan di `public/logo/` dan ditampilkan di `/styleguide` untuk referensi, belum dipakai di komponen manapun.

**Ditolak:** menunda scaffold Next.js sampai ada foto asli. Ditolak karena token warna/tipografi/ornamen sudah lengkap dan disetujui terlepas dari foto — tidak ada alasan menunggu.

---

## Bun sebagai package manager, bukan npm

**Keputusan:** `bun` menggantikan `npm` untuk install dan menjalankan script (`bun run build`, `bun run lint`, dst). `package-lock.json` dihapus, digantikan `bun.lock`.

**Alasan:** permintaan langsung klien/pengembang. Vercel mendeteksi package manager otomatis dari lockfile yang ada di root, jadi kehadiran `bun.lock` sudah cukup — tidak perlu perubahan konfigurasi build di Vercel.

**Dampak:** `README.md` masih mencantumkan npm/yarn/pnpm sebagai opsi (boilerplate `create-next-app`, belum dirapikan — di luar scope sesi ini). Script di `package.json` tidak berubah, hanya package manager yang menjalankannya.

---

## Foto prewedding: intake, kompresi, dan pemilihan foto sampul

**Keputusan:** 21 foto dari klien (`drive-download-20260906T061840Z-1-001`) disalin ke `public/photos/`, di-resize ke maksimal 2000px sisi terpanjang dan dikompresi JPEG kualitas 78 (pakai `sips`, bukan dependency baru), lalu diberi nama deskriptif per gaya: `modern-01..12.jpg` (busana modern, latar kebun bunga) dan `adat-sunda-01..09.jpg` (busana adat Sunda, latar rumah kayu). Total turun dari ~90MB jadi ~11MB.

**Alasan:** PRD §5 mengharuskan "optimasi agresif" untuk foto prewedding. `next/image` mengoptimasi ukuran akhir per-viewport saat runtime, jadi source di `public/` hanya perlu cukup besar untuk retina desktop (~1680px efektif), bukan resolusi kamera asli (4242×2828–8MB/foto).

**Pemilihan foto sampul:** `modern-01.jpg` (potret, komposisi bersih, ruang kosong di atas kepala untuk scrim teks) dan `adat-sunda-02.jpg` (potret formal simetris, latar tidak ramai) — dipilih dari hasil tinjau visual seluruh 21 foto, cocok dengan spek mockup (Sampul ponsel: 1 foto potret modern full-bleed; Sampul desktop: dua panel potret 4:5, kiri modern/kanan adat Sunda). Referensi disimpan di `lib/event-config.ts` (`coverPhotos`), bukan di-hardcode di komponen.

**Konsekuensi untuk seksi lain:** seksi Mempelai butuh foto **solo** (pria sendiri, wanita sendiri) — tidak ada di antara 21 foto ini (semua foto berdua). Seksi Love Story butuh naskah + tahun momen yang juga belum ada (lihat PRD §11 poin 3–4, masih terbuka). Kedua seksi ini tetap terkunci; lihat `docs/PROGRESS.md`.

---

## Implementasi Sampul: pemetaan warna & token yang belum lengkap

**Keputusan:** saat porting seksi Sampul dari mockup, ditemukan dua kesenjangan kecil di design system yang dikunci sebelumnya (palet 11 warna + skala tipografi):

1. Mockup Sampul memakai beberapa varian near-white ad hoc untuk teks di atas foto (`#F1E7D6`, `#EFE4D2`) yang tidak persis sama dengan token manapun. Diputuskan untuk memetakan semuanya ke 2 token yang sudah ada: `--color-on-photo` untuk teks utama (judul, nama tamu, teks tombol) dan `--color-label-on-dark` untuk label kecil (`The Wedding Of`, tanggal, `Kepada Yth.`, subteks italic) — bukan menambah token warna baru, supaya palet 11 warna yang sudah dikunci tetap utuh.
2. Subteks italic ("Mohon berkenan hadir & memberi doa restu") tidak punya padanan di skala tipografi yang sudah ditranskrip. Ditambahkan utility baru `text-caption-italic`/`-lg` di `app/globals.css` (13px/17px, italic, 300) — nilai ditranskrip langsung dari mockup, bukan ditebak, mengikuti pola `@utility` yang sudah ada.

**Alasan:** kedua kesenjangan ini murni celah transkripsi sesi sebelumnya (elemen yang belum sempat masuk tabel skala), bukan perubahan atas keputusan yang sudah dikunci — jadi ditambal langsung alih-alih memblokir implementasi seksi.

---

## Spacing struktural: nilai piksel langsung, bukan token baru

**Keputusan:** padding, gap, ukuran ornamen, dan letter-spacing di komponen seksi (mis. `components/sections/sampul.tsx`) memakai nilai arbitrary Tailwind (`pt-[52px]`, `gap-[14px]`, `tracking-[0.34em]`, dst.) yang ditranskrip langsung dari geometri mockup per breakpoint, bukan lewat token spacing baru.

**Alasan:** design system yang dikunci sebelumnya eksplisit hanya mencakup palet warna dan skala tipografi (lihat "Design system dikunci lewat token CSS" di atas) — spacing sengaja tidak masuk cakupan itu. Ini konsisten dengan keputusan "dua breakpoint tetap, bukan `clamp()` fluida": tiap seksi punya geometri piksel sendiri sesuai mockup, jadi token spacing generik justru bisa menyembunyikan bahwa dua seksi kebetulan mirip padahal didesain independen.

**Batasan:** kalau sebuah nilai (padding, gap, ukuran ikon, dll.) ternyata dipakai identik di ≥2 seksi setelah beberapa seksi diimplementasikan, nilai itu harus diangkat jadi utility bersama di `app/globals.css` saat itu — bukan didiamkan sebagai duplikasi. Warna dan skala tipografi tetap wajib pakai token yang sudah ada, tanpa pengecualian.

---

## Seksi Pembuka: foto beda per breakpoint, bukan satu foto di-crop ulang

**Keputusan:** latar seksi Pembuka memakai 2 foto adat Sunda yang berbeda — `adat-sunda-03.jpg` (potret) untuk ponsel, `adat-sunda-04.jpg` (lanskap asli) untuk desktop — bukan satu foto yang sama di-crop ulang ke dua rasio seperti pola Sampul.

**Alasan:** mockup seksi Pembuka secara eksplisit minta foto lanskap PENUH untuk desktop (beda dari Sampul yang dulunya minta lanskap tapi akhirnya dipecah jadi 2 panel potret karena semua foto klien saat itu potret). Untuk Pembuka, ternyata ada beberapa foto di antara 21 foto klien yang orientasinya memang lanskap asli (adat-sunda-04 s/d 09, ~1.5:1), jadi tidak perlu kompromi tata letak seperti Sampul — cukup pilih foto yang aspeknya sudah cocok. Foto dipilih dari tinjau visual: `adat-sunda-03` (potret, komposisi jelas, cukup gelap secara alami sehingga scrim tidak perlu terlalu pekat) untuk ponsel; `adat-sunda-04` (busana akad formal simetris, latar tidak ramai) untuk desktop.

**Konsekuensi:** `openingPhotos` di `lib/event-config.ts` punya key `portrait`/`landscape`, beda bentuk dari `coverPhotos` (`modern`/`adatSunda`) milik Sampul — sengaja tidak disatukan karena mewakili keputusan desain yang berbeda (foto identik lintas breakpoint vs foto berbeda per orientasi).

**Ditolak:** memaksa satu foto potret di-object-cover ke kontainer lanskap 1280×660 desktop (akan memotong komposisi terlalu agresif, beda dengan kasus Sampul yang memang tidak punya pilihan foto lanskap sama sekali).

---

## Seksi Pembuka: `min-h` bukan `h` tetap untuk kontainer foto+teks

**Keputusan:** kontainer seksi Pembuka pakai `min-h-[620px] lg:min-h-[660px]`, bukan `h-[620px] lg:h-[660px]` seperti angka literal di mockup. `justify-end` untuk bottom-align teks dipindah ke `<section>` itu sendiri (`flex flex-col justify-end`), bukan ke div pembungkus teks.

**Alasan:** ditemukan saat `/code-review` — tinggi tetap + `overflow-hidden` + konten teks yang di-bottom-align berarti kalau `openingGreeting` di `lib/event-config.ts` suatu saat direvisi jadi lebih panjang, teks bisa terpotong diam-diam dari atas tanpa error atau scrollbar. `min-h` memberi ruang tumbuh kalau kalimatnya berubah, tanpa mengubah posisi wave/sulur yang memang sudah di-anchor ke tepi (`top-[-1px]`/`bottom-0`).

**Regresi yang sempat lolos ke commit:** percobaan pertama menaruh `h-full flex flex-col justify-end` di div pembungkus teks (anak dari section) — tapi `h-full` (`height:100%`) tidak pernah resolve terhadap parent yang cuma punya `min-height` (bukan `height` eksplisit), sesuai spesifikasi CSS. Akibatnya wrapper collapse ke tinggi kontennya sendiri dan `justify-end` jadi no-op — teks salam malah nongol di paling atas seksi, nimpa wave/foto Ayat. Ini lolos dari verifikasi visual sesi itu karena verifikasi dilakukan **sebelum** fix `min-h` diterapkan (asumsi "tampilan tidak berubah" tidak diverifikasi ulang) — baru ketahuan dari screenshot manusia di device asli. **Pelajaran: re-verifikasi visual wajib setelah SETIAP perubahan CSS/layout, termasuk perubahan yang terlihat "aman", tidak cukup cuma lint/build.** Perbaikan: `justify-end` dipindah ke `<section>` (flex container-nya sendiri, bukan lewat height percentage), yang bekerja benar terlepas dari `section` pakai `height` atau `min-height`.
