/**
 * Tipe data untuk basis data Firestore Wedding Alwi & Septy.
 * Sesuai spesifikasi PRD §4.1, §4.3, §4.4, §4.5, dan §7.2.
 */

export type RsvpAttendance = 'attending' | 'not_attending';
export type RsvpStatus = 'pending' | 'attending' | 'not_attending';

export interface RsvpEntry {
  attendance: RsvpAttendance;
  plusOne: boolean;
  plusOneName?: string;
  notes?: string;
  submittedAt: string; // ISO string untuk kemudahan serialisasi
  updatedAt: string;
}

export interface Guest {
  id: string; // Firestore document ID
  slug: string; // Slug nama (misal: "budi-santoso")
  token: string; // Token acak minimal 8 karakter (misal: "a7f3k9m2")
  fullSlug: string; // Gabungan "slug-token" untuk lookup URL (misal: "budi-santoso-a7f3k9m2")
  name: string; // Nama lengkap tamu (misal: "Budi Santoso")
  salutation: string; // Sapaan (misal: "Bapak", "Ibu", "Sdr", "Sdri")
  guestGroup: string; // Kategori tamu (misal: "keluarga_pria", "keluarga_wanita", "teman_alwi", "teman_septy", "vip")
  plusOneAllowed: boolean; // Selalu true sesuai keputusan PRD §2.4

  // Pelacakan Pembukaan (PRD §4.5)
  openedAt: string | null; // ISO string waktu tombol "Buka Undangan" pertama kali ditekan
  lastOpenedAt: string | null;
  openCount: number; // Jumlah pembukaan nyata oleh tamu
  uniqueDevices: string[]; // Hash anonim perangkat berbeda untuk deteksi anomali penerusan link
  autoVisitCount: number; // Kunjungan bot WhatsApp / scraper preview

  // RSVP (PRD §4.3)
  rsvpStatus: RsvpStatus;
  rsvp: RsvpEntry | null;

  createdAt: string;
  updatedAt: string;
}

export interface GuestMessage {
  id: string;
  guestId?: string; // ID tamu jika dikirim dari link personal
  guestName: string; // Nama pengirim ucapan
  message: string; // Teks ucapan (maksimal 500 karakter)
  isHidden: boolean; // Flag moderasi admin (default false)
  createdAt: string; // ISO string
}

export interface AccessLog {
  id: string;
  guestId: string;
  fullSlug: string;
  eventType: 'open_button' | 'bot_preview' | 'page_view';
  userAgent?: string;
  deviceHash: string; // SHA-256 hash anonim (user-agent + IP anonim)
  createdAt: string;
}

export interface GuestSummaryStats {
  totalGuests: number;
  openedCount: number;
  unopenedCount: number;
  attendingCount: number;
  notAttendingCount: number;
  pendingCount: number;
  totalPlusOne: number;
  projectedHeadcount: number; // attending + plusOne + keluarga inti (50)
  maxCapacity: number; // 250
}
