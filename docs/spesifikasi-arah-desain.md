# Spesifikasi Arah Desain

**Proyek:** Undangan pernikahan Alwi & Septy — Sabtu, 10 Oktober 2026, Steikhaus Bandung
**Versi:** 1.0 — menggantikan brief eksplorasi tiga konsep
**Status:** Arah sudah dipilih klien lewat gambar referensi

---

## 1. Perubahan dari Rencana Sebelumnya

Rencana awal adalah menghasilkan tiga konsep berbeda untuk dipilih mempelai. Rencana itu dibatalkan: mempelai sudah menunjukkan gambar referensi yang mewakili selera mereka, sehingga eksplorasi tiga arah tidak lagi diperlukan.

**Dampak pada jadwal:** gate desain berubah dari "tiga konsep dibuat, dikirim, didiskusikan, dipilih" menjadi "satu mockup dibuat, dikirim, disetujui". Ini memangkas sekitar dua hari dari Minggu 1 — waktu yang sebaiknya dipakai untuk mengejar foto prewedding, yang sampai sekarang belum diterima dan berada di jalur kritis Minggu 2.

**Catatan pelajaran:** dua kali klien memakai kata yang tidak sejalan dengan selera aslinya. Mereka menyebut "gemas", lalu "minimalist", sementara referensi yang mereka pilih justru padat ornamen. Untuk klien ini, **minta referensi visual, jangan minta deskripsi kata.**

---

## 2. Penggunaan Referensi

Gambar referensi dari klien merupakan hasil generate AI, sehingga tidak ada aset atau susunan milik pihak lain yang perlu dihindari. **Rasa, palet, kepadatan ornamen, dan tata letaknya semuanya boleh diikuti.**

Dua hal yang tetap perlu diperhatikan:

**Gambar itu ide, bukan desain yang pernah berjalan.** Ia tidak benar-benar mengandung skala tipografi, irama spasi, atau perilaku peralihan antar seksi — semuanya hanya terlihat masuk akal dalam satu gambar diam. Susunannya bisa ditiru, tetapi keputusan spasi dan hierarkinya harus dibuat sungguhan.

**Ornamennya raster dan tidak bisa dipakai ulang.** Sulur dan motif emas di gambar tidak bisa diambil sebagai SVG. Untuk implementasi, ornamen harus digambar khusus atau diambil dari sumber berlisensi bebas yang jelas. Anggaran proyek nol, jadi ini pekerjaan nyata yang perlu masuk perkiraan waktu — bukan aset yang bisa diasumsikan tersedia.

---

## 3. Karakter Arah

Elegan, hangat, bernuansa emas, dengan ornamen botani yang padat namun tertata. Foto tampil besar dan penuh. Tipografi serif klasik dengan huruf besar berspasi lebar.

Kata "minimalist" dari klien **tidak berlaku sebagai instruksi ornamen.** Ia hanya berlaku pada disiplin tata letak: satu kolom, alur vertikal yang jelas, tidak ada elemen yang bersaing dalam satu pandangan.

---

## 4. Palet

| Peran | Warna |
|---|---|
| Latar utama seksi teks | Krem gading |
| Latar penutup | Cokelat sangat gelap, mendekati hitam |
| Ornamen dan aksen | Emas, dua nada — terang untuk garis, tua untuk isian |
| Teks di atas krem | Cokelat gelap |
| Teks di atas foto dan latar gelap | Putih hangat |

**Aturan keras aksesibilitas:** emas dipakai **hanya untuk ornamen, ikon, dan garis** — tidak pernah untuk teks isi. Emas di atas krem hampir pasti gagal WCAG AA, dan ini kesalahan paling umum pada desain bernuansa emas. Teks isi memakai cokelat gelap di atas krem, atau putih hangat di atas latar gelap.

**Warna dari foto:** foto ladang lavender membawa ungu yang kuat. Ungu bukan warna sistem, tetapi palet harus diperiksa agar tidak bertabrakan dengannya. Palet final dikunci setelah seluruh foto diterima.

---

## 5. Tipografi

| Peran | Karakter |
|---|---|
| Monogram | Serif display kontras tinggi, ukuran besar |
| Nama mempelai | Serif, huruf besar, spasi huruf lebar |
| Label kecil | Huruf besar, spasi huruf sangat lebar, ukuran kecil |
| Teks isi dan ayat | Serif, rata tengah, tinggi baris longgar |

**Font yang tidak dipakai:** Playfair Display, Inter, Poppins, Montserrat, dan font skrip generik bergaya kaligrafi kartu ucapan. Alternatif serif yang sesuai karakter referensi antara lain Cormorant Garamond, EB Garamond, atau Crimson Pro.

**Uji wajib:** "Mochamad Ilham Alwi Rifa, S.T." pada layar 390px. Nama ini panjang dan gelarnya ditampilkan. Tunjukkan penanganan pemenggalan barisnya, jangan menghindar dengan hanya memakai nama panggilan.

---

## 6. Sistem Ornamen

Satu sistem yang konsisten, muncul di beberapa tempat:

- **Sulur botani garis emas** di sudut seksi
- **Motif berulang opasitas rendah** sebagai tekstur latar pada seksi krem
- **Pembatas bergelombang organik** untuk peralihan dari foto ke seksi krem
- **Ornamen kecil** sebagai pemisah antar blok teks
- **Aksen daun** mengelilingi monogram

Botani yang dipakai sebaiknya diambil dari yang memang lekat dengan pernikahan Indonesia dan Sunda: melati, sedap malam, kenanga, bambu, padi. Verifikasi asal-usul motif sebelum dipakai, dan jangan mencampur dengan motif dari daerah lain yang sering keliru dianggap Sunda.

---

## 7. Struktur Halaman

| # | Seksi | Catatan |
|---|---|---|
| 1 | Sampul | Foto penuh, monogram, nama, tanggal, **nama tamu**, tombol buka |
| 2 | Ayat | Ayat Al-Qur'an di atas latar krem berornamen |
| 3 | Pembuka | Salam dan kalimat undangan |
| 4 | Mempelai | Foto, nama lengkap bergelar, nama orang tua |
| 5 | Love Story | Linimasa momen |
| 6 | Galeri | Foto prewedding |
| 7 | Detail Acara | Bar gelap tiga kolom: akad, resepsi, lokasi |
| 8 | RSVP | Formulir konfirmasi |
| 9 | Buku Tamu | Ucapan |
| 10 | Hadiah | Nomor rekening dengan tombol salin |
| 11 | Penutup | Ucapan terima kasih |

**Seksi Detail Acara.** Susunan tiga kolom dari referensi — akad, resepsi, lokasi — menyelesaikan masalah dua waktu pada satu venue dengan rapi. Alamat dan peta muncul sekali saja, di kolom lokasi.

---

## 8. Perlakuan Foto

Minimal dua foto tampil penuh selebar layar: satu bernuansa modern, satu berbusana adat Sunda. Keduanya ada di aset prewedding.

**Foto belum diterima.** Sediakan penampung berproporsi tetap dengan bingkai yang sudah dirancang, sehingga foto tinggal dimasukkan tanpa mengubah tata letak.

Teks putih di atas foto membutuhkan lapisan gelap bergradasi di bagian bawah foto agar tetap terbaca, apa pun isi fotonya.

---

## 9. Nama Tamu — Tidak Ada Contohnya di Referensi

Referensi tidak menampilkan nama tamu, karena template semacam itu memang dibuat untuk dikirim ke semua orang tanpa personalisasi.

Justru inilah pembeda utama produk ini, dan bagian ini harus dirancang tanpa contoh.

**Ketentuan:** nama tamu punya tempat yang dirancang di layar sampul, dengan bobot visual yang jelas — bukan ditempel sebagai baris kecil di bawah tanggal. Perlakuannya harus tetap rapi untuk nama pendek maupun nama panjang bergelar.

---

## 10. Anti-Pola

Daftar ini sudah dipersempit karena arah sudah ditentukan referensi.

- Memakai aset vektor tanpa lisensi yang jelas
- Emas sebagai warna teks isi
- Playfair Display, Inter, Poppins, Montserrat
- Font skrip generik bergaya kaligrafi kartu ucapan
- Kartu bersudut membulat seragam dengan bayangan sebagai peniru ketinggian
- Easing memantul atau pegas
- Emoji sebagai ornamen
- Lorem ipsum

---

## 11. Deliverable

Satu mockup, dalam bentuk berkas HTML mandiri yang bisa dibuka langsung di peramban ponsel pada viewport 390px.

Isinya:

1. Layar sampul lengkap dengan perlakuan nama tamu
2. Seksi ayat
3. Seksi detail acara dengan bar tiga kolom
4. Daftar nilai palet beserta rasio kontras teks utama
5. Daftar font dan skala ukuran
6. Catatan sumber ornamen dan lisensinya
7. Catatan bagian palet yang rentan berubah setelah foto diterima

Ekspor ke standalone HTML dan host di Vercel sebelum dikirim ke mempelai — tautan langsung dari alat desain tidak bisa dibuka orang di luar organisasi.

---

## 12. Kriteria Penerimaan

Mockup diterima jika:

1. Nama tamu punya tempat yang dirancang, bukan tempelan.
2. Nama lengkap bergelar diuji dan rapi pada 390px.
3. Tidak ada teks isi berwarna emas.
4. Seluruh kombinasi teks memenuhi WCAG AA, dengan nilainya dicantumkan.
5. Sistem ornamen muncul konsisten di beberapa seksi, bukan satu aksen tunggal.
6. Sumber dan lisensi setiap aset ornamen tercatat.
7. Penampung foto berproporsi tetap tersedia dan bertahan meski isi fotonya berbeda.
8. Sumber dan lisensi setiap aset ornamen tercatat.
9. Bar detail acara menampilkan dua waktu dengan alamat dan peta hanya sekali.
10. Tidak memakai lorem ipsum.
