"use server";

import { getGuestByFullSlug } from "@/lib/db/guests";
import { getVisibleMessages, postGuestMessage } from "@/lib/db/messages";
import { guestBookConfig, type GuestBookEntry } from "@/lib/event-config";
import type { GuestMessage } from "@/types/database";

/**
 * Server Action Buku Tamu (PRD §4.4).
 *
 * Keamanan mengikuti pola yang sudah dikunci di `app/actions/rsvp.ts`: tamu
 * diidentifikasi lewat `fullSlug` (token pada URL undangannya), bukan lewat
 * Firestore document ID. Model keamanan produk ini adalah kepemilikan link
 * (PRD §4.1 — link boleh diteruskan, PIN ditolak), sehingga token URL memang
 * kredensial yang tepat; document ID hanyalah pengenal internal.
 *
 * Seluruh input divalidasi ulang di sini, bukan hanya di formulir: Server
 * Action adalah endpoint HTTP publik, jadi payload apa pun bisa dikirim
 * langsung tanpa melewati React.
 */

/** Bentuk yang dikonsumsi komponen. Dipisahkan dari bentuk dokumen Firestore. */
function toEntry(message: GuestMessage): GuestBookEntry {
  return {
    id: message.id,
    name: message.guestName,
    msg: message.message,
    createdAt: message.createdAt,
  };
}

export interface SubmitGuestMessageInput {
  /** Slug lengkap dari URL tamu ("nama-slug-token"). Dipakai sebagai kredensial. */
  fullSlug: string;
  name: string;
  message: string;
  /**
   * Kunci idempotensi buatan klien, satu per naskah ucapan. Kirim ulang naskah
   * yang sama membawa kunci yang sama, sehingga tidak menghasilkan ucapan
   * ganda ketika respons pengiriman pertama hilang di jaringan.
   */
  clientKey?: string;
}

export type SubmitGuestMessageResult =
  | { success: true; entry: GuestBookEntry; remaining: number }
  | {
      success: false;
      error: string;
      /**
       * Sebab penolakan yang dapat dibaca mesin. Klien memakai ini, BUKAN
       * membandingkan teks galat yang sudah dilokalkan — perbandingan string
       * memaksa dua kunci config tetap identik byte demi byte hanya supaya
       * antarmukanya tetap koheren.
       */
      reason?: string;
    };

export async function submitGuestMessageAction(
  input: SubmitGuestMessageInput
): Promise<SubmitGuestMessageResult> {
  try {
    if (!input || typeof input !== "object") {
      return { success: false, error: guestBookConfig.errorGeneric };
    }

    const fullSlug =
      typeof input.fullSlug === "string" ? input.fullSlug.trim() : "";
    if (!fullSlug) {
      return { success: false, error: guestBookConfig.errorGeneric };
    }

    const name = typeof input.name === "string" ? input.name.trim() : "";
    const message =
      typeof input.message === "string" ? input.message.trim() : "";

    if (!name) {
      return { success: false, error: guestBookConfig.errorNameRequired };
    }
    if (name.length > guestBookConfig.maxNameLength) {
      return { success: false, error: guestBookConfig.errorNameTooLong };
    }
    if (!message) {
      return { success: false, error: guestBookConfig.errorMessageRequired };
    }
    if (message.length > guestBookConfig.maxMessageLength) {
      return { success: false, error: guestBookConfig.errorMessageTooLong };
    }

    // Kunci idempotensi menjadi ID dokumen Firestore, jadi bentuknya dibatasi
    // ketat: tanpa ini, pemanggil bisa mengirim "../" dan sejenisnya. Kunci
    // yang tidak lolos dibuang, bukan ditolak — pengiriman tetap berjalan,
    // hanya tanpa jaminan idempotensi.
    const rawKey =
      typeof input.clientKey === "string" ? input.clientKey.trim() : "";
    const clientKey = /^[A-Za-z0-9_-]{8,64}$/.test(rawKey) ? rawKey : "";

    // Resolusi tamu dari token URL. Ucapan anonim tidak diterima: batas 3
    // ucapan dan jeda antar pengiriman keduanya bersandar pada identitas tamu.
    const guest = await getGuestByFullSlug(fullSlug);
    if (!guest) {
      // Pesan sengaja generik. Membedakan "link tidak dikenali" dari galat
      // koneksi akan membocorkan apakah sebuah link pernah ada — hal yang
      // justru dijaga oleh halaman 404 generik (PRD §4.1).
      return { success: false, error: guestBookConfig.errorGeneric };
    }

    const result = await postGuestMessage({
      guestId: guest.id,
      guestName: name,
      message,
      clientKey,
    });

    if (!result.ok) {
      return {
        success: false,
        error: rejectionMessage(result.reason),
        reason: result.reason,
      };
    }

    return {
      success: true,
      entry: toEntry(result.message),
      remaining: result.remaining,
    };
  } catch (error) {
    console.error("Gagal menyimpan ucapan Buku Tamu:", error);
    return { success: false, error: guestBookConfig.errorGeneric };
  }
}

function rejectionMessage(reason: string): string {
  switch (reason) {
    case "limit_reached":
      return guestBookConfig.errorLimitReached;
    case "cooldown":
      return guestBookConfig.errorCooldown;
    case "empty_name":
      return guestBookConfig.errorNameRequired;
    case "name_too_long":
      return guestBookConfig.errorNameTooLong;
    case "empty_message":
      return guestBookConfig.errorMessageRequired;
    case "message_too_long":
      return guestBookConfig.errorMessageTooLong;
    case "key_taken":
      // Tabrakan kunci praktis mustahil dari klien yang sah; pesan generik
      // sudah cukup dan tidak membocorkan keberadaan dokumen tamu lain.
      return guestBookConfig.errorGeneric;
    default:
      return guestBookConfig.errorGeneric;
  }
}

export interface FetchGuestMessagesInput {
  /** Slug lengkap dari URL tamu. Kredensial baca, sama seperti pada pengiriman. */
  fullSlug: string;
  limit: number;
}

export type FetchGuestMessagesResult =
  | { success: true; entries: GuestBookEntry[]; hasMore: boolean }
  | { success: false };

/**
 * Mengambil satu halaman ucapan yang tampil, terbaru di atas.
 *
 * Dipakai untuk dua hal sekaligus: tombol "Muat Ucapan Lainnya" dan penyegaran
 * berkala. `limit` selalu dihitung dari puncak daftar, bukan dari cursor,
 * supaya satu bacaan yang sama menangkap ucapan baru DAN ucapan yang baru
 * disembunyikan admin (PRD §4.4 — penyembunyian juga berlaku real-time).
 *
 * Menuntut `fullSlug` yang sah, sama seperti pengiriman. Buku tamu memang
 * tampil ke setiap tamu, tetapi daftar itu berisi nama-nama orang yang
 * diundang — dan seluruh postur privasi produk ini bersandar pada kerahasiaan
 * link (halaman 404 generik yang tidak membocorkan keberadaan link, `noindex`
 * menyeluruh, PRD §4.1). Tanpa gerbang ini, ID Server Action yang ikut terkirim
 * di bundel publik rute "/" sudah cukup untuk membaca seluruh buku tamu dari
 * domain telanjang. Biayanya satu pembacaan dokumen tamu per pemanggilan.
 *
 * Kegagalan dikembalikan sebagai `{ success: false }`, bukan sebagai daftar
 * kosong: pemanggil harus bisa membedakan "belum ada ucapan" dari "gagal
 * memuat", supaya penyegaran yang gagal tidak mengosongkan daftar di layar.
 */
export async function fetchGuestMessagesAction(
  input: FetchGuestMessagesInput
): Promise<FetchGuestMessagesResult> {
  try {
    if (!input || typeof input !== "object") {
      return { success: false };
    }

    const fullSlug =
      typeof input.fullSlug === "string" ? input.fullSlug.trim() : "";
    if (!fullSlug) {
      return { success: false };
    }

    const guest = await getGuestByFullSlug(fullSlug);
    if (!guest) {
      return { success: false };
    }

    // getVisibleMessages sudah menjepit nilainya; penjepitan di sini menjaga
    // NaN/negatif dari pemanggil yang tidak melewati komponen.
    const requested = Number(input.limit);
    const safeLimit = Number.isFinite(requested)
      ? Math.trunc(requested)
      : guestBookConfig.pageSize;

    const page = await getVisibleMessages(safeLimit);

    return {
      success: true,
      entries: page.messages.map(toEntry),
      hasMore: page.hasMore,
    };
  } catch (error) {
    console.error("Gagal memuat ucapan Buku Tamu:", error);
    return { success: false };
  }
}
