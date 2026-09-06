# PRD — Website Undangan Pernikahan Digital

**Versi:** 3.0
**Tanggal:** 2 Agustus 2026
**Status:** Draft untuk review
**Hari-H:** Sabtu, 10 Oktober 2026

> **Catatan cakupan dokumen.** Dokumen ini berisi requirement produk — *apa* yang harus dibangun dan *mengapa*. Desain teknis rinci (struktur data, arsitektur komponen, strategi keamanan, workflow pengembangan) berada di luar cakupan dan diserahkan ke tahap desain teknis.

---

## 1. Ringkasan & Tujuan

### 1.1 Latar Belakang

Undangan pernikahan digital yang beredar saat ini punya dua kelemahan mendasar. Pertama, personalisasi nama tamu umumnya ditaruh di query string (`?to=Budi`), yang artinya siapa pun bisa mengganti nilainya dan mengakses undangan atas nama siapa pun. Kedua, tidak ada mekanisme untuk mengetahui apakah undangan benar-benar sampai dan dibuka.

Untuk acara dengan kapasitas sangat terbatas — 250 kursi, 150 undangan — dua kelemahan ini bukan sekadar masalah estetika. Keduanya langsung memengaruhi akurasi headcount katering dan kontrol tamu yang masuk.

### 1.2 Tujuan Produk

1. Menyampaikan undangan yang terasa personal dan eksklusif untuk 150 tamu terpilih.
2. Memberi pasangan mempelai visibilitas langsung atas siapa yang sudah membuka undangan dan siapa yang akan hadir.
3. Menghasilkan angka headcount yang cukup akurat untuk keputusan katering dan tata kursi.
4. Tampil dengan kualitas desain yang jelas di atas rata-rata template undangan komersial.

### 1.3 Ukuran Keberhasilan

| Metrik | Target |
|---|---|
| Tingkat buka undangan | > 85% dari 150 tamu |
| Tingkat pengisian RSVP | > 70% sebelum H-14 (26 September) |
| Akurasi headcount | Selisih < 10% dibanding kehadiran aktual |
| Performa mobile | Konten utama tampil di bawah 2,5 detik pada koneksi 4G |
| Preview WhatsApp | 100% link menampilkan nama tamu dengan benar |

### 1.4 Non-Tujuan

Produk ini bukan platform undangan multi-tenant, bukan sistem manajemen acara, dan tidak dimaksudkan untuk dipakai ulang secara komersial. Seluruh keputusan mengoptimalkan satu acara dengan 150 tamu, bukan skala.

---

## 2. Konteks & Batasan

### 2.1 Data Mempelai

| Item | Mempelai Pria | Mempelai Wanita |
|---|---|---|
| Nama lengkap | Mochamad Ilham Alwi Rifa, S.T. | Septyara Khotimaharani, S.Pd. |
| Nama panggilan | Alwi | Septy |
| Ayah | Dadang Sukandi | Uun Syukur |
| Ibu | Tini Hernawati | Imas Yuliah |

Gelar akademik ditampilkan di undangan.

### 2.2 Data Acara

| Item | Nilai |
|---|---|
| Hari & tanggal | Sabtu, 10 Oktober 2026 |
| Akad | 08.00 WIB |
| Resepsi | 11.00 – 14.00 WIB |
| Lokasi | Akad dan resepsi berada di venue yang sama |
| Venue | Steikhaus (Area Pabrik Bajoe) |
| Alamat | Jl. Soekarno-Hatta No.575 D, Gumuruh, Kec. Batununggal, Kota Bandung, Jawa Barat 40275 |
| Google Maps | https://share.google/LcN0r9PHzHVci6aX8 |
| Kapasitas venue | 250 orang, sudah termasuk keluarga |
| Jumlah undangan | 150 |
| Target live | Akhir Agustus 2026 |

### 2.3 Rekening Hadiah

Blu (BCA Digital) — 005516270903 a.n. Septyara Khotimaharani

Ditampilkan sebagai informasi statis. Lihat 4.9 untuk ketentuannya dan Bagian 10 untuk batas cakupannya.

### 2.4 Perhitungan Kapasitas — Batasan Paling Mengikat

```
Kapasitas venue                          250
Dikurangi keluarga inti + panitia        -50   (asumsi, perlu konfirmasi)
─────────────────────────────────────────────
Kursi tersedia untuk tamu undangan       200
Dikurangi tamu utama (150 undangan)     -150
─────────────────────────────────────────────
Sisa untuk pendamping (plus-one)          50
```

**Implikasi produk:** jika 150 tamu semuanya membawa pasangan, total mencapai 350 orang — kelebihan 100 dari kapasitas. Angka terburuk ini kecil kemungkinannya, karena tidak semua tamu hadir dan tidak semua yang hadir membawa pendamping.

**Keputusan: tidak ada mekanisme pembatas.** Plus-one terbuka untuk semua tamu tanpa kuota, penghitung, atau sakelar. Pengendaliannya bersifat pengamatan, bukan penegakan — dashboard menampilkan proyeksi total dibanding 250, dan karena RSVP masuk bertahap selama enam minggu, tren yang mengkhawatirkan akan terlihat berminggu-minggu sebelum menjadi masalah.

**Alasan.** Kuota otomatis menyelesaikan masalah sosial dengan cara teknis, dan ongkosnya ada di dua sisi. Dari sisi kerja: penghitung transaksional, penanganan pengiriman bersamaan, dan tampilan formulir yang berubah kondisi. Dari sisi tamu: orang yang menjawab lebih lambat ditolak membawa pasangannya semata-mata karena urutan waktu — canggung di acara pernikahan, apalagi pasangan menikah biasanya diundang sebagai pasangan.

**Risiko yang diterima:** jika proyeksi benar-benar melewati 250, satu-satunya jalan tersisa adalah menghubungi tamu yang sudah mengonfirmasi. Kemungkinannya kecil, tetapi ini arah pemulihan yang paling mahal secara sosial.

### 2.5 Batasan Lain

- **Anggaran:** nol. Seluruh layanan harus muat di free tier.
- **Domain:** subdomain gratis, tidak beli domain kustom.
- **Tim:** satu developer, paruh waktu.
- **Waktu:** 3–4 minggu sampai live.
- **Aset:** foto prewedding dan detail acara sudah tersedia dari calon mempelai.

---

## 3. Persona & Alur Pengguna

### 3.1 Tamu Undangan

Mayoritas membuka dari WhatsApp di perangkat mobile, dengan koneksi seluler, sambil mengerjakan hal lain. Rentang usianya lebar — dari teman seangkatan sampai kerabat orang tua — sehingga tidak boleh ada asumsi kemahiran teknis.

1. Menerima pesan WhatsApp berisi link personal.
2. Melihat preview di WhatsApp yang sudah menampilkan namanya.
3. Membuka link, mendarat di layar sampul dengan namanya tercantum.
4. Menekan tombol "Buka Undangan".
5. Menggulir isi undangan.
6. Mengisi RSVP: hadir atau tidak, membawa pendamping atau tidak.
7. Opsional menulis ucapan.
8. Menyimpan tanggal ke kalender atau membuka peta.

### 3.2 Admin — Mempelai dan Developer

1. Login ke admin panel.
2. Memasukkan daftar 150 tamu, manual atau via unggah CSV.
3. Sistem menghasilkan link unik per tamu.
4. Menyalin link dan template pesan WhatsApp per tamu, mengirim manual.
5. Memantau dashboard: siapa yang sudah buka, siapa yang sudah RSVP.
6. Menindaklanjuti tamu yang belum merespons dari daftar reminder.
7. Mengekspor data final untuk katering dan tata kursi.

---

## 4. Requirements Fungsional

### 4.1 Link Undangan Privat

Setiap tamu menerima satu link yang hanya berlaku untuk dirinya dan tidak dapat ditebak.

**Bentuk URL:** gabungan nama tamu dan token acak, misalnya `/budi-santoso-a7f3k9m2`. Bagian nama membuat link terasa personal saat dilihat di WhatsApp; keamanan sepenuhnya berasal dari token acak.

| Requirement | Ketentuan |
|---|---|
| Token | Minimal 8 karakter acak, ruang kunci cukup besar sehingga tidak realistis ditebak dengan percobaan berulang |
| Link tidak valid | Menampilkan halaman "tidak ditemukan" yang generik, tanpa membocorkan apakah link pernah ada |
| Perlindungan percobaan massal | Pembatasan jumlah percobaan akses dari sumber yang sama |
| Mesin pencari | Seluruh halaman undangan tidak boleh terindeks |

**Risiko yang diterima:** link bisa diteruskan. Jika tamu A mengirim link ke B, B dapat membuka dan mengisi RSVP atas nama A. Keputusan ini diambil sadar — untuk 150 tamu yang saling mengenal, gesekan UX dari PIN tidak sebanding dengan risikonya.

**Mitigasi:** sistem menghitung jumlah perangkat berbeda yang membuka setiap link. Link yang dibuka dari banyak perangkat ditandai di dashboard sebagai anomali untuk ditinjau manual.

### 4.2 Halaman Undangan

| # | Seksi | Isi |
|---|---|---|
| 1 | Sampul | Nama mempelai, tanggal, nama tamu, tombol "Buka Undangan" |
| 2 | Ayat | Ayat Al-Qur'an di atas latar berornamen |
| 3 | Pembuka | Salam dan kalimat pengantar |
| 4 | Mempelai | Foto, nama lengkap, nama orang tua, tautan Instagram opsional |
| 5 | Love Story | Linimasa 3–5 momen dengan tahun dan foto |
| 6 | Galeri | Foto prewedding dengan tampilan perbesar |
| 7 | Detail Acara | Tanggal, akad 08.00, resepsi 11.00–14.00, alamat, peta, tombol arah, tombol simpan ke kalender |
| 8 | RSVP | Formulir konfirmasi kehadiran |
| 9 | Buku Tamu | Formulir ucapan dan daftar ucapan yang masuk |
| 10 | Hadiah | Nomor rekening dengan tombol salin |
| 11 | Penutup | Ucapan terima kasih |

**Catatan seksi Detail Acara.** Akad dan resepsi berada di venue yang sama dengan jeda tiga jam. Tata letaknya harus menampilkan dua waktu tanpa mengulang alamat dan peta dua kali, sekaligus membuat jelas bahwa tamu tidak perlu berpindah tempat.

**Ketentuan layar sampul.** Halaman undangan tidak boleh langsung menampilkan seluruh isi. Layar sampul berfungsi sebagai gerbang yang menyelesaikan tiga masalah sekaligus:

1. Memberi momen pembukaan yang terasa personal.
2. Menyediakan interaksi pengguna yang dibutuhkan browser sebelum mengizinkan pemutaran musik.
3. Memisahkan pembukaan asli oleh manusia dari kunjungan otomatis oleh sistem preview WhatsApp.

Karena satu elemen ini menopang tiga requirement berbeda, penghapusannya akan merusak fitur musik dan fitur tracking sekaligus.

### 4.3 RSVP

| Field | Bentuk | Wajib |
|---|---|---|
| Kehadiran | Pilihan Hadir / Tidak Hadir | Ya |
| Membawa pendamping | Ya / Tidak | Hanya jika Hadir |
| Nama pendamping | Teks | Hanya jika membawa pendamping |
| Catatan | Teks singkat | Tidak |

Nama pendamping dibutuhkan untuk tata kursi. Kolom catatan dipakai untuk hal seperti alergi makanan.

**Aturan pendamping**

- Terbuka untuk semua tamu. Tidak ada kuota, penghitung, atau keadaan "penuh".
- Nama pendamping dicatat untuk keperluan tata kursi.
- Tamu dapat mengubah jawabannya kapan saja, termasuk membatalkan pendamping.

**Aturan waktu**

- Tidak ada deadline keras. Formulir tetap terbuka sampai hari-H.
- Halaman menampilkan tanggal anjuran: **26 September 2026** (H-14).
- Setelah tanggal anjuran terlewat, teks berubah menjadi permintaan konfirmasi segera, tetapi formulir tetap dapat dikirim.
- RSVP dapat diubah kapan saja oleh tamu melalui link yang sama.

**Alasan.** Tanpa deadline sama sekali, tidak ada angka final untuk katering — venue umumnya meminta headcount pasti pada H-7 hingga H-14. Tanggal anjuran ditambah daftar reminder di admin panel memberi angka yang dibutuhkan tanpa memblokir tamu mana pun.

### 4.4 Buku Tamu

| Requirement | Ketentuan |
|---|---|
| Moderasi | Tidak ada — ucapan langsung tampil |
| Pembaruan tampilan | **Real-time.** Ucapan baru muncul tanpa perlu memuat ulang halaman |
| Kontrol admin | Admin dapat menyembunyikan ucapan; penyembunyian juga berlaku real-time |
| Panjang pesan | Dibatasi, cukup untuk beberapa kalimat |
| Batas per tamu | Maksimal 3 ucapan |
| Perlindungan spam | Jeda minimum antar pengiriman dari link yang sama |
| Atribusi nama | Otomatis dari data tamu, tidak dapat diedit sendiri |
| Urutan | Terbaru di atas, dengan paginasi |

### 4.5 Pelacakan Pembukaan Undangan

Requirement ini punya satu jebakan yang harus ditangani sejak awal.

**Masalah.** Saat link dikirim di WhatsApp, sistem WhatsApp mengambil halaman lebih dulu untuk membangun preview — sebelum penerima menyentuh apa pun. Pendekatan naif akan menandai seluruh 150 tamu sebagai "sudah membuka" pada detik link dikirim, membuat fitur ini sepenuhnya tidak berguna.

**Ketentuan**

- Pembukaan hanya dicatat setelah tamu melakukan interaksi nyata, yaitu menekan tombol di layar sampul. Kunjungan otomatis tidak pernah menekan tombol.
- Kunjungan dari sistem preview dan perayap mesin pencari harus dikenali dan dikecualikan dari hitungan.
- Kunjungan yang berlangsung sangat singkat tidak dihitung sebagai pembukaan.
- Kunjungan otomatis tetap dicatat secara terpisah untuk keperluan penelusuran masalah, tetapi tidak muncul di metrik.
- Sistem mencatat jumlah perangkat berbeda per link, sebagai indikator penerusan link.
- Status pembukaan di admin panel diperbarui **real-time**.

### 4.6 Preview WhatsApp

Ini kanal distribusi utama, sehingga kualitas preview setara pentingnya dengan kualitas halaman itu sendiri.

| Requirement | Ketentuan |
|---|---|
| Isi preview | Nama mempelai, tanggal acara, dan **nama tamu** |
| Keterbacaan | Nama tamu harus terbaca jelas pada thumbnail kecil di daftar chat |
| Sifat | Dibuat per tamu, berbeda untuk setiap link |
| Ukuran gambar | 1200 × 630 piksel |
| Bobot file | Cukup ringan agar dimuat cepat di koneksi seluler |
| Verifikasi | Wajib diuji dengan pengiriman nyata ke minimal tiga nomor berbeda, mencakup Android, iOS, dan WhatsApp Web |

**Peringatan operasional.** WhatsApp menyimpan preview dalam cache secara agresif dan tidak menyediakan cara memaksa pembaruan. Jika preview salah pada percobaan pertama, versi yang salah bisa bertahan lama tanpa bisa diperbaiki. Konsekuensinya, fitur ini harus dikerjakan dan diuji lebih awal dari jadwal wajarnya, bukan di minggu terakhir.

### 4.7 Admin Panel

| Halaman | Fungsi |
|---|---|
| Daftar Tamu | Tabel 150 tamu: nama, grup, status buka, status RSVP, jumlah perangkat |
| Tambah / Edit Tamu | Pengelolaan data tamu satu per satu |
| Impor CSV | Unggah massal dengan pratinjau dan validasi sebelum disimpan |
| Generator Link | Salin link per tamu dan salin pesan WhatsApp yang sudah terisi nama |
| Dashboard RSVP | Angka ringkas: hadir, tidak hadir, belum respons, jumlah pendamping, proyeksi total tamu |
| Daftar Belum Respons | Filter tamu yang belum RSVP, dengan tombol salin pesan reminder |
| Moderasi Ucapan | Daftar ucapan dengan tombol sembunyikan |
| Ekspor | Unduh data lengkap untuk katering dan tata kursi |

**Ketentuan real-time.** Status pembukaan, RSVP masuk, dan ucapan baru harus muncul di dashboard tanpa memuat ulang halaman. Kebutuhan ini muncul karena pada masa sebar undangan mempelai akan memantau layar secara aktif, dan pada masa itu memuat ulang berulang kali terasa seperti aplikasi yang rusak.

**Ketentuan tampilan angka.** Proyeksi total tamu dihitung dari jumlah yang konfirmasi hadir, ditambah pendamping yang dikonfirmasi, ditambah jumlah keluarga inti. Angka ini harus ditampilkan menonjol dan disandingkan langsung dengan kapasitas 250.

Karena tidak ada mekanisme pembatas otomatis, **angka inilah satu-satunya alat kendali kapasitas yang dimiliki**. Ia harus mudah dibaca sekilas dan berubah warna saat mendekati 250, sehingga tren yang mengkhawatirkan terlihat jauh sebelum menjadi masalah.

### 4.8 Seksi Hadiah

Menampilkan informasi rekening bagi tamu yang ingin mengirim hadiah.

| Requirement | Ketentuan |
|---|---|
| Isi | Nama bank, nomor rekening, nama pemilik rekening |
| Aksi | Tombol salin nomor rekening ke papan klip |
| Umpan balik | Konfirmasi visual singkat setelah nomor tersalin |
| Sifat | Statis. Tidak ada pencatatan, konfirmasi kirim, atau rekap di admin |
| Nada penyajian | Ditempatkan tanpa menonjol. Tidak boleh terasa seperti permintaan |

**Batas cakupan.** Fitur amplop digital penuh — pencatatan transaksi, konfirmasi pengiriman oleh tamu, dan rekap di admin panel — berada di luar cakupan. Seksi ini hanya menampilkan informasi.

**Alasan pembatasan.** Menambah pencatatan hadiah berarti menambah pekerjaan beberapa hari ke Minggu 3, yang sudah terisi penuh oleh preview WhatsApp, RSVP, pelacakan, dan admin panel. Tampilan statis dengan tombol salin memenuhi kebutuhan praktis tamu tanpa membebani jadwal.

### 4.9 Pengelolaan Konten

Seluruh konten acara — nama mempelai, gelar, nama orang tua, tanggal, jadwal, alamat, informasi rekening, naskah love story, daftar foto, pilihan musik — harus terpusat di satu tempat yang dapat diubah tanpa menyentuh kode tampilan.

**Alasan.** Revisi teks dari calon mempelai adalah hal yang pasti terjadi dan biasanya berulang. Jika konten tersebar di banyak berkas, setiap revisi kecil menjadi pekerjaan pencarian. Nama mempelai secara khusus harus mudah diganti, karena akan dipakai berulang di seluruh halaman dan di preview WhatsApp.

---

## 5. Requirements Non-Fungsional

### 5.1 Performa

Konten utama tampil di bawah 2,5 detik pada koneksi 4G. Foto prewedding dioptimasi agresif — inilah komponen terberat halaman. Galeri dimuat bertahap saat digulir, dan berkas musik baru diunduh setelah tamu menekan tombol sampul.

### 5.2 Mobile-First

Desain dikerjakan mulai dari layar ponsel terkecil, bukan diturunkan dari desain desktop. Area sentuh harus cukup besar untuk digunakan dengan ibu jari. Wajib diuji pada Safari iOS dan Chrome Android, bukan hanya di simulator peramban desktop.

### 5.3 Aksesibilitas

Kontras warna memenuhi WCAG AA. Seluruh gambar memiliki teks alternatif. Formulir memiliki label yang jelas. Musik latar tidak pernah berjalan tanpa persetujuan pengguna dan selalu punya tombol matikan yang terlihat.

### 5.4 Privasi

Nama tamu muncul di preview WhatsApp, artinya siapa pun yang memegang link dapat melihat nama tersebut. Ini konsekuensi yang diterima dan konsisten dengan keputusan pada 4.1. Tidak ada data pribadi lain — nomor telepon, alamat — yang disimpan di sistem. Seluruh data dihapus tiga bulan setelah acara.

### 5.5 Ketersediaan

Layanan harus dapat diakses sepanjang periode 31 Agustus sampai 10 Oktober. Tidak ada kebutuhan SLA formal, tetapi tidak boleh ada periode tidak aktif yang menyebabkan tamu menerima error saat membuka link.

---

## 6. Arah Desain & Gate Approval

### 6.1 Prinsip

Selera desain bersifat subjektif, dan yang berhak menilai adalah calon mempelai — bukan developer, bukan AI. Karena itu proses desain menggunakan gate approval eksplisit.

**Risiko yang dicegah:** tanpa gate ini, skenario paling umum adalah desain dikerjakan selama tiga minggu lalu ditolak di minggu terakhir, ketika tidak ada lagi waktu untuk merombak.

### 6.2 Proses Tiga Konsep

Pada Minggu 1 disiapkan tiga arah desain yang secara nyata berbeda satu sama lain — bukan tiga variasi warna dari konsep yang sama.

Setiap konsep diserahkan dengan:

- Moodboard singkat beserta rasionalnya
- Palet warna
- Pilihan dan skala tipografi
- Tampilan seksi sampul dan seksi detail acara dalam ukuran ponsel
- Bentuk yang bisa dibuka langsung dari ponsel, bukan berkas desain yang perlu aplikasi khusus

**Gate:** mempelai memilih satu konsep. Implementasi tidak dimulai sebelum keputusan ini diambil.

### 6.3 Catatan Arah Desain

Undangan pernikahan adalah karya editorial yang bersifat emosional — lebih dekat ke majalah daripada halaman produk. Konsep yang diajukan sebaiknya menghindari kosakata visual perangkat lunak: gradien ungu-biru, kartu bersudut membulat dengan bayangan, ikon garis tipis, dan susunan hero dengan dua tombol aksi.

Foto prewedding sudah tersedia dan merupakan aset visual terkuat yang dimiliki proyek ini. Desain sebaiknya dibangun mengelilingi foto tersebut, bukan menempatkannya sebagai pelengkap.

---

## 7. Arahan Teknis

Bagian ini mencatat pilihan platform beserta alasannya. Desain teknis rinci dikerjakan terpisah.

| Lapisan | Pilihan | Alasan |
|---|---|---|
| Framework & hosting | Next.js + Vercel | Kemampuan menghasilkan gambar preview berbeda untuk setiap tamu secara otomatis, yang merupakan requirement penentu di 4.6 |
| Basis data & backend | Firebase (Firestore) | Pembaruan real-time bawaan, dan free tier tidak pernah menonaktifkan diri saat sepi |
| Autentikasi admin | Firebase Auth | Sudah menyatu dengan basis data, tidak perlu membangun sistem login sendiri |
| Domain | Subdomain gratis | Sesuai batasan anggaran |

### 7.1 Catatan Pemilihan Firebase

Kandidat lain yang dipertimbangkan adalah Supabase. Keduanya mampu menangani real-time, sehingga faktor pembeda bukan kemampuan itu.

Yang menentukan adalah perilaku free tier. Supabase menonaktifkan project setelah sekitar tujuh hari tanpa aktivitas. Pola penggunaan produk ini justru punya periode sepi yang panjang: undangan disebar akhir Agustus, acaranya 10 Oktober, dan di antara keduanya hampir pasti ada minggu-minggu ketika semua yang ingin RSVP sudah RSVP. Jika project menonaktifkan diri pada minggu seperti itu dan ada satu tamu yang membuka linknya, tamu tersebut menerima error — pada produk yang hanya punya satu kesempatan untuk memberi kesan pertama.

Firestore tidak memiliki perilaku ini, sehingga risiko tersebut hilang sepenuhnya alih-alih perlu dimitigasi.

### 7.2 Informasi yang Perlu Disimpan

Disebutkan pada tingkat konsep, bukan sebagai rancangan struktur data:

- **Data tamu** — nama, sapaan, kelompok tamu, dan link uniknya
- **Catatan pembukaan** — kapan dibuka, dari perangkat berbeda yang mana, dan apakah berasal dari kunjungan otomatis
- **Jawaban RSVP** — kehadiran, pendamping, nama pendamping, catatan, dan riwayat perubahan
- **Ucapan** — isi pesan dan status ditampilkan atau disembunyikan

---

## 8. Timeline

Empat minggu, 3 sampai 30 Agustus 2026. Live 31 Agustus.

### Minggu 1 — 3 s.d. 9 Agustus: Desain & Fondasi

- Tiga konsep arah desain disiapkan dan diserahkan ke mempelai
- **Gate: mempelai memilih satu konsep**
- Menyiapkan proyek dan basis data
- Mengumpulkan dan memasukkan seluruh konten final dari mempelai
- Mengoptimasi seluruh foto prewedding

### Minggu 2 — 10 s.d. 16 Agustus: Halaman Undangan

- Menerapkan sistem desain hasil pilihan
- Layar sampul dengan gerbang pembuka dan pemicu musik
- Seksi mempelai, love story, dan galeri
- Seksi detail acara dengan peta dan tombol kalender
- Animasi saat digulir

### Minggu 3 — 17 s.d. 23 Agustus: Fitur Data

- Sistem link unik per tamu
- **Preview WhatsApp — dikerjakan paling awal di minggu ini**, karena siklus pengujiannya lambat akibat cache yang tidak bisa dipaksa diperbarui
- Formulir RSVP dan logika kuota pendamping
- Buku tamu dengan pembaruan real-time
- Pelacakan pembukaan dengan penyaringan kunjungan otomatis
- Admin panel: login, pengelolaan tamu, impor CSV, dashboard

### Minggu 4 — 24 s.d. 30 Agustus: QA & Peluncuran

- Uji lintas perangkat: Safari iOS, Chrome Android, WhatsApp Web
- Uji preview WhatsApp dengan pengiriman nyata ke minimal tiga nomor
- Audit performa dan perbaikan
- Memasukkan 150 tamu dan menghasilkan seluruh link
- QA manual: membuka 20 link acak sebagai sampel
- **Peluncuran 31 Agustus**

### Setelah Peluncuran

| Tanggal | Kegiatan |
|---|---|
| 31 Agustus – 5 September | Sebar undangan bertahap, pantau error |
| 26 September | Tanggal anjuran RSVP, mulai kirim reminder |
| 3 Oktober (H-7) | Kunci angka headcount untuk katering |
| 10 Oktober | Hari-H |
| Januari 2027 | Hapus data |

---

## 9. Risiko & Mitigasi

| # | Risiko | Dampak | Mitigasi |
|---|---|---|---|
| 1 | Desain ditolak mempelai di akhir | Tinggi | Gate tiga konsep di Minggu 1, sebelum implementasi apa pun |
| 2 | Preview WhatsApp salah dan tersimpan di cache | Tinggi | Dikerjakan paling awal di Minggu 3, diuji dengan pengiriman nyata ke tiga nomor |
| 3 | Pendamping melebihi kapasitas venue | Tinggi | Tidak dicegah otomatis. Dipantau lewat proyeksi total di dashboard yang menyala saat mendekati 250. Risiko diterima sadar |
| 4 | Pelacakan pembukaan tercemar kunjungan otomatis | Sedang | Pencatatan hanya setelah interaksi nyata, ditambah penyaringan kunjungan otomatis |
| 5 | Kuota gratis Firestore terpakai habis oleh pemantauan real-time | Sedang | Batasi cakupan pemantauan langsung, paginasi daftar ucapan |
| 6 | Headcount tidak akurat karena tidak ada deadline keras | Sedang | Tanggal anjuran, daftar reminder, angka dikunci pada H-7 |
| 7 | Link tersebar di luar tamu undangan | Rendah | Pantau jumlah perangkat berbeda per link di dashboard |
| 8 | Konten dari mempelai datang terlambat | Sedang | Kumpulkan seluruh konten di Minggu 1, bangun dengan placeholder bila perlu |
| 9 | Foto prewedding terlalu berat sehingga halaman lambat | Sedang | Optimasi agresif dengan anggaran bobot per gambar |
| 10 | Musik tidak berjalan di iOS | Rendah | Pemutaran dipicu oleh tombol sampul, diuji khusus di Safari |
| 11 | Asumsi 50 kursi keluarga inti ternyata salah | Sedang | Hanya memengaruhi ketepatan proyeksi di dashboard, bukan logika sistem. Konfirmasi sebelum undangan disebar 31 Agustus |

---

## 10. Di Luar Cakupan

Tidak dikerjakan dalam rilis ini:

- Fitur amplop digital penuh: pencatatan transaksi, konfirmasi pengiriman oleh tamu, rekap hadiah di admin panel. Tampilan nomor rekening statis tetap dikerjakan — lihat 4.8
- Pembayaran QRIS
- Dukungan lebih dari satu bahasa
- Kemampuan offline
- Siaran langsung acara
- Check-in QR di lokasi
- Galeri foto pasca-acara
- Undangan berbentuk video
- Pengiriman undangan otomatis — pengiriman dilakukan manual per tamu
- Notifikasi email atau push saat RSVP masuk — cukup lewat dashboard

**Kandidat untuk dipertimbangkan lagi:** check-in QR di lokasi akan menjadi tambahan bernilai jika diputuskan sebelum Minggu 3, karena dapat memakai link unik yang sudah ada tanpa data baru. Setelah Minggu 3, tidak lagi realistis.

---

## 11. Pertanyaan Terbuka

Sudah terjawab pada 2 Agustus 2026: nama lengkap dan panggilan kedua mempelai, nama orang tua, jam akad dan resepsi, kesamaan lokasi akad dan resepsi, alamat lengkap venue, dan informasi rekening.

Masih menunggu jawaban:

1. **Jumlah pasti keluarga inti dan panitia** — angka 50 masih asumsi. Dibutuhkan agar proyeksi total di dashboard akurat, bukan karena memblokir pembangunan. Dibutuhkan sebelum undangan disebar 31 Agustus, bukan minggu ini.
2. Dress code
3. Isi love story: berapa momen, tahunnya, dan naskahnya
4. Jumlah foto prewedding yang dipakai dan mana yang menjadi foto utama
5. Pilihan musik latar
6. Handle Instagram bila ingin dicantumkan
7. Siapa yang menyiapkan daftar 150 nama, dan dalam format apa
8. Apakah nama tamu ditulis dengan sapaan (Bapak/Ibu/Sdr) atau nama saja
9. Titik koordinat Steikhaus yang akurat untuk peta — tautan `share.google` yang diberikan berupa pengalih, sehingga koordinat pastinya perlu diambil terpisah

---

## Lampiran A — Format CSV Impor Tamu

```csv
name,salutation,guest_group,plus_one_allowed
Budi Santoso,Bapak,teman_kerja,true
Ani Wijaya,Ibu,keluarga_wanita,true
Rina Kusuma,Sdri,teman_kuliah,true
```

Link unik dihasilkan otomatis oleh sistem saat impor dan tidak perlu disertakan dalam berkas.

## Lampiran B — Template Pesan WhatsApp

```
Assalamualaikum Wr. Wb.

Dengan penuh sukacita, kami mengundang {sapaan} {nama}
untuk hadir dan memberikan doa restu pada acara pernikahan kami.

Alwi & Septy
Sabtu, 10 Oktober 2026
Akad 08.00 WIB · Resepsi 11.00–14.00 WIB
Steikhaus (Area Pabrik Bajoe), Bandung

Undangan lengkap dapat dibuka di tautan berikut:
{link_undangan}

Tautan ini bersifat pribadi dan hanya berlaku untuk {sapaan} {nama}.

Merupakan suatu kehormatan dan kebahagiaan bagi kami
apabila {sapaan} berkenan hadir.

Terima kasih.
Wassalamualaikum Wr. Wb.
```

Bagian dalam kurung kurawal diisi otomatis oleh generator link di admin panel.
