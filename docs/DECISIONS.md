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

---

## Seksi Pembuka: foto latar desktop dibatasi `max-w-[1600px]` + `object-position` custom, bukan `object-cover` polos tak terbatas

**Keputusan:** foto latar desktop (`openingPhotos.landscape`) dibungkus `relative mx-auto h-full max-w-[1600px]` (jadi berhenti tumbuh lebar setelah 1600px, tersentral, sisa lebar di kanan-kiri menampilkan `bg-espresso` milik section itu sendiri). Kedua foto (`portrait` & `landscape`) pakai `object-cover object-[center_20%]` (bukan `object-center` default, dan bukan pula `object-top`/0%).

**Kronologi & alasan:** ditemukan dari screenshot manusia di monitor lebar (>1920px) — kontainer section tingginya nyaris tetap (`min-h-[660px]`) sementara lebarnya `100vw` tak terbatas, jadi di monitor lebar rasio kontainer jadi jauh lebih pipih dari rasio foto sumber (mis. 2200×660 ≈ 3.3:1 vs foto lanskap ≈ 1.5:1). `object-center` (default) motong rata atas-bawah secara proporsional terhadap makin lebarnya jendela crop, dan karena kepala pasangan tidak persis di tengah vertikal foto, potongan itu kena kepala duluan di layar ekstrem lebar.

Percobaan pertama pakai `object-top` (0%) — ini menghilangkan potongan kepala, tapi laporan manusia berikutnya bilang kepala jadi "terlalu ke bawah": karena `object-top` mengunci ke tepi PALING ATAS foto (termasuk ruang kosong plafon/rangka atap di atas kepala yang cukup besar di foto sumber), semua ruang kosong itu ikut tampil penuh, mendorong kepala & badan tampak lebih rendah dari yang enak dilihat di lebar layar yang wajar (1280–1600px).

**Solusi final (dua bagian):**
1. **`object-[center_20%]`** — dihitung dari posisi aktual kepala di tiap foto (diukur pakai grid overlay per 10%): mahkota/kupiah mulai sekitar 10–18% dari atas foto. Nilai `20%` dipilih supaya baris crop selalu menyisakan sedikit ruang di atas kepala (bukan nol, bukan berlebihan) di seluruh rentang rasio kontainer yang realistis — dihitung manual pakai rumus `object-fit:cover`, diverifikasi di 390px, ~1000px (kasus terburuk untuk foto ponsel: tablet lanskap/jendela sempit di bawah breakpoint `lg`), 1280px (referensi mockup — masih cocok), dan 2200px.
2. **`max-w-[1600px]`** — HANYA untuk foto desktop (lanskap), supaya rasio kontainer tidak makin ekstrem tanpa batas di monitor sangat lebar; foto ponsel tidak perlu ini karena sudah otomatis dibatasi breakpoint `lg` (1024px). Angka 1600 dipilih supaya laptop/monitor umum (≤1920px) nyaris tidak pernah kena batas ini (1920 masih lebih lebar dari kebanyakan browser window yang benar-benar maximized), sementara monitor ultrawide (>1600px) dapat "pita foto" bar-bar hitam di kanan-kiri yang berbaur dengan `bg-espresso` section — bukan foto yang makin gepeng tak berujung. Ini BUKAN "frame terpusat" untuk seluruh halaman (yang memang ditolak di keputusan "Responsif penuh, bukan frame terpusat") — cuma membatasi satu elemen foto full-bleed di satu seksi, atas permintaan langsung saat sesi ini ("kayaknya perlu dibatasin deh lebarnya pake container system").

**Konsekuensi:** di breakpoint referensi 1280px (di bawah 1600px, jadi `max-w` belum berlaku), framing hampir sama dengan `object-center` awal, cocok dengan mockup. Tidak menyelesaikan rasio ekstrem <1600px lebar tapi sangat pendek (mis. window di-resize manual jadi sangat landscape) — itu di luar skenario realistis (device/monitor sungguhan) yang dicek sesi ini.

---

## Seksi Pembuka: `max-w-[1600px]` di atas dicabut lagi — foto desktop full-bleed tanpa batas

**Keputusan:** wrapper `relative mx-auto h-full max-w-[1600px]` dihapus. Foto latar desktop (`openingPhotos.landscape`) sekarang langsung `fill` di dalam `absolute inset-0` induknya, `sizes` dikembalikan ke `100vw` polos (bukan `(min-width: 1600px) 1600px, 100vw`). `object-[center_20%]` dari keputusan sebelumnya **tetap dipakai, tidak diubah**.

**Alasan:** permintaan langsung sesi ini ("hapus limit width dari gambar di pembuka"). Karena ini membalik keputusan di atas, dikonfirmasi dulu ke user (bukan diasumsikan) — user memilih hapus total dan menerima risiko rasio kontainer jadi ekstrem tak terbatas di monitor sangat lebar.

**Verifikasi ulang:** setelah pencabutan, diuji ulang di 1280px (referensi mockup, tidak berubah), 2200px, 2560px, dan 3440px (resolusi ultrawide sungguhan) lewat Chrome DevTools MCP. Di semua titik itu kepala pasangan **masih penuh terlihat dengan ruang di atas** — `object-[center_20%]` ternyata sudah cukup kuat sendirian tanpa perlu dibantu `max-w`, setidaknya sampai 3440px. Belum diuji di lebar >3440px (mis. monitor 5K/setup multi-monitor) karena dianggap di luar skenario realistis; kalau nanti ada laporan kepala terpotong di monitor yang lebih lebar dari itu, ini titik pertama yang perlu dicek ulang.

---

## Seksi Galeri: rasio tile per foto mengikuti orientasi asli, bukan satu rasio potret seperti wireframe mockup

**Keputusan:** grid Galeri (`components/sections/galeri.tsx`) menampilkan seluruh 21 foto klien, urut mengikuti penomoran file (modern-01..12 lalu adat-sunda-01..09), satu grid tunggal tanpa label kategori. Tile potret pakai rasio `2:3` (span 1 kolom), tile lanskap pakai `3:2` (span 2 kolom) — dipilih dari `galleryPhotos[].orientation` di `lib/event-config.ts`, yang diukur langsung dari dimensi piksel asli tiap berkas (bukan ditebak).

**Alasan:** wireframe mockup untuk seksi ini (`docs/mockup/Undangan Alwi & Septy.html`, seksi 6) cuma berisi kotak abu-abu placeholder dengan label "01 · 3:4" dst — bukan foto asli — dan asumsinya mayoritas tile berrasio potret 3:4 dengan satu tile "sorotan" persegi. Setelah 21 foto asli diukur (`sips -g pixelWidth -g pixelHeight`), ternyata komposisinya terbalik: 14 foto lanskap, cuma 7 potret. Memaksa 14 foto lanskap ke tile potret 3:4 lewat `object-cover` akan memotong ~35-45% lebar tiap foto. Rasio tile karena itu dipilih mengikuti orientasi foto asli per tile, bukan wireframe-nya — ini keputusan implementasi, bukan keputusan produk, jadi tidak perlu approval ulang mempelai (tidak mengubah *apa* yang ditampilkan, hanya *bagaimana* crop-nya).

**Bug ganda yang ditemukan saat verifikasi visual (bukan lewat kode/lint/build):**

1. **Sel grid kosong tak-terisi.** Rangkaian (run) 3 foto potret berurutan (adat-sunda-01/02/03, span-1 tiap tile) tidak pernah pas mengisi baris grid (2 kolom ponsel / 4 kolom desktop) berdampingan dengan tile lanskap (span-2) — selalu menyisakan 1 kolom kosong yang tidak bisa diisi CSS grid apa pun, termasuk `grid-auto-flow: dense` (karena tidak ada tile span-1 lain setelahnya untuk mengisi sisa itu). Ketahuan dari screenshot 390px: satu foto tampil sendirian dengan ruang kosong di sampingnya, terlihat seperti foto hilang. **Fix:** `buildGalleryTiles()` di `galeri.tsx` mendeteksi rangkaian potret yang panjangnya ganjil dan mempromosikan foto TERAKHIR dalam rangkaian itu jadi span-2 — pola "2 normal + 1 besar" (bukan "1 besar + 2 normal"; posisi tidak masalah secara matematis, tapi user mengonfirmasi tidak keberatan tile besar selalu di akhir rangkaian, bukan di awal).
2. **Tinggi baris tidak rata (ketahuan lewat screenshot manusia, bukan verifikasi Chrome DevTools MCP sesi ini — celah proses, lihat catatan di bawah).** Percobaan pertama memberi tile yang dipromosikan itu rasio `4:5` (agak persegi, dimaksudkan supaya "terlihat sengaja, bukan cuma sisa ruang"). Ternyata `4:5` pada lebar 2 kolom menghasilkan tinggi tile yang JAUH lebih tinggi dari 2 tile potret `2:3` di baris yang sama — baris grid melar mengikuti tile tertinggi, dan tile yang lebih pendek (punya `aspect-ratio` tetap, tidak ikut stretch) menyisakan ruang kosong kentara di bawahnya, di lebar desktop manapun (bukan cuma satu breakpoint — proporsional terhadap lebar kolom, jadi selalu muncul kalau baris ini sama-sama dirender). **Fix:** rasio diganti `4:3` — dihitung supaya tinggi tile yang dipromosikan (lebar 2 kolom ÷ 4:3) persis sama dengan tinggi tile potret di sebelahnya (lebar 1 kolom ÷ 2:3), keduanya `1.5×lebar-kolom`.

**Pelajaran proses:** bug #2 lolos dari verifikasi visual Chrome DevTools MCP di 390px/1280px/2200px sesi ini — screenshot desktop sudah diambil dan celah ruang kosong itu ADA di gambarnya, tapi tidak diperhatikan karena fokus verifikasi saat itu cuma "apakah ada sel grid yang kosong" (bug #1), bukan "apakah tinggi antar-tile di baris yang sama rata". Baru ketahuan dari screenshot manusia terpisah. Menguatkan pelajaran [[reverify_after_css_layout_changes]] di memory — tapi versi lebih spesifik di sini: **kalau sebuah baris/grid mencampur lebih dari satu rasio tile, verifikasi visual harus eksplisit mengecek kerataan tinggi antar-tile yang bertetangga, bukan cuma "apakah semua konten ada".**

---

## Seksi Galeri: lightbox custom, tanpa dependency baru

**Keputusan:** "tampilan perbesar" (PRD §4.2 seksi 6) diimplementasikan sebagai lightbox custom di `components/sections/galeri.tsx` ("use client") — overlay penuh layar, navigasi next/prev (tombol, panah keyboard, swipe sentuh), indikator posisi ("N / 21"), tombol tutup, fokus dipindah ke tombol tutup saat dibuka dan dikembalikan ke tile pemicu saat ditutup, scroll body dikunci selama overlay terbuka. Tidak ada library lightbox pihak ketiga yang ditambahkan (mis. `yet-another-react-lightbox`).

**Alasan:** ini komponen client-interaktif pertama di halaman undangan (semua seksi sebelumnya server-rendered statis) — dipilih custom karena requirement-nya (navigasi + swipe + keyboard + fokus) cukup sederhana untuk ditulis langsung, dan `CLAUDE.md` melarang menambah dependency tanpa persetujuan.

**Cakupan aksesibilitas yang SENGAJA tidak dikerjakan:** focus trap penuh (tab-cycling terkunci di dalam dialog) tidak diimplementasikan — hanya fokus awal & fokus kembali. Dianggap cukup untuk lingkup sesi ini; bisa ditambah kalau ada kebutuhan konkret.

**3 temuan `/code-review` (medium effort), semua diperbaiki sebelum sesi ditutup:**

1. **`sizes` salah untuk tile span-2.** `<Image>` grid dulu pakai `sizes` yang sama untuk semua tile (`25vw` desktop / `50vw` ponsel) padahal tile lanskap (span-2, mayoritas dari 21 foto) dirender selebar `50vw` desktop / `100vw` ponsel — dua kali lebih lebar dari yang diminta ke Next.js, jadi browser mengambil source gambar yang terlalu kecil lalu di-upscale CSS (blur/pecah). Fix: `sizes` sekarang bercabang berdasar `photo.span`.
2. **Fokus lightbox ke-reset di setiap navigasi, bukan cuma saat buka.** `useEffect` yang memindah fokus ke tombol Tutup memakai `[activeIndex]` sebagai dependency, jadi berjalan ulang setiap next/prev — pengguna keyboard yang Tab ke tombol "Foto berikutnya" lalu tekan Enter berulang kali akan didorong fokusnya balik ke Tutup setiap langkah, sehingga Enter kedua menutup lightbox alih-alih lanjut ke foto berikutnya. Fix: dependency diganti ke `isOpen` (boolean `activeIndex !== null`), supaya efek cuma jalan saat transisi buka/tutup, bukan tiap pergantian indeks.
3. **Heuristik promosi run-ganjil (lihat entri gap grid di atas) cuma terbukti benar untuk 21 foto saat ini** — kalau `galleryPhotos` diedit nanti dan menghasilkan rangkaian lanskap yang panjangnya ganjil, itu bisa memunculkan gap serupa yang tidak ditangani heuristik ini. Daripada menggeneralisasi algoritmanya (risiko kompleksitas tanpa jaminan menutup semua kasus), ditambahkan `assertNoGridGaps()` — simulasi penempatan grid yang `throw` saat modul dimuat kalau susunan tile manapun (2 kolom atau 4 kolom) ternyata menyisakan gap. Build akan gagal keras kalau ini terjadi, bukan diam-diam menampilkan bug visual yang sama seperti yang baru ditemukan sesi ini.
4. **Penutupan Lightbox via Klik Luar (*Click Outside Backdrop*) & Proteksi Swipe.** Pengguna menghendaki lightbox bisa ditutup cukup dengan mengeklik area luar latar belakang gelap tanpa harus menekan tombol 'X'. Implementasi: event `onClick={close}` dipasang pada overlay backdrop `role="dialog"`, sedangkan elemen `<Image>` dan tombol aksi (tutup, sebelumnya, berikutnya) diberi `e.stopPropagation()`. Untuk mencegah area kosong di sekeliling foto (akibat rasio `object-contain` pada kontainer statis) memblokir klik latar, dimensi asli (`width` & `height`) dipasok ke `lib/event-config.ts` dan styling `<Image>` disesuaikan (`w-auto max-h-[80vh]`) agar batas DOM elemen gambar pas menempel foto. Pada interaksi sentuh ponsel, gesture swipe dilacak via `isSwipingRef` (`deltaX/Y > 10px`) agar pengangkatan jari pasca-geser foto tidak sengaja memicu synthetic click yang menutup lightbox.

---

## Seksi Galeri: Penyesuaian Foto Klien (Hapus 3 Foto & Relokasi Posisi Foto Adat Sunda 4 & 9)

**Keputusan:** atas arahan pengguna/mempelai:
1. Menghapus 3 foto dari `galleryPhotos` di `lib/event-config.ts`:
   - `modern-10.jpg` ("Alwi & Septy — foto modern 10")
   - `modern-12.jpg` ("Alwi & Septy — foto modern 12")
   - `adat-sunda-05.jpg` ("Alwi & Septy — busana adat Sunda 5")
2. Memindahkan `adat-sunda-04.jpg` dan `adat-sunda-09.jpg` ke posisi setelah `modern-11.jpg` (menggantikan posisi `modern-12.jpg`).
3. Total foto galeri menjadi 18 foto.

**Verifikasi layout grid:**
- Grid ponsel (2 kolom) dan desktop (4 kolom) diverifikasi ulang terhadap fungsi `assertNoGridGaps()`. Susunan baru tidak menyisakan celah/gap baris kosong di tengah grid dan lolos assertion build Next.js.

---

## Container system terpusat (max-w: 1440px) dan perlakuan ultrawide

**Keputusan:** seluruh halaman undangan dibatasi lebar maksimum 1440px (`max-w-page`) di tengah layar (`mx-auto`) untuk viewport ultrawide (>1440px). Area luar (gutter) di ultrawide memakai warna matte linen hangat (`--color-matte: #e4ded2`, berasal dari acuan warna latar bundler mockup yang disetujui) dipadukan dengan tekstur motif damask botani melati yang diulang rapi (`public/patterns/botanical-damask.jpg`) dan elevasi multi-layer shadow (`shadow-page`).

**Alasan:** pada layar ultrawide (1920px, 2560px, 3440px), layout tanpa batas lebar menyebabkan foto prewedding ter-crop menjadi sangat pipih/ekstrem, ornamen sudut (sulur) terpisah ribuan piksel dari konten teks, dan grid galeri menjadi raksasa. Batas 1440px dipilih karena pas dengan lebar viewBox aset SVG wave (`viewBox="0 0 1440 120"`) dan resolusi desktop referensi. Gutter hitam/espresso ditolak karena terlalu kontras/gelap terhadap mayoritas halaman yang bernuansa krem gading; border garis fisik 1px juga ditolak karena memunculkan garis putih/terang yang mengganggu.

**Ditolak:**
1. Membiarkan halaman meluas penuh 100vw di ultrawide (membuat rasio foto dan grid rusak).
2. Latar gutter hitam pekat/espresso (terlalu gelap dan jarring saat melihat seksi terang).
3. Border garis vertikal di tepi container (terlihat seperti garis putih/artifak yang mengganggu).
4. Warna gutter terlalu gelap seperti `#cbbca2` (dites dan ditolak pengguna karena terlalu gelap).

---

## Ornamen botani emas transisi wave berbasis AI (Dicabut — Kembali ke SVG Original)

**Keputusan:** eksperimen penambahan aset raster ornamen bunga & sulur botani foil emas (`public/ornaments/gold-floral-spray.webp`) pada pembatas wave Sampul dicabut atas permintaan pengguna ("revert aja deh si asset nya, pake original"). Seluruh aset raster di `public/ornaments/` dihapus, dan tampilan pembatas wave dikembalikan 100% ke implementasi SVG original ganda (`#wave` di `components/ornaments.tsx`).

**Alasan pencabutan:** mempertahankan konsistensi sistem ornamen SVG inline original yang sudah disetujui tanpa menambah layer aset gambar raster eksternal.

---

## Seksi Detail Acara: Satu Venue, Peta Tersemat, dan Integrasi Kalender Ganda

**Keputusan:**
1. **Satu Venue:** Akad dan Resepsi disajikan dalam satu seksi tanpa menduplikasi alamat dan peta, sesuai PRD §4.2. Di ponsel disajikan dalam grid waktu 2 kolom (Akad & Resepsi) diikuti blok Lokasi; di desktop disajikan dalam susunan 3 kolom sejajar (Akad | Resepsi | Lokasi).
2. **Peta Tersemat:** Iframe Google Maps interaktif disematkan langsung untuk Steikhaus Bandung dengan `loading="lazy"`. Wadah peta diberi latar garis diagonal arsitektural `#2A1F15` dan border emas halus `border-[rgba(201,162,39,0.45)]` sebagai fallback estetis saat loading.
3. **Integrasi Kalender Universal:** Tombol "Simpan ke Kalender" menyediakan menu popover dengan 2 opsi: tautan langsung ke Google Calendar URL (pre-filled untuk tamu Android/PC) dan berkas `.ics` (iCalendar standard via dynamic Blob download untuk Apple Calendar di iPhone/macOS atau Outlook).
4. **Warna & Kontras Gelap:** Seluruh seksi menggunakan latar `#1A120B` (`bg-espresso`), teks `#E8DCC4`, `#F6EFE6`, `#C6B79B`, serta garis emas ganda gradien. Emas tidak pernah dipakai untuk teks isi.

**Alasan:**
Memberikan kejelasan waktu dan navigasi lokasi tanpa redundansi bagi tamu undangan. Penanganan kalender ganda (Google Cal + .ics) menghilangkan hambatan teknis bagi tamu dengan berbagai platform perangkat.

**Ditolak:**
1. Mengulang alamat/peta terpisah untuk Akad dan Resepsi (membingungkan tamu dan memboroskan ruang vertikal).
2. Menggunakan hanya link Google Calendar tanpa file `.ics` (menyulitkan pengguna iOS/Apple Calendar yang tidak memasang Google Calendar).
3. Hanya tombol tautan tanpa peta embed langsung (kurang informatif sebelum tamu memutuskan membuka aplikasi navigasi luar).

---

## Interaksi "Buka Undangan": Kunci Scroll, Smooth-Scroll ke Seksi Ayat, dan Pemutar Musik Latar

**Keputusan:**
1. **Gerbang Sampul:** Halaman undangan awalnya mengunci scroll (`overflow: hidden` pada html & body, serta `<main>` dengan `h-dvh overflow-hidden`), sehingga tamu tidak bisa menggulir melewati Sampul sebelum menekan tombol "Buka Undangan" (PRD §4.2).
2. **Transisi Pembukaan:** Saat tombol "Buka Undangan" ditekan, kunci scroll dilepas (`overflow: visible/normal`), lalu halaman melakukan `smooth-scroll` sinematik berbasis `requestAnimationFrame` dengan kurva *spring-like ease-in-out cubic* sepanjang 1,5 detik (1500ms) ke seksi Ayat (`#ayat`). Tidak memakai `scrollIntoView` bawaan browser yang berdurasi terlalu singkat (~300ms) dan terasa instan. Sampul tetap bertahan di bagian atas sebagai seksi 1 dengan transisi wave ganda ke seksi Ayat.
3. **Musik Latar:** Berkas audio gamelan Sunda Sabilulungan (`/audio/sabilulungan.mp3`) dimuat dengan `preload="none"` (tidak diunduh saat muat awal halaman untuk menjaga performa koneksi 4G, PRD §7.1). Pemutaran dipicu langsung oleh gestur klik pengguna pada tombol "Buka Undangan" sehingga diizinkan oleh kebijakan autoplay browser (termasuk iOS Safari).
4. **Tombol Kontrol Mengambang (Floating Music Button):** Muncul mengambang di kanan bawah (`bottom-5 right-5` pada ponsel, `bottom-8 right-8` pada desktop, dan terkunci rapi di dalam container `max-w-page` pada ultrawide >1440px via `min-[1441px]:right-[calc((100vw-1440px)/2+2rem)]`). Tombol berbentuk lingkaran bernuansa gelap-emas (`bg-espresso/85`, border `border-gold-bright/70`) dengan ikon speaker universal (gelombang suara saat memutar, garis silang saat jeda/mati), memenuhi standar aksesibilitas WCAG dan PRD §7.3.

**Alasan:**
Menopang tiga fungsi utama gerbang sampul sesuai PRD §4.2 (momen pembukaan personal, izin pemutaran audio di browser, penyaringan bot preview pesan). Pilihan mempertahankan Sampul di atas dengan smooth-scroll (bukan overlay yang menghilang) menjaga keutuhan transisi visual wave ganda ke seksi Ayat dan memungkinkan tamu melihat kembali nama mereka kapan saja dengan scroll ke atas.

**Ditolak:**
1. Sampul sebagai modal/overlay fullscreen yang di-unmount/slide-up menghilang (menghilangkan transisi pembatas wave emas ganda ke seksi Ayat yang sudah diapprove klien).
2. Preload audio saat page load (membebani kuota dan memperlambat LCP/FCP di jaringan 4G seluler).
3. Ikon musik berbentuk piringan hitam tanpa indikator status yang jelas (kurang ramah bagi tamu kerabat orang tua dibandingkan ikon speaker standar).
4. `scrollIntoView({ behavior: 'smooth' })` bawaan browser — durasinya terlalu singkat (~300ms) sehingga transisi terasa instan/tersentak alih-alih lembut dan elegan.

---

## Seksi RSVP: Formulir Konfirmasi Kehadiran, Pendamping Terbuka, dan Umpan Balik

**Keputusan:**
1. **Pilihan Kehadiran & Pendamping:** Radio buttons dengan kartu klik penuh (`accent-gold-deep`, border emas ganda, latar `bg-white/50`). Opsi "Membawa Pendamping?" dan input "Nama Pendamping" ditampilkan kondisional hanya jika tamu memilih "Ya, saya akan hadir".
2. **Ketiadaan Pembatas Plus-One:** Sesuai PRD §2.4 dan keputusan terkunci sebelumnya, formulir tidak menyertakan batasan kuota, counter, atau sakelar penolak. Semua tamu yang hadir bebas memilih membawa pendamping.
3. **Umpan Balik & Fleksibilitas Perubahan:** Setelah form disubmit, formulir berganti menjadi kartu konfirmasi berornamen emas dengan ucapan apresiasi dinamis ("Kami menantikan kehadiran Anda" / "Terima kasih atas doa restunya") serta tombol "Ubah Konfirmasi" sehingga tamu dapat memperbarui jawabannya kapan saja (PRD §4.3).
4. **Pesan Batas Anjuran:** Keterangan waktu di bawah judul seksi beradaptasi secara otomatis terhadap tanggal `2026-09-26` (`suggestedDeadline`). Menampilkan permohonan sebelum batas waktu, dan berubah menjadi permohonan segera jika tanggal telah terlewat tanpa memblokir pengiriman formulir.

**Alasan:**
Menyediakan pengalaman konfirmasi yang ramah, sopan, dan minim hambatan bagi tamu segala usia, sekaligus memenuhi spesifikasi visual mockup dan ketentuan bisnis di PRD §4.3.

**Ditolak:**
1. Memblokir pengiriman formulir setelah batas 26 September (bertentangan dengan PRD §4.3: formulir tetap terbuka sampai hari-H).
2. Input dropdown select untuk kehadiran/pendamping (radio kartu lebih mudah disentuh di layar ponsel tanpa membuka native picker).

---

## Seksi Buku Tamu: Formulir Ucapan & Doa, Atribusi Nama Tamu, dan Ornamen Sudut

**Keputusan:**
1. **Atribusi & Fleksibilitas Nama:** Sesuai konfirmasi pengguna pada sesi ini, field input nama ("Nama Anda") disediakan dengan nilai bawaan yang otomatis terisi dari prop nama tamu (`guestName`), namun tetap dapat diedit/disesuaikan jika tamu ingin mencantumkan sapaan tertentu atau menyertakan nama keluarga.
2. **Formulir & Validasi:** Menggunakan border bawah emas tipis untuk input nama, textarea semi-transparan (`bg-white/50`) dengan batas maksimal 500 karakter (`maxMessageLength`), serta tombol "Kirim Ucapan" berbingkai emas dengan efek hover elegan.
3. **Daftar Ucapan & Penanda Waktu:** Menampilkan nama pengirim dengan font Cormorant Garamond (`text-buku-name`), penanda waktu relatif kapital berspasi lebar dengan font Crimson Pro (`text-buku-when`), serta teks doa dengan Crimson Pro (`text-buku-msg`). Tiap entri dipisahkan oleh garis emas halus ganda (`border-gold-bright/40`).
4. **State Lokal & Data Awal:** Menampilkan 3 ucapan awal yang ditranskrip persis dari mockup (`guestBookInitialEntries` di `lib/event-config.ts`), dan ucapan baru langsung dimasukkan secara instan ke urutan teratas ("Baru saja") di state lokal sebelum integrasi basis data Firestore di seksi terpisah (PRD §4.4: "Moderasi: Tidak ada — ucapan langsung tampil").
5. **Ornamen & Latar:** Menggunakan latar krem hangat sekunder `#F2E8D8` (`bg-cream-secondary`) dengan pemisah garis atas emas `border-t border-gold-bright/35`, ornamen sulur tunggal di kiri bawah pada ponsel (`110x110`, opacity 0.4, scaleY(-1)), serta sepasang sulur di kiri dan kanan bawah pada desktop (`170x170`, opacity 0.34). Posisi vertikal sulur menggunakan `bottom-[6px]` (bukan nilai negatif `-bottom-[16px]` seperti di wireframe mockup) agar kelopak bunga melati pada ujung sulur tidak terpotong (clipped) oleh batas `overflow-hidden` seksi Buku Tamu di atas seksi Hadiah.

**Alasan:**
Menyelaraskan ketentuan PRD §4.4 dengan desain mockup visual yang telah disetujui klien, sekaligus memberi kebebasan tamu untuk memperjelas nama mereka tanpa kehilangan kemudahan atribusi otomatis.


---

## Seksi Hadiah: Tanda Kasih Statis, Salin Nomor Rekening, dan Umpan Balik Visual

**Keputusan:**
1. **Penyajian Statis:** Menampilkan nomor rekening bank digital Blu (BCA Digital) a.n. Septyara Khotimaharani (`giftConfig.account` di `lib/event-config.ts`) secara statis dengan nada santun yang tidak menonjol ("Kehadiran dan doa Anda sudah lebih dari cukup. Bila ingin mengirim tanda kasih, kami sediakan kanal berikut.") sesuai PRD §4.8.
2. **Aksi Salin Nomor & Umpan Balik:** Tombol "Salin nomor" menyalin nomor rekening ke clipboard (`navigator.clipboard.writeText`) dengan fallback `textarea` seleksi otomatis untuk kompatibilitas lintas peramban/izin. Saat berhasil, teks tombol berubah menjadi "Nomor tersalin" (`aria-live="polite"`) selama 2,2 detik (2200ms) sebelum kembali ke kondisi semula.
3. **Tipografi & Desain:** Ditranskrip persis dari mockup yang diapprove (`docs/mockup/Undangan Alwi & Septy.html`, seksi 10). Latar krem gading `#F7EFE1` (`bg-cream`) menyambung secara serasi setelah seksi Buku Tamu, dihiasi ornamen atas `#orn` (110×16px di ponsel, 160×20px di desktop), nomor rekening berfont Cormorant Garamond besar (`text-hadiah-account` 24px/34px), serta bingkai kartu atas-bawah dengan garis emas `border-gold-bright/55`.
4. **Batas Cakupan:** Tidak ada mekanisme amplop digital, pencatatan transaksi, atau input nominal (PRD §4.8 & §10).

**Alasan:**
Menyediakan fasilitas praktis bagi tamu yang berhalangan hadir atau ingin memberi tanda kasih tanpa menambah kerumitan alur UX maupun beban jadwal teknis.

**Ditolak:**
1. Fitur pencatatan amplop digital atau konfirmasi transfer (ditolak di PRD §4.8 & §10 karena membebani jadwal dan menambah gesekan bagi tamu).
2. Tampilan nomor rekening yang mencolok atau bernada menuntut (ditolak di PRD §4.8).

---

## Seksi Penutup: Ucapan Terima Kasih, Doa Restu, Monogram Berapit Spray, dan Nama Keluarga

**Keputusan:**
1. **Penyajian & Geometri Mockup:** Seksi Penutup (Seksi 11, PRD §4.2 item 11) ditranskrip persis dari rancangan mockup yang disetujui (`docs/mockup/Undangan Alwi & Septy.html`). Menggunakan latar gelap cokelat espresso `#1A120B` (`bg-espresso`) dengan padding `pt-[60px] pb-[66px] px-8` (ponsel) dan `lg:pt-24 lg:pb-[104px] lg:px-10` (desktop).
2. **Sistem Ornamen Sulur:** Pada ponsel, menggunakan 2 ornamen sulur diagonal (`#sulur` 120×120px, opacity 0.45 di kiri atas dan kanan bawah dengan rotasi 180°). Pada desktop, menggunakan 4 ornamen simetris di tiap sudut: kiri atas & kanan atas (180×180px, opacity 0.45) serta kiri bawah & kanan bawah (150×150px, opacity 0.35), menciptakan bingkai botani yang seimbang.
3. **Monogram & Aksen Daun (Spray):** Menampilkan monogram resmi Alwi & Septy varian emas (`monogram.gold`, `/logo/monogram-gold.png`) atas permintaan pengguna. Berkas master emas dari Downloads (`file_00000000a86c820b9d8ad558ce9379b4.png`) yang aslinya berlatar putih solid telah diisolasi transparansinya (alpha matting + un-premultiplication bebas halo putih) dan diproporsikan persis setara optis monogram putih (dimensi 635×700) dengan tinggi 49px pada ponsel dan 87px pada desktop, diapit sepasang aksen daun SVG `#spray` (56×28px pada ponsel, 110×54px pada desktop, opacity 0.9).
4. **Sentralisasi Konten:** Kalimat ucapan rasa bahagia & doa restu, salam penutup, serta nama kedua keluarga mempelai (`Kel. Dadang Sukandi · Kel. Uun Syukur`) disimpan terpusat di `lib/event-config.ts` (`closingConfig`), memanfaatkan nama ayah dari `couple.groom.father` dan `couple.bride.father` untuk menjaga *single source of truth*.
5. **Pemetaan Warna & Tipografi:** Teks ucapan dan nama keluarga menggunakan token `--color-label-on-dark` (`#E8DCC4`, rasio kontras 13.7:1 AAA terhadap `#1A120B`), sedangkan salam Wassalamu'alaikum memakai `--color-tertiary-on-dark` (`#C6B79B`, rasio kontras 8.4:1 AAA). Tipografi didaftarkan sebagai token `@utility` baru di `app/globals.css` (`text-penutup-msg(-lg)`, `text-penutup-wassalam(-lg)`, dan `text-penutup-family(-lg)`).

**Alasan:**
Memberikan penutup visual yang hangat, elegan, dan megah dengan bingkai gelap espresso yang mengimbangi layar Sampul di awal halaman, sesuai kaidah desain yang disepakati (aksen gelap proporsional).

**Ditolak:**
---

## Seksi 4 Mempelai: Tata Letak, Penanganan Gelar Akademik, dan Placeholder Foto Sementara

**Keputusan:**
1. **Implementasi Lebih Awal dari Status Terkunci:** Atas permintaan pengguna ("kerjakan saja yang terkunci, tapi kasih notes gambar & konten bisa berubah"), Seksi Mempelai diimplementasikan sebelum tersedianya foto solo resmi dari klien.
2. **Penyajian Placeholder Foto 3:4 yang Elegan:** Menggunakan pola placeholder dari mockup yang disetujui (`docs/mockup/Undangan Alwi & Septy.html`, seksi 4) yaitu kotak berasio 3:4 dengan motif arsir halus (`bg-mempelai-placeholder`) berbingkai garis emas ganda (`border border-gold-bright` dan `lg:outline lg:outline-1 lg:outline-gold-bright/35 lg:outline-offset-8`). Menampilkan teks penanda ukuran dan label `(sementara)` yang fleksibel jika nanti tautan foto dimasukkan ke `couple.groom.photo` / `couple.bride.photo`.
3. **Uji Penanganan Nama Panjang Bergelar pada Layar 390px:** Sesuai arahan `docs/spesifikasi-arah-desain.md` §5, nama lengkap bergelar *Mochamad Ilham Alwi Rifa, S.T.* dan *Septyara Khotimaharani, S.Pd.* diuji ketat di viewport 390px. Nama dipisah menjadi bagian depan dan bagian penutup bergelar (`whitespace-nowrap`) sehingga pemenggalan baris terjadi secara alami antara baris nama dan gelar tanpa memutuskan singkatan gelar (misal `Rifa, S.T.` dan `Khotimaharani, S.Pd.` selalu utuh di satu baris).
4. **Tata Letak Responsif:**
   - **Ponsel:** 1 kolom vertikal bertumpuk dipisah oleh pembatas horizontal garis gradien emas mengapit simbol ampersand `&` (*Cormorant Garamond* italic). Ornamen sulur `#sulur` dipasang di sudut kanan atas (110×110px, opacity 0.45).
   - **Desktop:** Grid 3 kolom sejajar (`grid-cols-[1fr_88px_1fr]`), di mana kolom tengah memuat garis gradien emas vertikal atas-bawah (panjang 80px) mengapit simbol ampersand `&` (*Cormorant Garamond* 34px). Ornamen sulur dipasang simetris di sudut kiri dan kanan atas (170×170px, opacity 0.4).
5. **Sentralisasi Konten & Catatan:** Seluruh teks nama, gelar, panggilan, orang tua, dan catatan disclaimer ("* Foto dan detail profil bersifat sementara dan dapat disesuaikan kembali.") disimpan terpusat di `lib/event-config.ts` (`couple` dan `mempelaiConfig`). Tipografi didaftarkan sebagai token `@utility` baru di `app/globals.css` (`text-mempelai-parents(-lg)`, `text-mempelai-nickname`, `text-mempelai-ampersand(-lg)`, `text-mempelai-note(-lg)`, dan `bg-mempelai-placeholder(-lg)`).

**Alasan:**
Memungkinkan pengerjaan seksi terus bergerak maju tanpa menunggu foto solo, sembari memastikan struktur visual, ritme spasi, dan hierarki tipografi sudah terpasang sempurna dan cocok dengan mockup approved.

---

## Seksi 5 Love Story: Linimasa 4 Momen Sementara, Tata Letak Zig-Zag Desktop, dan Integrasi Posisi

**Keputusan:**
1. **Implementasi dengan Linimasa 4 Momen Sementara:** Berdasarkan arahan pengguna untuk mengerjakan seksi yang terkunci dengan catatan konten dapat berubah, Seksi Love Story (Seksi 5, PRD §4.2 item 5) diimplementasikan menggunakan 4 momen linimasa dari rancangan mockup yang disetujui (`docs/mockup/Undangan Alwi & Septy.html`): 2019 (Awal Perkenalan), 2021 (Menjalin Komitmen), 2025 (Lamaran), dan 2026 (Menuju Halal).
2. **Tata Letak Responsif:**
   - **Ponsel:** Daftar vertikal padat (`padding: 52px 30px 56px`, `gap: 26px`) dengan thumbnail foto berasio 1:1 (`78×78px`) di sebelah kiri berbingkai emas `border-gold-bright/80`, serta tahun (*Crimson Pro* 10px emas), judul (*Cormorant Garamond* 20px), dan narasi ringkas (*Crimson Pro* 14px) di sisi kanan. Ornamen sulur `#sulur` dipasang di kiri atas (112×112px, opasitas 0.4).
   - **Desktop:** Linimasa vertikal di tengah dengan garis gradien emas dan penanda belah ketupat/diamond (`h-[9px] w-[9px] rotate-45 bg-gold-deep`). Menggunakan pola berselang-seling zig-zag (`grid-cols-[1fr_96px_1fr]`): baris genap teks di kiri rata kanan dan thumbnail foto 4:3 (`230px`) di kanan rata kiri; baris ganjil thumbnail foto di kiri rata kanan dan teks di kanan rata kiri. Ornamen sulur dipasang di sudut kiri atas dan sudut kanan bawah dengan rotasi 180° (180×180px, opasitas 0.34).
3. **Penyempurnaan Posisi Seksi pada Halaman:** Komponen `<LoveStory />` disisipkan di antara `<Mempelai />` dan `<Galeri />` pada `components/invitation-experience.tsx`. Hal ini mengembalikan urutan seksi menjadi 100% lengkap dan persis sesuai urutan PRD §4.2 item 1 sampai 11.
4. **Sentralisasi Konten & Catatan:** Seluruh data 4 momen (dengan teks ringkas untuk ponsel dan narasi lengkap untuk desktop) disimpan di `lib/event-config.ts` (`loveStoryConfig`). Disertai catatan penjelas ("* Linimasa dan narasi cerita bersifat sementara dan dapat disesuaikan kembali.") serta dukungan slot foto jika nanti foto kenangan/dokumentasi dari klien dimasukkan. Tipografi didaftarkan sebagai token `@utility` baru di `app/globals.css` (`text-story-*`, `bg-story-placeholder(-lg)`).

**Alasan:**
Menjaga konsistensi alur visual undangan digital, memenuhi wireframe mockup yang telah disetujui klien, dan mempermudah penggantian naskah/foto di kemudian hari tanpa perlu mengubah struktur layout komponen.

**Ditolak:**
1. Mengubah struktur linimasa menjadi format carousel horizontal (mockup approved menggunakan alur vertikal yang serasi dengan ritme scroll halaman undangan).
2. Menghilangkan seksi Love Story dari alur halaman (PRD §4.2 secara eksplisit mensyaratkan Love Story di antara Mempelai dan Galeri).

---

## Setup Firebase & Lapisan Akses Data Server-Side (Firestore Admin SDK)

**Keputusan:**
1. **Project & Region:** Firebase project baru dibuat khusus untuk acara ini dengan ID `wedding-alwi` (*Wedding Alwi Septy*). Firestore database dibuat dalam mode *Firestore Native* pada region `asia-southeast2` (Jakarta) untuk menjamin latensi akses paling rendah bagi tamu di Indonesia.
2. **Keamanan & Server-Only Database Access:** Sesuai prinsip yang dikunci di `AGENTS.md` ("Akses basis data hanya dari server. Klien tidak pernah memegang kredensial baca langsung"), aturan `firestore.rules` dikunci default (`allow read, write: if false;`). Seluruh interaksi database dilakukan melalui `firebase-admin` singleton (`lib/firebase-admin.ts`) yang berjalan di server runtime.
3. **Manajemen Kredensial:** Kredensial *service account key* (`firebase-adminsdk-fbsvc@wedding-alwi.iam.gserviceaccount.com`) dimuat melalui variabel lingkungan (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`) di `.env.local` (terlindungi oleh `.gitignore`) dengan template dokumentasi di `.env.example`.
4. **Pemisahan Kunjungan Nyata & Bot Preview:** Sesuai PRD §4.5, bot perayap pratinjau (WhatsApp, Telegram, dsb.) dideteksi melalui pola user-agent (`lib/bot-detection.ts`) dan dicatat terpisah ke `autoVisitCount` tanpa menambah metrik `openCount`. Pembukaan nyata hanya dihitung saat tombol buka sampul ditekan.
5. **Ketahanan Indeks Komposit:** Query daftar pesan Buku Tamu (`isHidden == false`, `orderBy createdAt desc`) didaftarkan ke `firestore.indexes.json` dan dideploy ke cloud, disertai mekanisme fallback *in-memory sorting* di `lib/db/messages.ts` agar aplikasi tetap 100% stabil tanpa error 500 saat indeks Firestore sedang dalam masa *building*.

**Alasan:**
Mencegah kebocoran data tamu dan kredensial database ke browser publik, menjaga akurasi pelacakan buka undangan dari distorsi crawler WhatsApp, serta memenuhi seluruh ketentuan keamanan dan skalabilitas pada PRD §4.1, §4.3, §4.4, §4.5, dan §7.2.

**Ditolak:**
1. Memberikan Firebase Web SDK / API key publik langsung di frontend untuk baca/tulis Firestore (rentan manipulasi token tamu, spam RSVP/buku tamu, dan pembobolan kuota).
2. Menyimpan berkas JSON service account mentah di dalam repository proyek (berisiko bocor saat commit).

---

## Rute Dinamis `/[guestSlug]`, Pelacakan Buka Undangan, dan Penyaringan Bot WhatsApp

**Keputusan:**
1. **Dynamic Route `/[guestSlug]` (`app/[guestSlug]/page.tsx`):**
   - Menangani URL personal tamu dengan format `/{nama-slug}-{token-acak}` (misal: `/budi-santoso-a7f3k9m2`) sesuai PRD §4.1.
   - Mengambil data tamu dari Firestore via `getGuestByFullSlug(fullSlug)` di sisi server (SSR).
   - Menghasilkan metadata OpenGraph dinamis untuk pratinjau chat WhatsApp (nama tamu terpampang jelas di thumbnail/teks pengantar, PRD §4.6).
   - Mencegah seluruh pengindeksan mesin pencari via `robots: { index: false, follow: false, nocache: true }` di metadata halaman serta aturan universal `Disallow: /` pada `app/robots.ts` (PRD §4.1).
2. **Penyaringan Kunjungan Bot WhatsApp Preview vs Pembukaan Nyata (PRD §4.5):**
   - Saat link dikirim di chat, sistem perayap preview WhatsApp (user-agent: `WhatsApp/...`) mengambil halaman secara otomatis sebelum penerima menyentuh apapun. Kunjungan ini dideteksi via `isBotUserAgent(userAgent)` saat SSR dan dicatat terpisah ke `autoVisitCount` tanpa menambah metrik `openCount` tamu nyata.
   - Pembukaan nyata **hanya** dicatat saat tamu sungguhan menekan tombol **"Buka Undangan"** di layar Sampul melalui Server Action `trackGuestOpenAction(guestId, clientDeviceId)`.
3. **Indikator Penerusan Link (Deteksi Perangkat Unik):**
   - Menghasilkan anonymous hash SHA-256 (`deviceHash`) berbasis `clientDeviceId` (disimpan di `localStorage` peramban) dipadukan dengan IP dan User-Agent tanpa menyimpan data pribadi (PII).
   - Disimpan ke array Firestore `uniqueDevices` via `FieldValue.arrayUnion`. Jika tamu membuka berulang kali di perangkat yang sama, hitungan `uniqueDevices` tidak bertambah; jika link diteruskan ke perangkat baru, `uniqueDevices` bertambah dan dapat dipantau anomali penerusannya di dashboard admin.
4. **Halaman 404 Generik (`app/not-found.tsx`):**
   - Jika link tidak ditemukan atau token salah, Next.js memanggil `notFound()` yang merender halaman bertema krem dengan ornamen `#orn` dan pesan santun tanpa membocorkan status apakah link pernah ada atau tidak (PRD §4.1).
5. **Eksekusi Asinkron Non-Blocking:**
   - Pemanggilan Server Action pelacakan buka pada klik tombol berjalan secara non-blocking di background, sehingga tidak pernah menghambat atau menunda transisi visual gulir halus (smooth-scroll) maupun pemutaran musik latar.

**Alasan:**
Memenuhi requirement fungsional PRD §4.1, §4.5, dan §4.6 secara presisi dengan keandalan data 100%, menjaga performa UX pengguna tetap instan, dan memisahkan kunjungan crawler dari statistik kehadiran aktual.

**Ditolak:**
1. Mencatat `recordGuestOpen` pada saat GET/load halaman pertama (akan merusak metrik karena perayap WhatsApp preview otomatis memicu GET).
2. Mengharuskan PIN atau login tamu (ditolak di PRD §4.1 karena friksi UX).



---

## Integrasi RSVP ke Firestore: Kredensial `fullSlug`, Validasi Server, dan Ringkasan Jawaban

**Keputusan:**

1. **Tamu diidentifikasi lewat `fullSlug`, bukan Firestore document ID.** Server Action `submitRsvpAction` (`app/actions/rsvp.ts`) menerima `fullSlug` dari URL undangan, lalu meresolusinya sendiri ke dokumen tamu. Ini berbeda dari `trackGuestOpenAction` yang sudah ada dan memakai `guestId`.
   Alasannya: model keamanan produk ini adalah **kepemilikan link** (PRD §4.1 — link boleh diteruskan, PIN ditolak). Token pada URL memang kredensial yang sah untuk menulis atas nama tamu; document ID hanyalah pengenal internal yang kebetulan terekspos ke klien. Kalau document ID cukup untuk menulis RSVP, maka bocornya ID dari sumber lain (log, dashboard, bug) langsung berarti kemampuan memalsukan jawaban. `trackGuestOpenAction` sengaja tidak diubah di sesi ini — ia hanya menaikkan penghitung, bukan menulis data yang dikirim tamu.

2. **Seluruh validasi ditegakkan di server, bukan hanya di formulir.** Server Action adalah endpoint HTTP publik: payload apa pun bisa dikirim tanpa melewati React. Yang divalidasi: bentuk tipe tiap field (bukan-string/objek/null ditolak atau dibuang), `attendance` harus salah satu dari dua nilai sah, nama pendamping wajib bila membawa pendamping, batas panjang nama pendamping (80) dan catatan (500). `lib/db/rsvp.ts` memotong ulang panjangnya sebagai pertahanan lapis kedua bila kelak dipanggil dari admin panel atau skrip seeding.
   Diuji dengan 14 payload adversarial yang dikirim langsung ke action tanpa melewati form — semuanya berperilaku sesuai harapan.

3. **Aturan pendamping dinormalisasi di server, bukan dipercayakan ke klien.** Bila `attendance` bukan `attending`, `plusOne` dipaksa `false` dan nama pendamping dibuang, berapa pun yang dikirim klien. Ini **bukan** pembatas kuota — tidak ada penghitung, kuota, atau keadaan "penuh" di mana pun (PRD §2.4). Yang ditegakkan hanya konsistensi logis: tidak mungkin membawa pendamping ke acara yang tidak dihadiri.

4. **`submittedAt` menandai pengiriman pertama dan tidak pernah bergeser; `updatedAt` yang bergerak.** Setiap pengiriman — pertama maupun perubahan — menambah satu dokumen baru ke subkoleksi `rsvpHistory` yang tidak pernah ditimpa, disertai penanda `isFirstSubmission` (PRD §7.2 "riwayat perubahan").

5. **Kartu konfirmasi menampilkan ringkasan jawaban tersimpan** ("Hadir · bersama 1 pendamping (Nama)" beserta catatan bila ada), bukan hanya teks terima kasih generik. Diputuskan user 6 Sep 2026 setelah ditawari dua opsi. Ini penambahan visual pada seksi yang sudah lolos verifikasi, jadi disengaja dan dicatat. Utility tipografi baru `text-rsvp-summary(-lg)` ditambahkan di `app/globals.css` — sengaja lebih rapat dan bertracking ringan supaya terbaca sebagai data tercatat, bukan sebagai prosa.

6. **Placeholder kolom catatan diubah dari "Doa atau pesan untuk kami" menjadi "Alergi makanan atau kebutuhan khusus".** Diputuskan user 6 Sep 2026. PRD §4.3 menyebut kolom ini untuk hal seperti alergi makanan, sementara doa dan pesan sudah punya seksi Buku Tamu sendiri. Copy lama membuat tamu menulis doa di dua tempat dan informasi katering tidak pernah terkumpul. **Perubahan copy ini menyimpang dari mockup yang diapprove mempelai** — perlu dikonfirmasi ulang ke mereka.

7. **Pesan galat memakai aksen emas, bukan warna galat baru.** Palet yang dikunci dari mockup tidak punya warna merah/galat, dan menambah satu berarti memperkenalkan warna di luar sistem hanya untuk kasus tepi. Notice galat memakai `border-gold-deep` + `bg-white/70` + `text-ink` — semuanya token yang sudah ada.

8. **Rejeksi promise di dalam `startTransition` wajib ditangkap.** Ditemukan lewat pengujian jaringan mati: Server Action punya `try/catch` sendiri, tetapi kegagalan transport menolak promise-nya sebelum kode server sempat jalan. Rejeksi yang lolos dari `startTransition` diperlakukan React sebagai galat render dan **mengganti seluruh halaman undangan** dengan layar "This page couldn't load" — bukan hanya menggagalkan seksi RSVP. Untuk tamu di jaringan 4G yang tidak stabil, ini kegagalan yang mahal. Diperbaiki dengan `try/catch` di dalam transition; setelah perbaikan, halaman tetap utuh, isian form terjaga, dan kirim ulang berhasil begitu sinyal kembali.

**Alasan:**
Memenuhi PRD §4.3 (kehadiran, pendamping tanpa kuota, nama pendamping untuk tata kursi, catatan, jawaban dapat diubah kapan saja lewat link yang sama) dan §7.2 (riwayat perubahan), sambil menjaga ketentuan `CLAUDE.md` bahwa seluruh input divalidasi di server dan seluruh konten acara terpusat di berkas config.

9. **Penyimpanan dijalankan dalam satu transaksi Firestore** (`db.runTransaction`), bukan dua penulisan berurutan. Ditemukan oleh review adversarial dan `/code-review` secara terpisah, keduanya sepakat. Dua alasan, keduanya nyata karena link boleh diteruskan sehingga dua perangkat bisa mengirim bersamaan:
   - **Atomik.** Kalau pembaruan dokumen tamu dan penulisan riwayat terpisah dan hanya yang kedua gagal, jawaban tamu **sudah** tersimpan tetapi tamu diberi tahu "Konfirmasi belum tersimpan" — kebalikan dari kenyataan. Tamu mengirim ulang, dan karena `submittedAt` sudah ada, riwayat pengiriman pertamanya hilang permanen (`isFirstSubmission: false` pada satu-satunya baris riwayat).
   - **Serialisasi baca-tulis.** Tanpa transaksi, dua pengiriman bersamaan sama-sama membaca dokumen kosong dan sama-sama menandai dirinya pengiriman pertama.
   ID dokumen riwayat sengaja dibuat **sebelum** transaksi supaya percobaan ulang akibat contention mendarat di dokumen yang sama, bukan menghasilkan baris riwayat ganda. Diuji live: dua pengiriman bersamaan menghasilkan tepat 2 baris riwayat dengan tepat 1 bertanda pengiriman pertama.

10. **"Pertama" ditentukan oleh ada-tidaknya map `rsvp`, bukan oleh field `submittedAt` di dalamnya.** Dokumen hasil impor atau seeding bisa punya map `rsvp` tanpa `submittedAt`; kalau itu dianggap pengiriman pertama, waktu respons asli tamu tertimpa diam-diam.

11. **Pengiriman dimatikan di rute `/` (tanpa data tamu).** Diputuskan user 6 Sep 2026. Sebelumnya rute pratinjau menampilkan kartu "Terima kasih atas konfirmasinya" lengkap padahal tidak ada yang ditulis ke mana pun — ditandai oleh 3 dari 5 lensa review. Skenario nyatanya: link yang terpotong saat diteruskan lewat WhatsApp, atau tamu yang mengetik domain telanjang, lalu mengira dirinya sudah terhitung. Sekarang tombol kirim dinonaktifkan dan ada keterangan "Mode pratinjau" yang hanya muncul di rute itu. Konsekuensinya: meninjau tampilan kartu konfirmasi kini butuh link tamu uji, tidak bisa lewat `/` saja.

12. **Tombol "Batal" pada mode ubah.** Diputuskan user 6 Sep 2026. Tanpa itu, tamu yang menekan "Ubah Konfirmasi" sekadar untuk melihat jawabannya terjebak di formulir sampai ia mengirim ulang atau memuat ulang halaman. Tombol hanya muncul bila tamu memang sudah punya jawaban tersimpan, sehingga tampilan bagi tamu baru tidak berubah sama sekali (diverifikasi ulang di 390px dan 1280px).

13. **`text-rsvp-summary` memakai `font-weight: 400`, bukan 500.** Crimson Pro hanya dimuat pada bobot 300/400/600 (`app/layout.tsx`); bobot 500 akan disintesis browser. Pembedaan dari prosa 300 di sekitarnya dibawa oleh bobot 400 plus tracking, bukan oleh bobot yang tidak tersedia.

**Ditolak:**
1. Memakai `guestId` sebagai kredensial tulis RSVP (lihat butir 1).
2. Menambah warna merah/galat ke palet hanya untuk notice kegagalan (lihat butir 7).
3. Menambah `revalidatePath` setelah simpan — halaman `/[guestSlug]` sudah dirender dinamis (memakai `headers()`), jadi tidak ada cache yang perlu dibatalkan.
4. Membiarkan kolom catatan bermaksud ganda sebagai doa sekaligus alergi (lihat butir 6).
5. Membedakan pesan galat "link tidak dikenali" dari galat koneksi. Pesan spesifik akan lebih menolong, tetapi membocorkan apakah sebuah link pernah ada — hal yang justru dijaga oleh halaman 404 generik (PRD §4.1). Dibiarkan generik; dicatat di sini agar tidak dilaporkan ulang sebagai temuan.

**Diketahui, sengaja tidak dikerjakan sesi ini:**
- Peralihan teks batas anjuran dihitung dari tanggal **UTC**, sehingga berganti pukul 07.00 WIB pada 27 September, bukan tengah malam. Kode ini sudah ada sebelum sesi ini dan hanya memengaruhi kalimat anjuran, bukan kemampuan mengirim formulir (tidak ada deadline keras — PRD §4.3).
- `rsvpHistory` tumbuh tanpa batas: pengiriman ulang yang isinya sama tetap menambah dokumen baru. Untuk 150 tamu, volumenya tidak bermasalah, dan pemangkasan justru bertentangan dengan tujuan jejak audit.

---

## Integrasi Buku Tamu ke Firestore: Polling Berkondisi, Transaksi Anti-Spam, dan Pemisahan Data Contoh

**Keputusan:**

1. **Real-time PRD §4.4 dipenuhi lewat polling Server Action, bukan listener Firestore di klien.** Diputuskan user 7 Sep 2026 setelah ditawari tiga opsi. PRD §4.4 minta ucapan baru muncul tanpa memuat ulang halaman, dan penyembunyian admin juga berlaku real-time. Cara paling langsung — `onSnapshot` dari Firebase Web SDK — menuntut klien memegang kredensial baca dan `firestore.rules` dibuka untuk koleksi `messages`. Itu **membalik keputusan terkunci** "akses basis data hanya dari server" (CLAUDE.md), menambah dependensi baru, dan membuka permukaan penyalahgunaan kuota. Yang dipilih: `fetchGuestMessagesAction` dipanggil berkala tiap 20 detik. Jedanya maksimal 20 detik, bukan instan — konsekuensi yang diterima secara sadar untuk buku tamu pernikahan, bukan ruang obrolan.

2. **Polling hanya berjalan saat seksi terlihat di layar DAN tab sedang aktif.** Digerbangi `IntersectionObserver` (rootMargin 200px) plus `visibilitychange`. Tanpa gerbang ini, 150 tamu yang membiarkan tab terbuka akan membaca Firestore terus-menerus sepanjang hari-H. Tamu hanya berhenti sebentar di seksi ini, jadi biaya nyatanya beberapa siklus per tamu, bukan ratusan. Terverifikasi live: ucapan baru muncul dan ucapan yang disembunyikan admin hilang, keduanya dalam 12 detik tanpa memuat ulang halaman.

3. **Paginasi memakai "limit yang tumbuh dari puncak", bukan cursor `startAfter`.** Ini terlihat boros dan memang membaca ulang halaman yang sudah dimuat, tetapi cursor tidak bisa memenuhi PRD §4.4. Cursor hanya mengambil **ekor** daftar; ucapan yang baru disembunyikan admin di tengah halaman yang sudah dimuat tidak akan pernah hilang dari layar tanpa memuat ulang halaman. Satu pembacaan dari puncak melayani dua ketentuan sekaligus — ucapan baru di atas dan penyembunyian di mana pun.

   Biayanya dijaga oleh dua hal yang berbeda, dan **memang harus dua**: `MAX_PAGE_SIZE` di lapisan data (pertahanan terhadap pemanggil bermusuhan) dan `maxPollWindow` di komponen (penyegaran berhenti bila jendela yang dimuat sudah besar — tamu itu sedang membaca arsip, bukan menunggu ucapan baru). Percobaan pertama sesi ini menggabungkan keduanya menjadi satu angka `MAX_PAGE_SIZE = 60`, dan itu **cacat**: `hasMore` dihitung terhadap limit yang sudah dijepit, sehingga begitu ucapan tampil melewati 60, server menjawab "masih ada" untuk halaman yang tidak akan pernah ia layani. Daftar beku di 60, tombol "Muat Ucapan Lainnya" tampil selamanya tanpa pernah menambah baris, ucapan ke-61 dan seterusnya tidak terjangkau tamu mana pun, dan setiap klik mati tetap dibayar 61 pembacaan. Ditemukan review adversarial oleh 5 lensa secara terpisah; pengujian saya melewatkannya karena data ujinya hanya 13 ucapan. Sekarang `MAX_PAGE_SIZE = 500`, sengaja **di atas** plafon produk sendiri (150 tamu × 3 ucapan = 450) supaya ia tidak pernah memotong data nyata.

   Ditambah **penjaga struktural** di `handleLoadMore`: bila satu pemuatan tidak menambah baris meski `hasMore` mengaku masih ada, `hasMore` dipaksa `false`. Ini membuat seluruh kelas bug "tombol berbohong" mustahil, apa pun nilai penjepitnya kelak. Diuji dengan 75 ucapan: rantai klik menembus 60 dengan benar, mencapai seluruh 75, lalu tombolnya berhenti jujur.

4. **Batas 3 ucapan dan jeda 30 detik ditegakkan dalam SATU transaksi Firestore.** Kode sebelumnya memakai `count()` lalu `set()` terpisah. Karena link boleh diteruskan (PRD §4.1), dua perangkat memang bisa mengirim bersamaan dari link yang sama: keduanya membaca "sudah ada 2" dan keduanya menulis, menghasilkan 4 ucapan pada batas 3. Pembacaan di dalam transaksi membuat Firestore menserialisasi keduanya. Diuji live dengan 4 pengiriman bersamaan: tepat 1 diterima, 3 ditolak, dan jumlah dokumen tersimpan persis sama dengan jumlah yang diterima.

5. **Satu pembacaan melayani dua aturan sekaligus.** Dokumen per tamu paling banyak 3, jadi mengambil semuanya (`where guestId ==`) lebih murah daripada `count()` plus query `orderBy` terpisah untuk mencari ucapan terakhir — dan tidak menuntut indeks gabungan baru yang harus menunggu masa *building* sebelum bisa dipakai.

6. **Jeda antar pengiriman 30 detik.** Diputuskan user 7 Sep 2026; PRD §4.4 mensyaratkan "jeda minimum" tanpa menyebut angka. Cukup menahan klik ganda dan spam skrip tanpa menghukum tamu yang tulus ingin menambah ucapan. Digabung batas 3 ucapan, permukaan spamnya sangat kecil. Selisih waktu negatif (jam server kita di belakang jam Firestore) diperlakukan sebagai "baru saja mengirim", bukan sebagai jeda yang sudah lewat.

7. **Ucapan yang disembunyikan admin TETAP menghitung jatah 3.** Penyembunyian adalah moderasi, bukan pengembalian jatah. Kalau dihitung ulang, tamu yang ucapannya disembunyikan justru mendapat kesempatan menulis ulang hal yang sama. Diuji live.

8. **3 ucapan contoh dari mockup hanya dipakai di rute pratinjau `/`.** Diputuskan user 7 Sep 2026. `guestBookInitialEntries` berisi nama fiktif (Rizky & Nadia, Keluarga Hernawati, Teh Yuli) yang ditranskrip dari mockup. Sebelum integrasi, entri itu tampil ke semua orang sebagai state lokal. Sejak sesi ini, rute tamu `/{slug}` hanya menampilkan data Firestore; kalau kosong, tampil *empty state* ("Belum ada ucapan. Jadilah yang pertama..."). Tamu sungguhan tidak boleh melihat ucapan yang tidak pernah ada. Rute `/` tetap memakainya supaya seksi masih bisa ditinjau visual tanpa data nyata.

9. **Pengiriman dimatikan di rute `/`, sama seperti RSVP.** Ucapan anonim tidak diterima sama sekali: batas 3 dan jeda 30 detik keduanya bersandar pada identitas tamu, jadi tanpa `guestId` tidak ada yang membatasi spam. Tombol kirim dinonaktifkan, ada keterangan "Mode pratinjau", dan ada penjaga terakhir di `handleSubmit` — diuji dengan memaksa `form.requestSubmit()` melewati tombol yang dinonaktifkan: tidak ada entri bertambah dan tidak ada notice sukses palsu.

10. **Kegagalan pemuatan dibedakan dari "belum ada ucapan".** `fetchGuestMessagesAction` mengembalikan `{ success: false }`, bukan daftar kosong. Kalau tidak, satu penyegaran yang gagal akan mengosongkan daftar yang sedang dibaca tamu dan tampak seperti seluruh buku tamu terhapus. Penyegaran yang gagal diam saja (tamu tidak meminta apa pun); "Muat Ucapan Lainnya" yang gagal menampilkan galat.

11. **Halaman pertama dirender di server, di dalam `try/catch`.** Daftar sudah terisi saat tamu sampai ke seksinya, bukan berkedip kosong. Kegagalan Firestore saat render **tidak boleh** menjatuhkan seluruh undangan: seksi cukup tampil kosong dan terisi pada penyegaran berikutnya.

12. **Penanda waktu relatif dihitung saat render dari satu acuan `nowMs`.** Satu acuan untuk seluruh baris supaya tidak ada baris yang memakai jam berbeda. Karena nilai awalnya juga dihitung saat render server, teksnya bisa berbeda beberapa milidetik dari hasil hidrasi klien — ditangani `suppressHydrationWarning` pada elemen penanda waktu saja, bukan pada seluruh daftar. Waktu di masa depan diperlakukan sebagai "Baru saja", bukan angka negatif.

13. **Formulir disembunyikan begitu jatah 3 habis**, diganti keterangan apresiasi. Tanpa itu, tamu mengetik ucapan keempat lalu baru ditolak setelah menekan kirim. Keadaan ini hanya bertahan selama sesi — memuat ulang halaman memunculkan formulir lagi karena jumlah ucapan tamu tidak diambil saat render halaman. Sengaja: menghitungnya berarti satu pembacaan Firestore tambahan per pembukaan undangan untuk kasus yang jarang, dan penolakan servernya tetap benar.

14. **Nama pengirim tetap boleh diedit tamu**, meneruskan keputusan pada entri "Seksi Buku Tamu" di atas, meski PRD §4.4 menulis "tidak dapat diedit sendiri". Yang berubah sejak sesi ini: nama itu kini tersimpan permanen dan tampil ke seluruh tamu, bukan lagi state lokal. Konsekuensinya — tamu bisa menandatangani ucapan dengan nama orang lain — ditahan oleh moderasi admin (`isHidden`), bukan oleh pencegahan. Dicatat di sini supaya keputusannya sadar, bukan terlewat.

15. **Batas nama 80 karakter, dan nilai pra-isinya dipangkas ke batas itu.** Nilai bawaan kolom nama adalah `"Bapak/Ibu " + nama lengkap tamu` — sapaannya sendiri sudah 10 karakter. Pada batas 60 (percobaan pertama sesi ini), nama Indonesia bergelar yang wajar sudah melewatinya, dan tamu **ditolak server untuk teks yang tidak pernah ia ketik**: atribut `maxLength` hanya membatasi pengetikan manusia, ia tidak memangkas nilai yang di-set program. Ditemukan review adversarial. Sekarang batasnya 80 (sama dengan nama pendamping di `rsvpConfig`) **dan** nilai awalnya dipangkas dengan `slice`. Diuji dengan nama 102 karakter: terpangkas tepat ke 80 dan diterima server.

16. **Galat paginasi punya state sendiri, terpisah dari galat formulir.** Percobaan pertama memakai satu state untuk keduanya, dan akibatnya galat "Muat Ucapan Lainnya" dirender **di dalam `<form>`** — jauh di puncak seksi, sekitar 1400px di atas tombol yang memicunya pada seksi setinggi 1704px — lalu tidak dirender sama sekali begitu jatah tamu habis dan formulirnya di-unmount. Ditemukan review adversarial. Sekarang galatnya berada 22px di atas tombolnya sendiri (terukur), dan tidak bergantung pada keberadaan formulir.

17. **Konfirmasi "sudah tersimpan" dirender DI LUAR `<form>`.** Pada ucapan ketiga, "simpan berhasil" dan "jatah habis" di-set pada render yang sama; React membatch keduanya, formulirnya di-unmount, dan notice yang dirender di dalamnya **dirender nol kali** — tamu mengirim ucapan terakhirnya lalu tidak melihat konfirmasi apa pun. Ditemukan review adversarial. Sekarang keduanya tampil bersusun: keterangan jatah menggantikan formulir, konfirmasi simpan berada di bawahnya. Diverifikasi di browser.

18. **`fetchGuestMessagesAction` menuntut `fullSlug` yang sah, sama seperti pengiriman.** Percobaan pertama membiarkannya tanpa kredensial apa pun, dan itu dicatat sebagai batasan yang diketahui — keliru. ID Server Action ikut terkirim di bundel publik rute `/`, jadi tanpa gerbang ini seluruh buku tamu — berisi nama-nama orang yang diundang — terbaca dari domain telanjang. Itu tidak konsisten dengan seluruh postur privasi produk ini: halaman 404 generik yang sengaja tidak membocorkan keberadaan link, dan `noindex` menyeluruh (PRD §4.1). Ditemukan review adversarial oleh 3 lensa. Biayanya satu pembacaan dokumen tamu per pemanggilan — dapat diterima karena penyegaran sudah digerbangi visibilitas. Diuji dengan 9 bentuk payload tanpa kredensial: semuanya ditolak.

19. **Empty state hanya tampil bila pembacaan memang berhasil dan kosong.** Bila `getVisibleMessages` gagal saat render server, menampilkan "Belum ada ucapan. Jadilah yang pertama..." adalah klaim palsu. Sekarang kegagalan itu diteruskan sebagai `initialLoadFailed`; seksi dibiarkan kosong tanpa klaim, dan satu percobaan ulang dipicu **saat seksi pertama kali terlihat** — bukan saat mount (tamu yang tidak pernah sampai ke seksi ini tidak perlu dibayari pembacaan Firestore) dan bukan menunggu siklus penyegaran 20 detik.

20. **`break-words` + `min-w-0` pada nama dan isi ucapan.** Ditemukan lewat pengujian tata letak, bukan lewat pembacaan kode: nama 60 karakter tanpa spasi melebar 805px di kontainer 485px, dan pesan 500 karakter tanpa spasi melebar 4220px. Karena seksi memakai `overflow-hidden`, keduanya **terpotong diam-diam** tanpa scrollbar sebagai petunjuk. Pemicu nyatanya bukan teks adversarial, melainkan tautan panjang yang ditempel tamu. `text-pretty` saja tidak memecah kata tunggal, dan `min-w-0` dibutuhkan karena nama berada di dalam kontainer flex.

21. **Kunci idempotensi buatan klien menjadi ID dokumen ucapan.** Ditemukan `/code-review`; kelas yang sama dengan butir 2 entri RSVP di berkas ini. Kegagalan transport **setelah** transaksi commit — jaringan 4G putus tepat saat respons kembali — membuat tamu diberi tahu "Ucapan belum terkirim" untuk ucapan yang sudah tersimpan. Sekitar 20 detik kemudian penyegaran menarik ucapannya sendiri ke daftar tepat di bawah pesan galat itu, saling membantah; lalu setelah jeda 30 detik lewat, kirim ulangnya menghasilkan ucapan **kedua yang identik** — tampil ke semua tamu dan memakan 2 dari 3 jatahnya.
    Sekarang klien membuat satu kunci per naskah (`crypto.randomUUID()` tanpa tanda hubung), dan kunci itu menjadi ID dokumen. Transaksi memeriksa keberadaan dokumen itu **sebelum** memeriksa batas dan jeda — kirim ulang bukan pengiriman baru, jadi tidak boleh ditolak oleh keduanya; yang dikembalikan adalah ucapan yang sudah tersimpan, ditandai `replayed: true`. Kunci direset hanya setelah pengiriman berhasil.
    Dua penjagaan menyertainya. **Bentuk kunci divalidasi** (`/^[A-Za-z0-9_-]{8,64}$/`) karena ia menjadi ID dokumen Firestore — tanpa itu pemanggil bisa mengirim `../`; kunci yang tidak lolos **dibuang, bukan ditolak**, sehingga pengiriman tetap jalan tanpa jaminan idempotensi. Dan bila dokumen dengan kunci itu ternyata milik **tamu lain**, pengiriman ditolak (`key_taken`) tanpa pernah membaca atau menimpanya — tabrakan UUID praktis mustahil, jadi jalur itu hanya menyala untuk pemanggil yang menebak-nebak ID.
    Diverifikasi di browser dengan permintaan yang benar-benar dikirim lalu responsnya ditolak ke klien: kirim ulang menghasilkan **tepat 1 dokumen**, bukan 2.

22. **`initialLoadFailed` disimpan sebagai state dan dibersihkan pada setiap pembacaan yang berhasil.** Ditemukan `/code-review`. Sebagai prop yang dibaca langsung saat render, nilainya tidak pernah berubah — sehingga buku tamu yang gagal dibaca di server, lalu berhasil dipulihkan dan memang **kosong** (keadaan normal sebelum ada tamu yang menulis, yaitu tepat setelah undangan disebar) merender **nihil**: tanpa daftar, tanpa empty state, tanpa penjelasan, tanpa perbaikan diri selama halaman itu terbuka. Diverifikasi dengan memaksa kegagalan render server: empty state muncul 0,3 detik setelah seksi terlihat.

23. **Penolakan `limit_reached` sengaja TIDAK menyetel `error`.** Ditemukan `/code-review` — kelas yang sama dengan butir 17, yang saat itu diperbaiki untuk `notice` tetapi terlewat untuk `error`. Menyetelnya berarti merender notice galat di dalam `<form>` yang justru di-unmount pada render yang sama: ia dirender nol kali, **sekaligus mengunci `error` pada nilai non-null selamanya** karena kedua input yang membersihkannya sudah tidak ada — yang seterusnya memblokir blok `notice && !error`. Keterangan jatah yang menggantikan formulir sudah menyampaikan hal yang sama.

24. **Server Action mengembalikan `reason` yang dapat dibaca mesin, bukan hanya teks galat.** Ditemukan `/code-review`. Klien semula menyimpulkan keadaan "jatah habis" dengan **membandingkan teks galat yang sudah dilokalkan** terhadap `guestBookConfig.errorLimitReached` — memaksa dua kunci config tetap identik byte demi byte hanya supaya antarmukanya koheren, dan cacatnya akan diam saja begitu salah satu teks disunting mempelai.

25. **Halaman pertama Buku Tamu tidak dibaca untuk kunjungan bot.** Ditemukan `/code-review`. Perayap pratinjau WhatsApp mengambil `/[guestSlug]` setiap kali link diteruskan di chat, dan ia tidak pernah merender daftar ucapan — jadi setiap penerusan link membayar ~11 pembacaan Firestore untuk sesuatu yang tidak dilihat siapa pun. Berkas ini sudah memisahkan bot untuk keperluan metrik (PRD §4.5); pembacaannya sekarang ikut digerbangi `if (!isBot)`. Diverifikasi: HTML untuk user-agent WhatsApp tidak memuat penanda ucapan sama sekali, HTML untuk user-agent iPhone memuatnya.

26. **`maxPollWindow` dinaikkan ke 100 dan diukur terhadap baris yang benar-benar tampil.** Ditemukan `/code-review`. Ambang semula 60 dan dibandingkan terhadap jumlah yang **diminta** — angka yang dinaikkan `handleLoadMore` (+10 per klik) maupun `handleSubmit` (+1 per ucapan). Akibatnya tamu yang menekan muat-lebih lima kali (60 baris) lalu mengirim satu ucapan mendarat di 61 dan **kehilangan pembaruan real-time PRD §4.4 untuk sisa sesinya**, tanpa jalan pulih selain memuat ulang halaman. Sekarang ambangnya diukur terhadap baris yang tampil (permintaan bisa jauh melebihi data yang ada), dan 100 cukup jauh dari batas klik sehingga jatah kirim 3 tidak mungkin menjatuhkannya.

**Alasan:**
Memenuhi seluruh baris PRD §4.4 (moderasi tidak ada, pembaruan real-time, kontrol sembunyi admin, panjang pesan dibatasi, maks 3 ucapan per tamu, jeda minimum antar pengiriman, atribusi nama, urutan terbaru di atas dengan paginasi) tanpa membalik keputusan terkunci "akses basis data hanya dari server", dan tanpa menambah dependensi.

**Ditolak:**
1. Firebase Web SDK + `onSnapshot` di klien (lihat butir 1).
2. Cursor `startAfter` untuk paginasi (lihat butir 3).
3. Menyeed 3 ucapan contoh mockup ke Firestore sebagai ucapan asli (lihat butir 8).
4. Menerima ucapan anonim dari rute `/` (lihat butir 9).
5. Indeks gabungan `(guestId, createdAt)` untuk mencari ucapan terakhir (lihat butir 5).
6. Menghitung ulang jatah tamu saat render halaman `/[guestSlug]` (lihat butir 13).
7. Satu angka penjepit untuk melayani dua tujuan berbeda — pertahanan terhadap pemanggil bermusuhan dan penghematan biaya penyegaran (lihat butir 3). Itulah akar cacat paginasi yang paling serius di sesi ini.
8. Menyimpulkan keadaan antarmuka dengan membandingkan teks galat yang sudah dilokalkan (lihat butir 24).
9. Menambahkan kalimat "cek daftar di bawah" pada pesan galat sebagai pengganti idempotensi. Itu memindahkan beban memverifikasi ke tamu, dan tetap membiarkan duplikatnya terjadi (lihat butir 21).

**Diketahui, sengaja tidak dikerjakan sesi ini:**
- Penyembunyian admin pada halaman yang **melewati** jumlah yang sedang ditampilkan tidak ikut tersegarkan sampai tamu menekan "Muat Ucapan Lainnya" lagi. Penyegaran selalu mengambil sebanyak yang sedang ditampilkan, jadi yang di luar itu tidak terpantau.
- Penyegaran berhenti sama sekali di atas `maxPollWindow` (60 ucapan tampil). Tamu yang sudah menekan "Muat Ucapan Lainnya" enam kali tidak lagi menerima ucapan baru sampai ia menekannya lagi atau memuat ulang halaman.
- Jatah tamu tidak diketahui saat halaman dimuat, jadi keadaan "jatah habis" hilang setiap muat ulang dan formulir muncul kembali. Penolakan servernya tetap benar; yang hilang hanya pencegahan dininya (lihat butir 13).
- Pesan jeda tidak menyebut sisa detiknya, padahal `retryAfterSeconds` sudah dihitung di lapisan data. Menampilkan angka yang menghitung turun berarti menambah timer di komponen untuk kasus yang jarang.
- Panel moderasi admin (`toggleMessageVisibility` dan `getAllMessagesForAdmin` sudah ada dan teruji) belum punya antarmuka — itu pekerjaan sesi admin panel.

---

---

## Admin Panel (Bagian 1): Autentikasi Firebase Auth, Proteksi Sesi Server, Dashboard Kapasitas, & Moderasi Buku Tamu

**Keputusan:**
1. **Autentikasi Server-Side Tanpa Client SDK:**
   - Memverifikasi login email dan kata sandi admin melalui Google Identity Toolkit REST API (`accounts:signInWithPassword`) di Server Action, lalu menerbitkan session cookie 5 hari terenkripsi via Firebase Admin SDK (`adminAuth.createSessionCookie(idToken)`).
   - Session disimpan dalam cookie HTTP-only, secure, SameSite `lax` bernama `__session`.
   - Mengikuti prinsip arsitektur yang dikunci di `AGENTS.md` ("Akses basis data hanya dari server. Klien tidak pernah memegang kredensial baca langsung").
2. **Proteksi Rute `/admin`:**
   - Halaman `/admin` memeriksa validitas session cookie via `verifyAdminSession()` (yang memverifikasi token dan status pembatalan di Firebase). Jika belum login atau sesi tidak sah/kedaluwarsa, server otomatis melakukan redirect ke `/admin/login` (HTTP 307).
   - Sebaliknya, jika pengguna yang sudah login membuka `/admin/login`, halaman otomatis mengalihkan ke `/admin`.
3. **Kendali Kapasitas Katering & Indikator Warna (PRD §2.4 & §4.7):**
   - Proyeksi kehadiran dihitung dari: `Jumlah Tamu Hadir + Total Pendamping + 50 Keluarga Inti & Panitia`.
   - Angka disandingkan langsung dengan kapasitas venue 250 orang, dilengkapi bilah kemajuan (progress bar) visual dan lencana status dinamis:
     - **Aman (<200)**: Hijau lembut / emerald (`text-emerald-300`, `border-emerald-500/30`).
     - **Waspada (200–239)**: Kuning amber (`text-amber-300`, `border-amber-500/40`).
     - **Kapasitas Kritis / Penuh (≥240)**: Merah rose berdenyut (`text-rose-300`, `border-rose-500/50`, `animate-pulse`).
   - Sesuai PRD §4.7, karena tidak ada mekanisme kuota otomatis untuk tamu tambahan (plus-one), angka proyeksi ini menjadi satu-satunya alat kendali kapasitas yang dimiliki mempelai.
4. **Pemisahan Kunjungan Bot WhatsApp Preview (PRD §4.5):**
   - Statistik bot preview (`autoVisitCount`) disajikan terpisah dari pembukaan nyata tamu (`openedCount`), mencegah bias statistik saat link undangan dibagikan di grup chat WhatsApp.
5. **Antarmuka Moderasi Buku Tamu Real-Time:**
   - Panel moderasi menyajikan daftar seluruh ucapan (termasuk yang disembunyikan), tab penyaring (*Semua*, *Tampil*, *Disembunyikan*), dan pencarian instan.
   - Tombol "Sembunyikan" / "Tampilkan Kembali" memperbarui state lokal secara optimistik dan memanggil Server Action `toggleMessageVisibilityAction` yang dilindungi verifikasi sesi admin. Status langsung tersinkronisasi ke Firestore dan daftar publik tamu.

6. **Pembagian Scope Sesi (Sesuai Konfirmasi Pengguna):**
   - Sesi 1: Autentikasi Firebase Auth, Proteksi Sesi Server, Dashboard Kapasitas 250, dan Moderasi Buku Tamu.
   - Sesi 2: Manajemen Tamu Lengkap (Tabel 150 tamu, filter reminder belum respons, generator pesan WhatsApp personal, form tambah/edit tamu, impor CSV, dan ekspor data).

**Alasan:**
Memenuhi requirement fungsional PRD §4.4, §4.5, dan §4.7 dengan keamanan maksimal tanpa menambah dependensi npm baru, serta menjaga integritas visual design system bernuansa espresso dan aksen emas resmi Alwi & Septy.

**Ditolak:**
1. Menambahkan Firebase Web Client SDK di frontend browser (menambah beban dependensi dan melanggar prinsip server-only access).
2. Password admin statis hardcoded di kode sumber tanpa Firebase Auth.
3. Menghapus atau menggabungkan metrik bot WhatsApp dengan metrik buka nyata (merusak akurasi data kehadiran tamu).

---

## Seksi Pembuka: Menyeragamkan foto latar mobile & desktop menggunakan foto adat Sunda (adat-sunda-04.jpg)

**Keputusan:** latar seksi Pembuka diseragamkan di seluruh breakpoint (mobile dan desktop) menggunakan foto adat Sunda yang sama dengan versi desktop (`/photos/adat-sunda-04.jpg`), menggantikan `adat-sunda-03.jpg` yang sebelumnya digunakan khusus pada ponsel.

**Alasan:** permintaan langsung dari user agar foto di bagian pembuka konsisten antara ponsel dan komputer. Foto `adat-sunda-04.jpg` menampilkan Alwi & Septy mengenakan busana pernikahan adat Sunda lengkap (mahkota Siger Sunda dan blangkon) secara formal dan simetris.

**Penyesuaian Teknis:**
1. Di `lib/event-config.ts`, `openingPhotos.portrait` disamakan nilainya dengan `landscape` (`"/photos/adat-sunda-04.jpg"`).
2. Di `components/sections/pembuka.tsx`, kontainer foto disederhanakan dari dua elemen terpisah (`lg:hidden` & `hidden lg:block`) menjadi satu elemen foto responsif dengan satu ref (`photoRef`).
3. Styling `object-cover object-[center_20%]` membuktikan framing wajah dan mahkota mempelai tetap proporsional dan tidak terpotong wave divider di viewport 390px ponsel, tablet 768px, maupun desktop 1280px.
4. Nilai ekspansi parallax `-top-[70px] -bottom-[70px] lg:-top-[90px] lg:-bottom-[90px]` dan scrim adaptif `bg-pembuka-scrim lg:bg-pembuka-scrim-lg` digabungkan secara responsif sehingga performa render browser lebih hemat (1 elemen Next/Image).
