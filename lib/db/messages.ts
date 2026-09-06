import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '../firebase-admin';
import type { GuestMessage } from '../../types/database';

const COLLECTION_NAME = 'messages';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toIsoString(val: any): string {
  if (!val) return new Date().toISOString();
  if (typeof val === 'string') return val;
  if (typeof val.toDate === 'function') return val.toDate().toISOString();
  if (val instanceof Date) return val.toISOString();
  return new Date().toISOString();
}

/**
 * Mengambil daftar ucapan yang disetujui (tidak disembunyikan admin),
 * diurutkan dari yang paling baru (PRD §4.4).
 * Dilengkapi fallback in-memory sorting jika indeks gabungan Firestore sedang dibangun.
 */
export async function getVisibleMessages(limitCount = 50): Promise<GuestMessage[]> {
  const db = getAdminDb();

  try {
    const snapshot = await db
      .collection(COLLECTION_NAME)
      .where('isHidden', '==', false)
      .orderBy('createdAt', 'desc')
      .limit(limitCount)
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        guestId: data.guestId,
        guestName: data.guestName || 'Tamu Undangan',
        message: data.message || '',
        isHidden: false,
        createdAt: toIsoString(data.createdAt),
      };
    });
  } catch (err: unknown) {
    // Jika composite index sedang dibuat atau belum siap (FAILED_PRECONDITION)
    // fallback ambil dokumen non-hidden lalu sort di memori server
    const errorDetails = String(err);
    if (errorDetails.includes('FAILED_PRECONDITION') || errorDetails.includes('requires an index')) {
      const fallbackSnapshot = await db
        .collection(COLLECTION_NAME)
        .where('isHidden', '==', false)
        .get();

      const items: GuestMessage[] = fallbackSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          guestId: data.guestId,
          guestName: data.guestName || 'Tamu Undangan',
          message: data.message || '',
          isHidden: false,
          createdAt: toIsoString(data.createdAt),
        };
      });

      // Urutkan terbaru di atas
      items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return items.slice(0, limitCount);
    }

    throw err;
  }
}

/**
 * Mengambil seluruh ucapan (termasuk yang disembunyikan) untuk panel moderasi admin.
 */
export async function getAllMessagesForAdmin(): Promise<GuestMessage[]> {
  const db = getAdminDb();
  const snapshot = await db.collection(COLLECTION_NAME).orderBy('createdAt', 'desc').get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      guestId: data.guestId,
      guestName: data.guestName || 'Tamu Undangan',
      message: data.message || '',
      isHidden: Boolean(data.isHidden),
      createdAt: toIsoString(data.createdAt),
    };
  });
}

export interface PostMessageInput {
  guestId?: string;
  guestName: string;
  message: string;
}

/**
 * Mengirim ucapan baru ke Buku Tamu (PRD §4.4).
 * Memvalidasi batas 500 karakter dan maksimal 3 ucapan per link tamu.
 */
export async function postGuestMessage(input: PostMessageInput): Promise<GuestMessage> {
  const cleanName = input.guestName.trim();
  const cleanMsg = input.message.trim();

  if (!cleanName) {
    throw new Error('Nama pengirim wajib diisi.');
  }
  if (!cleanMsg) {
    throw new Error('Pesan ucapan tidak boleh kosong.');
  }
  if (cleanMsg.length > 500) {
    throw new Error('Panjang pesan ucapan melebihi batas 500 karakter.');
  }

  const db = getAdminDb();

  // Batas 3 ucapan per tamu (PRD §4.4)
  if (input.guestId) {
    const existingCount = await db
      .collection(COLLECTION_NAME)
      .where('guestId', '==', input.guestId)
      .count()
      .get();

    if (existingCount.data().count >= 3) {
      throw new Error('Anda telah mencapai batas maksimal 3 ucapan.');
    }
  }

  const docRef = db.collection(COLLECTION_NAME).doc();
  const newMsgData = {
    guestId: input.guestId || null,
    guestName: cleanName,
    message: cleanMsg,
    isHidden: false,
    createdAt: FieldValue.serverTimestamp(),
  };

  await docRef.set(newMsgData);

  return {
    id: docRef.id,
    guestId: input.guestId,
    guestName: cleanName,
    message: cleanMsg,
    isHidden: false,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Moderasi admin: menyembunyikan atau menampilkan kembali ucapan (PRD §4.4).
 */
export async function toggleMessageVisibility(messageId: string, isHidden: boolean): Promise<boolean> {
  const db = getAdminDb();
  await db.collection(COLLECTION_NAME).doc(messageId).update({
    isHidden,
    updatedAt: FieldValue.serverTimestamp(),
  });
  return true;
}
