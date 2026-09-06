import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '../firebase-admin';
import type { RsvpAttendance, RsvpEntry } from '../../types/database';

const COLLECTION_NAME = 'guests';
const HISTORY_SUBCOLLECTION = 'rsvpHistory';

// Batas panjang sebagai pertahanan lapis kedua. Validasi utama ada di
// app/actions/rsvp.ts; nilai di sini mencegah dokumen membengkak bila fungsi
// ini kelak dipanggil dari jalur lain (mis. admin panel atau skrip seeding).
const MAX_PLUS_ONE_NAME_LENGTH = 80;
const MAX_NOTES_LENGTH = 500;

export interface SubmitRsvpInput {
  guestId: string;
  attendance: RsvpAttendance;
  plusOne?: boolean;
  plusOneName?: string;
  notes?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toIsoString(val: any): string | null {
  if (!val) return null;
  if (typeof val === 'string') return val;
  if (typeof val.toDate === 'function') return val.toDate().toISOString();
  if (val instanceof Date) return val.toISOString();
  return null;
}

/**
 * Menyimpan atau memperbarui jawaban RSVP tamu (PRD §4.3).
 *
 * Tamu dapat memperbarui pilihannya kapan saja lewat link yang sama, termasuk
 * membatalkan pendamping. Setiap pengiriman — pertama maupun perubahan —
 * ditambahkan sebagai satu dokumen baru di subkoleksi `rsvpHistory` supaya
 * riwayat perubahan tetap utuh (PRD §7.2).
 *
 * Dijalankan dalam satu transaksi Firestore. Alasannya dua, keduanya nyata
 * karena link boleh diteruskan (PRD §4.1) sehingga dua perangkat bisa mengirim
 * bersamaan:
 *
 * 1. **Atomik.** Pembaruan dokumen tamu dan penulisan riwayat harus sukses atau
 *    gagal bersama. Kalau keduanya ditulis terpisah dan hanya yang kedua gagal,
 *    jawaban tamu sudah tersimpan tetapi pemanggil menerima galat dan
 *    memberitahu tamu "konfirmasi belum tersimpan" — kebalikan dari kenyataan.
 *    Tamu lalu mengirim ulang, dan karena `submittedAt` sudah ada, riwayat
 *    pengiriman pertamanya hilang permanen.
 * 2. **Serialisasi baca-tulis.** `submittedAt` menandai pengiriman pertama dan
 *    tidak boleh bergeser. Tanpa transaksi, dua pengiriman bersamaan sama-sama
 *    membaca dokumen kosong dan sama-sama mengklaim dirinya yang pertama.
 *
 * ID dokumen riwayat sengaja dibuat SEBELUM transaksi: kalau Firestore mengulang
 * transaksi karena contention, penulisan mendarat di dokumen yang sama, bukan
 * menghasilkan baris riwayat ganda.
 */
export async function submitGuestRsvp(input: SubmitRsvpInput): Promise<RsvpEntry> {
  const db = getAdminDb();
  const docRef = db.collection(COLLECTION_NAME).doc(input.guestId);
  const historyRef = docRef.collection(HISTORY_SUBCOLLECTION).doc();

  const now = new Date().toISOString();

  const isAttending = input.attendance === 'attending';
  const hasPlusOne = isAttending && Boolean(input.plusOne);
  const plusOneName = hasPlusOne
    ? (input.plusOneName?.trim() || '').slice(0, MAX_PLUS_ONE_NAME_LENGTH)
    : '';
  const notes = (input.notes?.trim() || '').slice(0, MAX_NOTES_LENGTH);

  const submittedAtIso = await db.runTransaction(async (tx) => {
    const doc = await tx.get(docRef);

    if (!doc.exists) {
      throw new Error('Data tamu tidak ditemukan.');
    }

    const data = doc.data()!;

    // "Pertama" ditentukan oleh ADA-TIDAKNYA map `rsvp`, bukan oleh ada-tidaknya
    // field `submittedAt` di dalamnya. Dokumen hasil impor atau seeding bisa
    // punya map `rsvp` tanpa `submittedAt`; kalau itu dianggap pengiriman
    // pertama, waktu respons asli tamu tertimpa diam-diam.
    const existingRsvp =
      data.rsvp && typeof data.rsvp === 'object' ? data.rsvp : null;
    const existingSubmittedAt = existingRsvp?.submittedAt ?? null;

    tx.update(docRef, {
      rsvpStatus: input.attendance,
      rsvp: {
        attendance: input.attendance,
        plusOne: hasPlusOne,
        plusOneName,
        notes,
        // Pertahankan nilai asli jika ada; pakai jam server untuk yang baru
        // (termasuk saat map `rsvp` ada tetapi rusak/tanpa submittedAt).
        submittedAt: existingSubmittedAt ?? FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Jejak audit: satu dokumen per pengiriman, tidak pernah ditimpa (PRD §7.2).
    tx.set(historyRef, {
      attendance: input.attendance,
      plusOne: hasPlusOne,
      plusOneName,
      notes,
      isFirstSubmission: existingRsvp === null,
      timestamp: FieldValue.serverTimestamp(),
    });

    return toIsoString(existingSubmittedAt) ?? now;
  });

  return {
    attendance: input.attendance,
    plusOne: hasPlusOne,
    plusOneName,
    notes,
    submittedAt: submittedAtIso,
    updatedAt: now,
  };
}
