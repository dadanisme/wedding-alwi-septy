/**
 * Sumber tunggal konten acara — data mempelai, jadwal, venue, dan rekening.
 * Diambil dari docs/PRD.md Bagian 2. Jangan menyalin nilai-nilai ini ke
 * dalam komponen; impor dari sini.
 */

export const couple = {
  groom: {
    fullName: "Mochamad Ilham Alwi Rifa, S.T.",
    firstNamePart: "Mochamad Ilham Alwi",
    titlePart: "Rifa, S.T.",
    nickname: "Alwi",
    father: "Dadang Sukandi",
    mother: "Tini Hernawati",
    parentLabel: "Putra dari Bapak Dadang Sukandi\n& Ibu Tini Hernawati",
    photo: null as string | null,
    photoPlaceholderText: "foto mempelai pria\n3:4",
    photoPlaceholderDesktopText: "foto mempelai pria\n3:4 · 290 × 387",
    instagram: null as string | null,
  },
  bride: {
    fullName: "Septyara Khotimaharani, S.Pd.",
    firstNamePart: "Septyara",
    titlePart: "Khotimaharani, S.Pd.",
    nickname: "Septy",
    father: "Uun Syukur",
    mother: "Imas Yuliah",
    parentLabel: "Putri dari Bapak Uun Syukur\n& Ibu Imas Yuliah",
    photo: null as string | null,
    photoPlaceholderText: "foto mempelai wanita\n3:4",
    photoPlaceholderDesktopText: "foto mempelai wanita\n3:4 · 290 × 387",
    instagram: null as string | null,
  },
} as const;

export const mempelaiConfig = {
  sectionLabel: "Mempelai",
  temporaryNote: "* Foto dan detail profil bersifat sementara dan dapat disesuaikan kembali.",
} as const;


export const eventSchedule = {
  date: "2026-10-10",
  dayLabel: "Sabtu, 10 Oktober 2026",
  dayLabelShort: "Sabtu, 10 Okt 2026",
  akad: { start: "08:00", label: "08.00 WIB" },
  resepsi: { start: "11:00", end: "14:00", label: "11.00 – 14.00 WIB" },
  rsvpSuggestedDeadline: "2026-09-26",
} as const;

export const rsvpConfig = {
  suggestedDeadline: "2026-09-26",
  suggestedDeadlineLabel: "26 September 2026",
  promptBeforeDeadline: "Mohon konfirmasi kehadiran sebelum 26 September 2026.",
  promptAfterDeadline:
    "Batas anjuran konfirmasi telah terlewat, mohon segera konfirmasi kehadiran Anda.",
  successTitle: "Terima kasih atas konfirmasinya",
  successAttending: "Kami menantikan kehadiran Anda.",
  successNotAttending: "Terima kasih atas konfirmasi dan doa restunya.",
  editButtonLabel: "Ubah Konfirmasi",

  // Label kolom catatan. Sesuai PRD §4.3, kolom ini untuk keperluan praktis
  // (alergi makanan, kebutuhan khusus) — doa dan pesan punya seksi Buku Tamu sendiri.
  notesLabel: "Catatan Singkat",
  notesPlaceholder: "Alergi makanan atau kebutuhan khusus",

  // Ringkasan jawaban tersimpan pada kartu konfirmasi bagi tamu yang kembali (PRD §4.3).
  summaryAttending: "Hadir",
  summaryNotAttending: "Belum bisa hadir",
  summaryWithPlusOne: "bersama 1 pendamping",
  summaryWithoutPlusOne: "tanpa pendamping",
  summaryNotesPrefix: "Catatan",

  submitLabel: "Kirim Konfirmasi",
  submittingLabel: "Mengirim",
  cancelButtonLabel: "Batal",
  // Hanya tampil di rute "/" yang tidak punya data tamu. Tamu sungguhan selalu
  // datang lewat link pribadi, jadi mereka tidak pernah melihat teks ini.
  previewNotice:
    "Mode pratinjau. Konfirmasi hanya dapat dikirim dari link undangan pribadi Anda.",
  errorGeneric:
    "Konfirmasi belum tersimpan. Mohon periksa koneksi Anda lalu coba lagi.",
  errorPlusOneNameRequired: "Mohon isi nama pendamping Anda.",
  // Angka pada dua pesan di bawah harus sama dengan batas di bawahnya.
  errorPlusOneNameTooLong: "Nama pendamping maksimal 80 karakter.",
  errorNotesTooLong: "Catatan maksimal 500 karakter.",

  // Batas panjang input, ditegakkan di server (bukan hanya di klien).
  maxPlusOneNameLength: 80,
  maxNotesLength: 500,
} as const;


export const venue = {
  name: "Steikhaus (Area Pabrik Bajoe)",
  nameOnly: "Steikhaus",
  subName: "(Area Pabrik Bajoe)",
  address:
    "Jl. Soekarno-Hatta No.575 D, Gumuruh, Kec. Batununggal, Kota Bandung, Jawa Barat 40275",
  mapsUrl: "https://share.google/LcN0r9PHzHVci6aX8",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=Steikhaus%20Pabrik%20Bajoe%20Bandung&z=16&output=embed",
} as const;

export const giftConfig = {
  title: "Hadiah",
  description:
    "Kehadiran dan doa Anda sudah lebih dari cukup. Bila ingin mengirim tanda kasih, kami sediakan kanal berikut.",
  account: {
    bank: "Blu (BCA Digital)",
    bankDisplay: "Blu · BCA Digital",
    accountNumber: "005516270903",
    accountName: "Septyara Khotimaharani",
    accountHolderDisplay: "a.n. Septyara Khotimaharani",
  },
  copyButtonLabel: "Salin nomor",
  copiedButtonLabel: "Nomor tersalin",
  feedbackDurationMs: 2200,
} as const;

export const giftAccount = giftConfig.account;

export const monogram = {
  white: "/logo/monogram-white.png",
  black: "/logo/monogram-black.png",
  gold: "/logo/monogram-gold.png",
} as const;

/**
 * Musik latar undangan — lagu gamelan Sunda Sabilulungan.
 * Dipicu oleh tombol "Buka Undangan" di layar sampul (PRD §4.2 & §7.1).
 */
export const backgroundMusic = {
  title: "Sabilulungan",
  subtitle: "Sundanese Gamelan",
  src: "/audio/sabilulungan.mp3",
} as const;

/**
 * Foto sampul — dipilih dari public/photos (lihat docs/DECISIONS.md untuk
 * alasan pemilihan). Panel "adatSunda" hanya tampil di layout desktop
 * (dua panel berdampingan); ponsel hanya memakai "modern" (full-bleed).
 */
export const coverPhotos = {
  modern: "/photos/modern-01.jpg",
  adatSunda: "/photos/adat-sunda-02.jpg",
} as const;

/**
 * Ayat Al-Qur'an untuk seksi Ayat. Tidak ada di PRD — ditranskrip dari
 * mockup yang diapprove (docs/mockup/Undangan Alwi & Septy.html, seksi 2).
 * Mockup hanya menyertakan terjemahan, tanpa teks Arab.
 */
export const openingVerse = {
  reference: "Q.S. Ar-Rum : 21",
  translation:
    "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir.",
} as const;

/**
 * Salam & kalimat pengantar untuk seksi Pembuka. Tidak ada di PRD (PRD §4.2
 * hanya menyebut "Salam dan kalimat pengantar") — ditranskrip dari mockup
 * yang diapprove (docs/mockup/Undangan Alwi & Septy.html, seksi 3).
 */
export const openingGreeting = {
  bismillah: "Bismillahirrahmanirrahim",
  salutation: "Assalamu'alaikum Warahmatullahi Wabarakatuh",
  body: "Dengan penuh rasa syukur atas rahmat Allah Subhanahu wa Ta'ala, kami bermaksud menyelenggarakan pernikahan putra dan putri kami. Merupakan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.",
} as const;

/**
 * Foto latar seksi Pembuka — beda dari coverPhotos (Sampul): mockup minta
 * foto potret untuk ponsel dan foto lanskap PENUH untuk desktop (bukan foto
 * potret yang sama di-crop lebar). Dua di antara 21 foto klien memang
 * berorientasi lanskap asli, jadi dipilih foto berbeda per breakpoint,
 * bukan satu foto yang dipaksa cocok ke dua rasio. Lihat docs/DECISIONS.md.
 */
export const openingPhotos = {
  portrait: "/photos/adat-sunda-03.jpg",
  landscape: "/photos/adat-sunda-04.jpg",
} as const;

/**
 * Foto untuk seksi Galeri — seluruh 21 foto dari klien, urut mengikuti
 * penomoran file (modern-01..12 lalu adat-sunda-01..09). `orientation`
 * diukur langsung dari dimensi asli tiap berkas (bukan ditebak): dipakai
 * komponen untuk memilih rasio tile grid per foto, bukan memaksa semua
 * foto ke satu rasio potret seperti wireframe mockup — mockup hanya
 * menyediakan penampung, tanpa foto asli. Lihat docs/DECISIONS.md.
 */
export const galleryPhotos = [
  {
    src: "/photos/modern-01.jpg",
    alt: "Alwi & Septy — foto modern 1",
    orientation: "portrait",
    width: 1333,
    height: 2000,
  },
  {
    src: "/photos/modern-02.jpg",
    alt: "Alwi & Septy — foto modern 2",
    orientation: "portrait",
    width: 1333,
    height: 2000,
  },
  {
    src: "/photos/modern-03.jpg",
    alt: "Alwi & Septy — foto modern 3",
    orientation: "portrait",
    width: 1331,
    height: 2000,
  },
  {
    src: "/photos/modern-04.jpg",
    alt: "Alwi & Septy — foto modern 4",
    orientation: "portrait",
    width: 1331,
    height: 2000,
  },
  {
    src: "/photos/modern-05.jpg",
    alt: "Alwi & Septy — foto modern 5",
    orientation: "landscape",
    width: 2000,
    height: 1333,
  },
  {
    src: "/photos/modern-06.jpg",
    alt: "Alwi & Septy — foto modern 6",
    orientation: "landscape",
    width: 2000,
    height: 1333,
  },
  {
    src: "/photos/modern-07.jpg",
    alt: "Alwi & Septy — foto modern 7",
    orientation: "landscape",
    width: 2000,
    height: 1333,
  },
  {
    src: "/photos/modern-08.jpg",
    alt: "Alwi & Septy — foto modern 8",
    orientation: "landscape",
    width: 2000,
    height: 1333,
  },
  {
    src: "/photos/modern-09.jpg",
    alt: "Alwi & Septy — foto modern 9",
    orientation: "landscape",
    width: 2000,
    height: 1333,
  },
  {
    src: "/photos/modern-10.jpg",
    alt: "Alwi & Septy — foto modern 10",
    orientation: "landscape",
    width: 2000,
    height: 1333,
  },
  {
    src: "/photos/modern-11.jpg",
    alt: "Alwi & Septy — foto modern 11",
    orientation: "landscape",
    width: 2000,
    height: 1333,
  },
  {
    src: "/photos/modern-12.jpg",
    alt: "Alwi & Septy — foto modern 12",
    orientation: "landscape",
    width: 2000,
    height: 1333,
  },
  {
    src: "/photos/adat-sunda-01.jpg",
    alt: "Alwi & Septy — busana adat Sunda 1",
    orientation: "portrait",
    width: 1281,
    height: 2000,
  },
  {
    src: "/photos/adat-sunda-02.jpg",
    alt: "Alwi & Septy — busana adat Sunda 2",
    orientation: "portrait",
    width: 1333,
    height: 2000,
  },
  {
    src: "/photos/adat-sunda-03.jpg",
    alt: "Alwi & Septy — busana adat Sunda 3",
    orientation: "portrait",
    width: 1333,
    height: 2000,
  },
  {
    src: "/photos/adat-sunda-04.jpg",
    alt: "Alwi & Septy — busana adat Sunda 4",
    orientation: "landscape",
    width: 2000,
    height: 1333,
  },
  {
    src: "/photos/adat-sunda-05.jpg",
    alt: "Alwi & Septy — busana adat Sunda 5",
    orientation: "landscape",
    width: 2000,
    height: 1333,
  },
  {
    src: "/photos/adat-sunda-06.jpg",
    alt: "Alwi & Septy — busana adat Sunda 6",
    orientation: "landscape",
    width: 2000,
    height: 1333,
  },
  {
    src: "/photos/adat-sunda-07.jpg",
    alt: "Alwi & Septy — busana adat Sunda 7",
    orientation: "landscape",
    width: 2000,
    height: 1333,
  },
  {
    src: "/photos/adat-sunda-08.jpg",
    alt: "Alwi & Septy — busana adat Sunda 8",
    orientation: "landscape",
    width: 2000,
    height: 1500,
  },
  {
    src: "/photos/adat-sunda-09.jpg",
    alt: "Alwi & Septy — busana adat Sunda 9",
    orientation: "landscape",
    width: 2000,
    height: 1333,
  },
] as const;

/**
 * Konfigurasi dan data awal seksi Buku Tamu (PRD §4.4).
 * Ditranskrip dari data mockup yang diapprove (docs/mockup/Undangan Alwi & Septy.html, seksi 9).
 *
 * PENTING: `guestBookInitialEntries` adalah data CONTOH dari mockup dengan
 * nama-nama fiktif. Sejak integrasi Firestore, entri ini HANYA dipakai di rute
 * pratinjau "/" supaya seksi masih bisa ditinjau visual tanpa data nyata.
 * Rute tamu "/{slug}" tidak pernah menampilkannya — tamu sungguhan tidak boleh
 * melihat ucapan yang tidak pernah ada. Lihat docs/DECISIONS.md.
 */
export interface GuestBookEntry {
  /** ID dokumen Firestore. Kosong hanya pada data contoh mode pratinjau. */
  id?: string;
  name: string;
  /**
   * Penanda waktu statis. Hanya dipakai data contoh mockup di rute pratinjau —
   * ucapan asli membawa `createdAt` dan penanda waktunya dihitung saat render.
   */
  when?: string;
  /** ISO string dari Firestore. Sumber penanda waktu relatif ucapan asli. */
  createdAt?: string;
  msg: string;
}

export const guestBookInitialEntries: readonly GuestBookEntry[] = [
  {
    name: "Rizky & Nadia",
    when: "2 hari lalu",
    msg: "Barakallahu lakuma wa baraka alaikuma. Sampai jumpa di Bandung, Alwi!",
  },
  {
    name: "Keluarga Hernawati",
    when: "4 hari lalu",
    msg: "Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Kami sekeluarga insyaAllah hadir.",
  },
  {
    name: "Teh Yuli",
    when: "1 minggu lalu",
    msg: "Selamat Septy. Doa terbaik untuk kalian berdua dan kedua keluarga.",
  },
] as const;

export const guestBookConfig = {
  title: "Buku Tamu",
  namePlaceholder: "Nama Anda",
  messagePlaceholder: "Tulis ucapan & doa",
  submitButtonLabel: "Kirim Ucapan",
  submittingLabel: "Mengirim",

  // Batas panjang input, ditegakkan di server (bukan hanya di klien).
  maxMessageLength: 500,
  // 80, bukan 60: nilai bawaan kolom ini adalah "Bapak/Ibu " + nama lengkap
  // tamu, dan sapaan itu sendiri sudah 10 karakter. Pada 60, nama Indonesia
  // bergelar yang wajar ("Bapak/Ibu Haji Muhammad Abdurrahman Wahid
  // Syaifuddin Zuhri" = 58) menyisakan ruang yang terlalu tipis, dan tamu
  // ditolak server untuk teks yang tidak pernah ia ketik sendiri. Sama dengan
  // batas nama pendamping di rsvpConfig.
  maxNameLength: 80,

  // Aturan anti-spam (PRD §4.4). Angka pada pesan galat di bawah harus sama
  // dengan angka di sini.
  maxEntriesPerGuest: 3,
  cooldownSeconds: 30,

  // Paginasi (PRD §4.4 "terbaru di atas, dengan paginasi").
  pageSize: 10,

  // Batas jendela yang masih disegarkan berkala. Penyegaran mengambil ulang
  // sebanyak yang sedang ditampilkan, jadi tamu yang menekan "Muat Ucapan
  // Lainnya" berkali-kali akan memicu pembacaan yang makin besar tiap siklus.
  // Di atas ambang ini penyegaran berhenti: tamu sedang membaca arsip, bukan
  // menunggu ucapan baru.
  //
  // 100, bukan 60: ambangnya harus cukup jauh dari batas klik supaya
  // pengiriman tamu sendiri tidak bisa menjatuhkannya. Pada 60, tamu yang
  // sudah menekan muat-lebih lima kali (60 baris) lalu mengirim satu ucapan
  // mendarat di 61 dan kehilangan pembaruan real-time PRD §4.4 untuk sisa
  // sesinya. Dengan 100, dibutuhkan sepuluh klik sengaja — dan jatah kirim
  // hanya 3. Lihat docs/DECISIONS.md.
  maxPollWindow: 100,
  loadMoreLabel: "Muat Ucapan Lainnya",
  loadingMoreLabel: "Memuat",

  // Penyegaran berkala menggantikan listener real-time. Keputusan terkunci di
  // CLAUDE.md melarang klien memegang kredensial baca Firestore, jadi
  // pembaruan ditarik lewat Server Action. Hanya berjalan saat seksi terlihat
  // di layar dan tab sedang aktif — lihat docs/DECISIONS.md.
  pollIntervalMs: 20000,

  emptyStateText:
    "Belum ada ucapan. Jadilah yang pertama menuliskan doa untuk kedua mempelai.",
  justNowLabel: "Baru saja",

  // Hanya tampil di rute "/" yang tidak punya data tamu. Tamu sungguhan selalu
  // datang lewat link pribadi, jadi mereka tidak pernah melihat teks ini.
  previewNotice:
    "Mode pratinjau. Ucapan hanya dapat dikirim dari link undangan pribadi Anda.",

  successNotice: "Ucapan Anda sudah tersimpan. Terima kasih atas doanya.",
  quotaReachedNotice:
    "Anda sudah mengirim 3 ucapan — batas untuk setiap tamu.",

  errorGeneric:
    "Ucapan belum terkirim. Mohon periksa koneksi Anda lalu coba lagi.",
  errorNameRequired: "Mohon isi nama Anda.",
  errorNameTooLong: "Nama maksimal 80 karakter.",
  errorMessageRequired: "Mohon tuliskan ucapan Anda.",
  errorMessageTooLong: "Ucapan maksimal 500 karakter.",
  errorLimitReached:
    "Anda sudah mengirim 3 ucapan — batas untuk setiap tamu.",
  errorCooldown:
    "Mohon tunggu sebentar sebelum mengirim ucapan berikutnya.",
  errorLoadMore: "Gagal memuat ucapan lainnya. Mohon coba lagi.",
} as const;

/**
 * Konten seksi Penutup (Seksi 11, PRD §4.2 item 11).
 * Ditranskrip persis dari mockup yang diapprove (Undangan Alwi & Septy.html).
 */
export const closingConfig = {
  message:
    "Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kedua mempelai.",
  wassalam: "Wassalamu'alaikum Warahmatullahi Wabarakatuh",
  familySignature: `Kel. ${couple.groom.father} \u00A0·\u00A0 Kel. ${couple.bride.father}`,
  monogramAlt: `Monogram ${couple.groom.nickname} & ${couple.bride.nickname}`,
} as const;

/**
 * Konfigurasi dan data seksi Love Story (Seksi 5, PRD §4.2 item 5).
 * Ditranskrip persis dari mockup yang diapprove (Undangan Alwi & Septy.html).
 */
export interface LoveStoryMoment {
  year: string;
  title: string;
  mobileDescription: string;
  desktopDescription: string;
  photo?: string | null;
  placeholderText?: string;
  placeholderDesktopText?: string;
}

export const loveStoryConfig = {
  sectionLabel: "Love Story",
  temporaryNote:
    "* Linimasa dan narasi cerita bersifat sementara dan dapat disesuaikan kembali.",
  moments: [
    {
      year: "2019",
      title: "Awal Perkenalan",
      mobileDescription: "Dipertemukan lewat kegiatan kampus di Bandung.",
      desktopDescription:
        "Dipertemukan lewat kegiatan kampus di Bandung, dari obrolan yang awalnya tidak diniatkan serius.",
      photo: null,
      placeholderText: "2019 · 1:1",
      placeholderDesktopText: "2019 · 4:3",
    },
    {
      year: "2021",
      title: "Menjalin Komitmen",
      mobileDescription: "Sepakat menempuh jalan yang sama, sabar dan perlahan.",
      desktopDescription:
        "Sepakat menempuh jalan yang sama, dijalani perlahan dan dengan sabar.",
      photo: null,
      placeholderText: "2021 · 1:1",
      placeholderDesktopText: "2021 · 4:3",
    },
    {
      year: "2025",
      title: "Lamaran",
      mobileDescription: "Kedua keluarga bertemu dan menetapkan tanggal.",
      desktopDescription:
        "Kedua keluarga bertemu di Bandung dan menetapkan tanggal.",
      photo: null,
      placeholderText: "2025 · 1:1",
      placeholderDesktopText: "2025 · 4:3",
    },
    {
      year: "2026",
      title: "Menuju Halal",
      mobileDescription: "10 Oktober 2026, di Bandung.",
      desktopDescription: "10 Oktober 2026, di hadapan keluarga dan sahabat.",
      photo: null,
      placeholderText: "2026 · 1:1",
      placeholderDesktopText: "2026 · 4:3",
    },
  ] as readonly LoveStoryMoment[],
} as const;


