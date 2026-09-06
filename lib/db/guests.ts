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

/**
 * Membuat data tamu baru dengan token acak 8 karakter (PRD §4.1).
 */
export async function createGuest(input: CreateGuestInput): Promise<Guest> {
  const db = getAdminDb();

  // Generate slug dari nama jika tidak diberikan
  const slug =
    input.slug ||
    input.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

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

  for (const guest of guests) {
    if (guest.openedAt || guest.openCount > 0) {
      openedCount++;
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
    projectedHeadcount,
    maxCapacity: 250,
  };
}
