'use server';

import { revalidatePath } from 'next/cache';
import { verifyAdminSession } from '../../lib/auth';
import {
  createGuest,
  updateGuest,
  deleteGuest,
  batchImportGuests,
  type CreateGuestInput,
  type UpdateGuestInput,
  type BatchImportGuestItem,
} from '../../lib/db/guests';
import type { Guest } from '../../types/database';

export interface GuestActionResult {
  success: boolean;
  error?: string;
  guest?: Guest;
  guests?: Guest[];
  count?: number;
}

/**
 * Server Action untuk menambah tamu baru satu per satu (PRD §4.7).
 */
export async function createGuestAction(
  input: CreateGuestInput
): Promise<GuestActionResult> {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return {
      success: false,
      error: 'Sesi admin tidak sah atau telah kedaluwarsa. Silakan login kembali.',
    };
  }

  const trimmedName = typeof input.name === 'string' ? input.name.trim() : '';
  if (!trimmedName) {
    return { success: false, error: 'Nama tamu wajib diisi.' };
  }
  if (trimmedName.length > 100) {
    return { success: false, error: 'Nama tamu maksimal 100 karakter.' };
  }

  const salutation = typeof input.salutation === 'string' ? input.salutation.trim() : 'Bapak/Ibu';
  const guestGroup = typeof input.guestGroup === 'string' ? input.guestGroup.trim() : 'tamu_undangan';

  try {
    const newGuest = await createGuest({
      name: trimmedName,
      salutation: salutation || 'Bapak/Ibu',
      guestGroup: guestGroup || 'tamu_undangan',
    });

    revalidatePath('/admin');
    return { success: true, guest: newGuest };
  } catch (err) {
    console.error('Gagal createGuestAction:', err);
    return {
      success: false,
      error: 'Terjadi kesalahan basis data saat menambahkan tamu.',
    };
  }
}

/**
 * Server Action untuk memperbarui data tamu (PRD §4.7).
 */
export async function updateGuestAction(
  guestId: string,
  input: UpdateGuestInput
): Promise<GuestActionResult> {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return {
      success: false,
      error: 'Sesi admin tidak sah atau telah kedaluwarsa. Silakan login kembali.',
    };
  }

  if (typeof guestId !== 'string' || !guestId.trim()) {
    return { success: false, error: 'ID tamu tidak valid.' };
  }

  if (input.name !== undefined) {
    const trimmed = input.name.trim();
    if (!trimmed) {
      return { success: false, error: 'Nama tamu tidak boleh kosong.' };
    }
    if (trimmed.length > 100) {
      return { success: false, error: 'Nama tamu maksimal 100 karakter.' };
    }
  }

  try {
    const updated = await updateGuest(guestId.trim(), input);
    if (!updated) {
      return { success: false, error: 'Data tamu tidak ditemukan.' };
    }

    revalidatePath('/admin');
    return { success: true, guest: updated };
  } catch (err) {
    console.error('Gagal updateGuestAction:', err);
    return {
      success: false,
      error: 'Terjadi kesalahan sistem saat memperbarui data tamu.',
    };
  }
}

/**
 * Server Action untuk menghapus tamu dari sistem (PRD §4.7).
 */
export async function deleteGuestAction(
  guestId: string
): Promise<GuestActionResult> {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return {
      success: false,
      error: 'Sesi admin tidak sah atau telah kedaluwarsa. Silakan login kembali.',
    };
  }

  if (typeof guestId !== 'string' || !guestId.trim()) {
    return { success: false, error: 'ID tamu tidak valid.' };
  }

  try {
    const ok = await deleteGuest(guestId.trim());
    if (!ok) {
      return { success: false, error: 'Tamu tidak ditemukan atau sudah dihapus.' };
    }

    revalidatePath('/admin');
    return { success: true };
  } catch (err) {
    console.error('Gagal deleteGuestAction:', err);
    return {
      success: false,
      error: 'Terjadi kesalahan sistem saat menghapus data tamu.',
    };
  }
}

/**
 * Server Action untuk impor tamu secara massal via CSV (PRD §4.7 & Lampiran A).
 */
export async function importGuestsAction(
  items: BatchImportGuestItem[]
): Promise<GuestActionResult> {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return {
      success: false,
      error: 'Sesi admin tidak sah atau telah kedaluwarsa. Silakan login kembali.',
    };
  }

  if (!Array.isArray(items) || items.length === 0) {
    return { success: false, error: 'Tidak ada data tamu yang valid untuk diimpor.' };
  }

  if (items.length > 1000) {
    return { success: false, error: 'Maksimal 1000 tamu per sekali impor.' };
  }

  // Filter dan sanitasi data
  const validItems: BatchImportGuestItem[] = [];
  for (const item of items) {
    const name = typeof item.name === 'string' ? item.name.trim() : '';
    if (name) {
      validItems.push({
        name,
        salutation: typeof item.salutation === 'string' && item.salutation.trim() ? item.salutation.trim() : 'Bapak/Ibu',
        guestGroup: typeof item.guestGroup === 'string' && item.guestGroup.trim() ? item.guestGroup.trim() : 'tamu_undangan',
      });
    }
  }

  if (validItems.length === 0) {
    return { success: false, error: 'Tidak ada baris data dengan nama tamu yang valid.' };
  }

  try {
    const { count, guests } = await batchImportGuests(validItems);
    revalidatePath('/admin');
    return { success: true, count, guests };
  } catch (err) {
    console.error('Gagal importGuestsAction:', err);
    return {
      success: false,
      error: 'Terjadi kesalahan basis data saat mengimpor data tamu.',
    };
  }
}
