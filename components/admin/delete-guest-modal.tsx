'use client';

import React, { useState } from 'react';
import type { Guest } from '../../types/database';
import { deleteGuestAction } from '../../app/actions/guests';
import { IconAlertTriangle } from './admin-icons';

interface Props {
  guest: Guest | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (guestId: string) => void;
}

export default function DeleteGuestModal({ guest, isOpen, onClose, onDelete }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tutup dialog saat tombol Escape ditekan
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !guest) return null;

  const hasActivity = guest.openCount > 0 || guest.rsvpStatus !== 'pending';

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await deleteGuestAction(guest.id);
      if (!res.success) {
        setError(res.error || 'Gagal menghapus data tamu.');
        setIsLoading(false);
        return;
      }
      onDelete(guest.id);
      onClose();
    } catch {
      setError('Terjadi galat jaringan saat menghapus tamu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl border border-rose-200 bg-[#FDFBF7] p-6 shadow-2xl"
      >
        <div className="flex items-center gap-3 text-rose-700">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
            <IconAlertTriangle size={22} />
          </div>
          <h3 className="font-display text-2xl font-bold text-ink">
            Hapus Data Tamu
          </h3>
        </div>

        <p className="mt-3 text-sm text-ink-soft leading-relaxed">
          Apakah Anda yakin ingin menghapus data undangan untuk{' '}
          <strong className="text-ink font-bold">
            {guest.salutation} {guest.name}
          </strong>?
        </p>

        {hasActivity && (
          <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 leading-relaxed">
            <strong>Peringatan Aktivitas:</strong> Tamu ini telah{' '}
            {guest.openCount > 0 && `membuka tautan undangan ${guest.openCount}x`}
            {guest.openCount > 0 && guest.rsvpStatus !== 'pending' && ' dan '}
            {guest.rsvpStatus !== 'pending' && `mengisi konfirmasi RSVP (${guest.rsvpStatus === 'attending' ? 'Hadir' : 'Absen'})`}.
            Menghapus data ini akan membatalkan status kehadirannya dan tautan tidak dapat dibuka lagi.
          </div>
        )}

        {error && (
          <div className="mt-3 rounded-xl border border-rose-300 bg-rose-50 p-3 text-xs text-rose-900">
            {error}
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="cursor-pointer rounded-xl border border-[#D5C6B1] bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-[#FAF6F0]"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="cursor-pointer rounded-xl bg-rose-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-rose-800 disabled:opacity-50"
          >
            {isLoading ? 'Menghapus...' : 'Ya, Hapus Tamu'}
          </button>
        </div>
      </div>
    </div>
  );
}
