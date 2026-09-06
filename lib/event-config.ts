/**
 * Sumber tunggal konten acara — data mempelai, jadwal, venue, dan rekening.
 * Diambil dari docs/PRD.md Bagian 2. Jangan menyalin nilai-nilai ini ke
 * dalam komponen; impor dari sini.
 */

export const couple = {
  groom: {
    fullName: "Mochamad Ilham Alwi Rifa, S.T.",
    nickname: "Alwi",
    father: "Dadang Sukandi",
    mother: "Tini Hernawati",
  },
  bride: {
    fullName: "Septyara Khotimaharani, S.Pd.",
    nickname: "Septy",
    father: "Uun Syukur",
    mother: "Imas Yuliah",
  },
} as const;

export const eventSchedule = {
  date: "2026-10-10",
  dayLabel: "Sabtu, 10 Oktober 2026",
  akad: { start: "08:00", label: "08.00 WIB" },
  resepsi: { start: "11:00", end: "14:00", label: "11.00 – 14.00 WIB" },
  rsvpSuggestedDeadline: "2026-09-26",
} as const;

export const venue = {
  name: "Steikhaus (Area Pabrik Bajoe)",
  address:
    "Jl. Soekarno-Hatta No.575 D, Gumuruh, Kec. Batununggal, Kota Bandung, Jawa Barat 40275",
  mapsUrl: "https://share.google/LcN0r9PHzHVci6aX8",
} as const;

export const giftAccount = {
  bank: "Blu (BCA Digital)",
  accountNumber: "005516270903",
  accountName: "Septyara Khotimaharani",
} as const;

export const monogram = {
  white: "/logo/monogram-white.png",
  black: "/logo/monogram-black.png",
  gold: "/logo/monogram-gold.png",
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
