'use server';

import { revalidatePath } from 'next/cache';
import { verifyAdminSession } from '../../lib/auth';
import { toggleMessageVisibility } from '../../lib/db/messages';

export interface ModerationActionResult {
  success: boolean;
  error?: string;
}

/**
 * Server Action untuk memoderasi (sembunyikan / tampilkan kembali) ucapan di Buku Tamu (PRD §4.4).
 * Wajib terlindung oleh sesi admin yang sah.
 */
export async function toggleMessageVisibilityAction(
  messageId: string,
  isHidden: boolean
): Promise<ModerationActionResult> {
  const session = await verifyAdminSession();
  if (!session.authenticated) {
    return {
      success: false,
      error: 'Sesi admin tidak sah atau telah kedaluwarsa. Silakan muat ulang dan login kembali.',
    };
  }

  if (typeof messageId !== 'string' || !messageId.trim()) {
    return { success: false, error: 'ID ucapan tidak valid.' };
  }

  if (typeof isHidden !== 'boolean') {
    return { success: false, error: 'Status visibilitas tidak valid.' };
  }

  try {
    const ok = await toggleMessageVisibility(messageId.trim(), isHidden);
    if (!ok) {
      return { success: false, error: 'Gagal memperbarui status ucapan di basis data.' };
    }

    revalidatePath('/admin');
    return { success: true };
  } catch (err) {
    console.error('Gagal toggleMessageVisibilityAction:', err);
    return {
      success: false,
      error: 'Terjadi kesalahan sistem saat memproses moderasi ucapan.',
    };
  }
}
