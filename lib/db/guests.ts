import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '../firebase-admin';
import type { Guest, GuestSummaryStats } from '../../types/database';
import crypto from 'crypto';

const COLLECTION_NAME = 'guests';

// Helper konversi timestamp dokumen Firestore ke format ISO string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toIsoString(val: any): string | null {
  if (!val) return null;
  if (typeof val === 'string') return val;
  if (typeof val.toDate === 'function') return val.toDate().toISOString();
  if (val instanceof Date) return val.toISOString();
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapGuestDoc(id: string, data: Record<string, any>): Guest {
  return {
    id,
    slug: data.slug || '',
    token: data.token || '',
    fullSlug: data.fullSlug || '',
    name: data.name || '',
    salutation: data.salutation || 'Bapak/Ibu',
    guestGroup: data.guestGroup || 'tamu_undangan',
    plusOneAllowed: data.plusOneAllowed ?? true,
    openedAt: toIsoString(data.openedAt),
    lastOpenedAt: toIsoString(data.lastOpenedAt),
    openCount: data.openCount || 0,
    uniqueDevices: Array.isArray(data.uniqueDevices) ? data.uniqueDevices : [],
    autoVisitCount: data.autoVisitCount || 0,
    rsvpStatus: data.rsvpStatus || 'pending',
    rsvp: data.rsvp
      ? {
          attendance: data.rsvp.attendance,
          plusOne: Boolean(data.rsvp.plusOne),
          plusOneName: data.rsvp.plusOneName || '',
          notes: data.rsvp.notes || '',
          submittedAt: toIsoString(data.rsvp.submittedAt) || new Date().toISOString(),
          updatedAt: toIsoString(data.rsvp.updatedAt) || new Date().toISOString(),
        }
      : null,
    createdAt: toIsoString(data.createdAt) || new Date().toISOString(),
    updatedAt: toIsoString(data.updatedAt) || new Date().toISOString(),
  };
}

/**
 * Mencari data tamu berdasarkan fullSlug (misal: "budi-santoso-a7f3k9m2").
 */
export async function getGuestByFullSlug(fullSlug: string): Promise<Guest | null> {
  const db = getAdminDb();
  const snapshot = await db
    .collection(COLLECTION_NAME)
    .where('fullSlug', '==', fullSlug.trim().toLowerCase())
    .limit(1)
    .get();

  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return mapGuestDoc(doc.id, doc.data());
}

/**
 * Mencari data tamu berdasarkan Document ID.
 */
export async function getGuestById(id: string): Promise<Guest | null> {
  const db = getAdminDb();
  const doc = await db.collection(COLLECTION_NAME).doc(id).get();
  if (!doc.exists) return null;
  return mapGuestDoc(doc.id, doc.data()!);
}

/**
 * Mencatat pembukaan nyata oleh tamu undangan saat menekan tombol di layar sampul.
 * Menyimpan waktu buka, jumlah pembukaan, serta mendeteksi perangkat unik (PRD §4.5).
 */
export async function recordGuestOpen(guestId: string, deviceHash: string): Promise<boolean> {
  const db = getAdminDb();
  const docRef = db.collection(COLLECTION_NAME).doc(guestId);
  const doc = await docRef.get();

  if (!doc.exists) return false;
  const data = doc.data()!;

  const updates: Record<string, unknown> = {
    openCount: FieldValue.increment(1),
    lastOpenedAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  // Jika ini pembukaan pertama kali
  if (!data.openedAt) {
    updates.openedAt = FieldValue.serverTimestamp();
  }

  // Tambahkan hash perangkat jika belum pernah tercatat
  if (deviceHash) {
    updates.uniqueDevices = FieldValue.arrayUnion(deviceHash);
  }

  await docRef.update(updates);
  return true;
}

/**
 * Mencatat kunjungan otomatis oleh bot pratinjau WhatsApp / scraper
 * secara terpisah agar tidak mencemari metrik pembukaan tamu nyata (PRD §4.5).
 */
export async function recordGuestBotVisit(guestId: string): Promise<boolean> {
  const db = getAdminDb();
  const docRef = db.collection(COLLECTION_NAME).doc(guestId);
  await docRef.update({
    autoVisitCount: FieldValue.increment(1),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return true;
}

export interface CreateGuestInput {
  name: string;
  salutation?: string;
  guestGroup?: string;
  slug?: string;
  token?: string;
}

export interface UpdateGuestInput {
  name?: string;
  salutation?: string;
  guestGroup?: string;
  updateSlug?: boolean;
}

export interface BatchImportGuestItem {
  name: string;
  salutation?: string;
  guestGroup?: string;
}

/**
 * Menghasilkan slug URL yang bersih dan aman dari karakter non-alfanumerik/aksen.
 */
export function generateGuestSlug(name: string): string {
  const normalized = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return normalized || 'tamu';
}

/**
 * Membuat data tamu baru dengan token acak 8 karakter (PRD §4.1).
 */
export async function createGuest(input: CreateGuestInput): Promise<Guest> {
  const db = getAdminDb();

  // Generate slug dari nama jika tidak diberikan
  const slug = input.slug || generateGuestSlug(input.name);

  // Generate token acak minimal 8 karakter
  const token = input.token || crypto.randomBytes(4).toString('hex'); // 8 hex characters
  const fullSlug = `${slug}-${token}`;

  const docRef = db.collection(COLLECTION_NAME).doc();
  const newGuestData = {
    slug,
    token,
    fullSlug,
    name: input.name.trim(),
    salutation: input.salutation?.trim() || 'Bapak/Ibu',
    guestGroup: input.guestGroup?.trim() || 'tamu_undangan',
    plusOneAllowed: true, // PRD §2.4: terbuka untuk semua tamu tanpa pembatas
    openedAt: null,
    lastOpenedAt: null,
    openCount: 0,
    uniqueDevices: [],
    autoVisitCount: 0,
    rsvpStatus: 'pending',
    rsvp: null,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  await docRef.set(newGuestData);

  return {
    id: docRef.id,
    ...newGuestData,
    openedAt: null,
    lastOpenedAt: null,
    openCount: 0,
    uniqueDevices: [],
    autoVisitCount: 0,
    rsvpStatus: 'pending',
    rsvp: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Memperbarui data tamu yang sudah ada.
 */
export async function updateGuest(
  guestId: string,
  input: UpdateGuestInput
): Promise<Guest | null> {
  const db = getAdminDb();
  const docRef = db.collection(COLLECTION_NAME).doc(guestId);
  const doc = await docRef.get();

  if (!doc.exists) return null;
  const currentData = doc.data()!;

  const updates: Record<string, unknown> = {
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (input.name !== undefined && input.name.trim()) {
    const trimmedName = input.name.trim();
    updates.name = trimmedName;

    // Jika belum pernah dibuka dan belum ada kunjungan, aman untuk memperbarui slug & fullSlug
    const isUnopened = !currentData.openedAt && (currentData.openCount || 0) === 0;
    if (input.updateSlug ?? isUnopened) {
      const newSlug = generateGuestSlug(trimmedName);
      updates.slug = newSlug;
      updates.fullSlug = `${newSlug}-${currentData.token}`;
    }
  }

  if (input.salutation !== undefined) {
    updates.salutation = input.salutation.trim() || 'Bapak/Ibu';
  }

  if (input.guestGroup !== undefined) {
    updates.guestGroup = input.guestGroup.trim() || 'tamu_undangan';
  }

  await docRef.update(updates);
  const updatedDoc = await docRef.get();
  return mapGuestDoc(updatedDoc.id, updatedDoc.data()!);
}

/**
 * Menghapus tamu dari basis data.
 */
export async function deleteGuest(guestId: string): Promise<boolean> {
  const db = getAdminDb();
  const docRef = db.collection(COLLECTION_NAME).doc(guestId);
  const doc = await docRef.get();
  if (!doc.exists) return false;

  await docRef.delete();
  return true;
}

/**
 * Impor tamu secara massal dalam batch write Firestore (PRD §4.7 & Lampiran A).
 */
export async function batchImportGuests(
  items: BatchImportGuestItem[]
): Promise<{ count: number; guests: Guest[] }> {
  const db = getAdminDb();
  const results: Guest[] = [];

  const CHUNK_SIZE = 400;
  for (let i = 0; i < items.length; i += CHUNK_SIZE) {
    const chunk = items.slice(i, i + CHUNK_SIZE);
    const batch = db.batch();

    for (const item of chunk) {
      const trimmedName = item.name.trim();
      if (!trimmedName) continue;

      const slug = generateGuestSlug(trimmedName);
      const token = crypto.randomBytes(4).toString('hex');
      const fullSlug = `${slug}-${token}`;
      const docRef = db.collection(COLLECTION_NAME).doc();

      const newGuestData = {
        slug,
        token,
        fullSlug,
        name: trimmedName,
        salutation: item.salutation?.trim() || 'Bapak/Ibu',
        guestGroup: item.guestGroup?.trim() || 'tamu_undangan',
        plusOneAllowed: true,
        openedAt: null,
        lastOpenedAt: null,
        openCount: 0,
        uniqueDevices: [],
        autoVisitCount: 0,
        rsvpStatus: 'pending',
        rsvp: null,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      batch.set(docRef, newGuestData);

      results.push({
        id: docRef.id,
        ...newGuestData,
        openedAt: null,
        lastOpenedAt: null,
        openCount: 0,
        uniqueDevices: [],
        autoVisitCount: 0,
        rsvpStatus: 'pending',
        rsvp: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    await batch.commit();
  }

  return { count: results.length, guests: results };
}

/**
 * Mengambil seluruh tamu (digunakan oleh Admin Panel).
 */
export async function getAllGuests(): Promise<Guest[]> {
  const db = getAdminDb();
  const snapshot = await db.collection(COLLECTION_NAME).orderBy('createdAt', 'desc').get();
  return snapshot.docs.map((doc) => mapGuestDoc(doc.id, doc.data()));
}

/**
 * Menghitung statistik ringkas tamu dan proyeksi headcount (PRD §2.4 & §4.7).
 */
export async function getGuestStats(): Promise<GuestSummaryStats> {
  const guests = await getAllGuests();

  let openedCount = 0;
  let attendingCount = 0;
  let notAttendingCount = 0;
  let pendingCount = 0;
  let totalPlusOne = 0;
  let totalBotVisits = 0;

  for (const guest of guests) {
    if (guest.openedAt || guest.openCount > 0) {
      openedCount++;
    }
    if (guest.autoVisitCount) {
      totalBotVisits += guest.autoVisitCount;
    }
    if (guest.rsvpStatus === 'attending') {
      attendingCount++;
      if (guest.rsvp?.plusOne) {
        totalPlusOne++;
      }
    } else if (guest.rsvpStatus === 'not_attending') {
      notAttendingCount++;
    } else {
      pendingCount++;
    }
  }

  const KELUARGA_INTI_PANITIA = 50; // Asumsi PRD §2.4
  const projectedHeadcount = attendingCount + totalPlusOne + KELUARGA_INTI_PANITIA;

  return {
    totalGuests: guests.length,
    openedCount,
    unopenedCount: guests.length - openedCount,
    attendingCount,
    notAttendingCount,
    pendingCount,
    totalPlusOne,
    totalBotVisits,
    projectedHeadcount,
    maxCapacity: 250,
  };
}
