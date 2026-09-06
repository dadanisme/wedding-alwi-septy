import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '../firebase-admin';
import type { RsvpAttendance, RsvpEntry } from '../../types/database';

export interface SubmitRsvpInput {
  guestId: string;
  attendance: RsvpAttendance;
  plusOne?: boolean;
  plusOneName?: string;
  notes?: string;
}

/**
 * Menyimpan atau memperbarui jawaban RSVP tamu (PRD §4.3).
 * Tamu dapat memperbarui pilihan kapan saja sebelum hari-H.
 */
export async function submitGuestRsvp(input: SubmitRsvpInput): Promise<RsvpEntry> {
  const db = getAdminDb();
  const docRef = db.collection('guests').doc(input.guestId);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error('Data tamu tidak ditemukan.');
  }

  const data = doc.data()!;
  const now = new Date().toISOString();

  const isAttending = input.attendance === 'attending';
  const hasPlusOne = isAttending && Boolean(input.plusOne);
  const plusOneName = hasPlusOne ? (input.plusOneName?.trim() || '') : '';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existingRsvp = data.rsvp as Record<string, any> | undefined;
  const existingSubmittedAt = existingRsvp?.submittedAt;

  const rsvpData: RsvpEntry = {
    attendance: input.attendance,
    plusOne: hasPlusOne,
    plusOneName,
    notes: input.notes?.trim() || '',
    submittedAt: existingSubmittedAt
      ? (typeof existingSubmittedAt.toDate === 'function'
          ? existingSubmittedAt.toDate().toISOString()
          : existingSubmittedAt)
      : now,
    updatedAt: now,
  };

  await docRef.update({
    rsvpStatus: input.attendance,
    rsvp: {
      ...rsvpData,
      submittedAt: existingSubmittedAt ? existingSubmittedAt : FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    updatedAt: FieldValue.serverTimestamp(),
  });

  // Catat riwayat pengisian ke subkoleksi audit
  await docRef.collection('rsvpHistory').add({
    ...rsvpData,
    timestamp: FieldValue.serverTimestamp(),
  });

  return rsvpData;
}
