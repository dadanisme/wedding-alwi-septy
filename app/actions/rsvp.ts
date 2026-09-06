"use server";

import { getGuestByFullSlug } from "@/lib/db/guests";
import { submitGuestRsvp } from "@/lib/db/rsvp";
import { rsvpConfig } from "@/lib/event-config";
import type { RsvpAttendance, RsvpEntry } from "@/types/database";

export interface SubmitRsvpActionInput {
  /**
   * Slug lengkap dari URL tamu ("nama-slug-token"). Dipakai sebagai kredensial,
   * bukan Firestore document ID — lihat catatan keamanan di bawah.
   */
  fullSlug: string;
  attendance: string;
  plusOne: boolean;
  plusOneName: string;
  notes: string;
}

export type SubmitRsvpActionResult =
  | { success: true; rsvp: RsvpEntry }
  | { success: false; error: string };

const VALID_ATTENDANCE: readonly RsvpAttendance[] = [
  "attending",
  "not_attending",
];

/**
 * Server Action penyimpanan jawaban RSVP tamu (PRD §4.3).
 *
 * Seluruh input divalidasi ulang di sini, bukan hanya di klien: Server Action
 * adalah endpoint HTTP publik, jadi payload apa pun bisa dikirim langsung tanpa
 * melewati formulir React.
 *
 * Keamanan: tamu diidentifikasi lewat `fullSlug` (token pada URL undangannya),
 * bukan lewat Firestore document ID. Model keamanan produk ini adalah
 * "kepemilikan link" (PRD §4.1 — link boleh diteruskan, tidak ada PIN), sehingga
 * token URL memang kredensial yang tepat. Document ID adalah pengenal internal
 * yang tidak seharusnya menjadi syarat cukup untuk menulis data tamu.
 */
export async function submitRsvpAction(
  input: SubmitRsvpActionInput
): Promise<SubmitRsvpActionResult> {
  try {
    // --- Validasi bentuk payload ---
    if (!input || typeof input !== "object") {
      return { success: false, error: rsvpConfig.errorGeneric };
    }

    const fullSlug =
      typeof input.fullSlug === "string" ? input.fullSlug.trim() : "";
    if (!fullSlug) {
      return { success: false, error: rsvpConfig.errorGeneric };
    }

    const attendance = input.attendance;
    if (
      typeof attendance !== "string" ||
      !VALID_ATTENDANCE.includes(attendance as RsvpAttendance)
    ) {
      return { success: false, error: rsvpConfig.errorGeneric };
    }
    const validAttendance = attendance as RsvpAttendance;

    // --- Normalisasi aturan pendamping (PRD §4.3) ---
    // Pendamping hanya bermakna bila tamu hadir. Tidak ada kuota, penghitung,
    // atau keadaan "penuh" — pembatas apa pun sengaja tidak dibangun (PRD §2.4).
    const isAttending = validAttendance === "attending";
    const plusOne = isAttending && input.plusOne === true;

    const rawPlusOneName =
      typeof input.plusOneName === "string" ? input.plusOneName.trim() : "";
    const plusOneName = plusOne ? rawPlusOneName : "";

    // Nama pendamping dibutuhkan untuk tata kursi (PRD §4.3).
    if (plusOne && !plusOneName) {
      return { success: false, error: rsvpConfig.errorPlusOneNameRequired };
    }
    if (plusOneName.length > rsvpConfig.maxPlusOneNameLength) {
      return { success: false, error: rsvpConfig.errorPlusOneNameTooLong };
    }

    const rawNotes = typeof input.notes === "string" ? input.notes.trim() : "";
    if (rawNotes.length > rsvpConfig.maxNotesLength) {
      return { success: false, error: rsvpConfig.errorNotesTooLong };
    }

    // --- Resolusi tamu dari token URL ---
    const guest = await getGuestByFullSlug(fullSlug);
    if (!guest) {
      return { success: false, error: rsvpConfig.errorGeneric };
    }

    const rsvp = await submitGuestRsvp({
      guestId: guest.id,
      attendance: validAttendance,
      plusOne,
      plusOneName,
      notes: rawNotes,
    });

    return { success: true, rsvp };
  } catch (error) {
    console.error("Gagal menyimpan RSVP:", error);
    return { success: false, error: rsvpConfig.errorGeneric };
  }
}
