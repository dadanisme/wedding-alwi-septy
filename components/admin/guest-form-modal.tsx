'use client';

import React, { useState } from 'react';
import type { Guest } from '../../types/database';
import { createGuestAction, updateGuestAction } from '../../app/actions/guests';
import { IconChevronDown, IconX } from './admin-icons';

interface Props {
  guest: Guest | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (guest: Guest) => void;
}

const SALUTATION_PRESETS = [
  'Bapak/Ibu',
  'Bapak',
  'Ibu',
  'Sdr',
  'Sdri',
  'Mas',
  'Mbak',
  'Keluarga',
  'Kustom',
];

const GROUP_PRESETS = [
  { value: 'teman_alwi', label: 'Teman Alwi' },
  { value: 'teman_septy', label: 'Teman Septy' },
  { value: 'keluarga_pria', label: 'Keluarga Pria (Alwi)' },
  { value: 'keluarga_wanita', label: 'Keluarga Wanita (Septy)' },
  { value: 'teman_kerja', label: 'Teman Kerja' },
  { value: 'teman_kuliah', label: 'Teman Kuliah' },
  { value: 'teman_sekolah', label: 'Teman Sekolah' },
  { value: 'vip', label: 'VIP' },
  { value: 'tamu_undangan', label: 'Tamu Undangan Umum' },
  { value: 'custom', label: '+ Kustom / Lainnya' },
];

export default function GuestFormModal({ guest, isOpen, onClose, onSave }: Props) {
  const isEdit = Boolean(guest);

  const initialSalutation = guest?.salutation || 'Bapak/Ibu';
  const isPresetSalutation = SALUTATION_PRESETS.includes(initialSalutation);

  const initialGroup = guest?.guestGroup || 'teman_alwi';
  const matchGroup = GROUP_PRESETS.find((g) => g.value === initialGroup && g.value !== 'custom');

  const [name, setName] = useState(guest?.name || '');
  const [salutationPreset, setSalutationPreset] = useState(isPresetSalutation ? initialSalutation : 'Kustom');
  const [customSalutation, setCustomSalutation] = useState(isPresetSalutation ? '' : initialSalutation);
  const [groupPreset, setGroupPreset] = useState(matchGroup ? initialGroup : 'custom');
  const [customGroup, setCustomGroup] = useState(matchGroup ? '' : initialGroup);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tutup dialog saat tombol Escape ditekan
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim();
    if (!finalName) {
      setError('Nama tamu tidak boleh kosong.');
      return;
    }

    const finalSalutation =
      salutationPreset === 'Kustom'
        ? customSalutation.trim() || 'Bapak/Ibu'
        : salutationPreset;

    const finalGroup =
      groupPreset === 'custom'
        ? customGroup.trim().toLowerCase().replace(/\s+/g, '_') || 'tamu_undangan'
        : groupPreset;

    setIsLoading(true);
    setError(null);

    try {
      if (isEdit && guest) {
        const res = await updateGuestAction(guest.id, {
          name: finalName,
          salutation: finalSalutation,
          guestGroup: finalGroup,
          updateSlug: false,
        });

        if (!res.success || !res.guest) {
          setError(res.error || 'Gagal memperbarui data tamu.');
          setIsLoading(false);
          return;
        }

        onSave(res.guest);
        onClose();
      } else {
        const res = await createGuestAction({
          name: finalName,
          salutation: finalSalutation,
          guestGroup: finalGroup,
        });

        if (!res.success || !res.guest) {
          setError(res.error || 'Gagal menambahkan tamu baru.');
          setIsLoading(false);
          return;
        }

        onSave(res.guest);
        onClose();
      }
    } catch {
      setError('Terjadi galat jaringan saat menyimpan data.');
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
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#E5D8C5] bg-[#FDFBF7] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#E5D8C5] px-6 py-5">
          <h3 className="font-display text-2xl font-bold text-ink">
            {isEdit ? 'Edit Data Tamu' : 'Tambah Tamu Baru'}
          </h3>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl p-2 text-ink-soft hover:bg-[#FAF6F0] hover:text-ink transition"
            aria-label="Tutup"
          >
            <IconX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm text-rose-900">
              {error}
            </div>
          )}
          {/* Sapaan */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft">
              Sapaan / Sebutan
            </label>
            <div className={`mt-1.5 ${salutationPreset === 'Kustom' ? 'grid grid-cols-1 gap-2.5 sm:grid-cols-2' : ''}`}>
              <div className="relative">
                <select
                  value={salutationPreset}
                  onChange={(e) => setSalutationPreset(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-[#D5C6B1] bg-white px-4 py-2.5 pr-10 text-sm text-ink transition focus:border-gold-deep focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-deep/20"
                >
                  {SALUTATION_PRESETS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <IconChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
                />
              </div>

              {salutationPreset === 'Kustom' && (
                <input
                  type="text"
                  placeholder="Ketik sapaan khusus..."
                  value={customSalutation}
                  onChange={(e) => setCustomSalutation(e.target.value)}
                  className="w-full rounded-xl border border-[#D5C6B1] bg-white px-4 py-2.5 text-sm text-ink placeholder-[#A89886] transition focus:border-gold-deep focus:outline-none focus:ring-2 focus:ring-gold-deep/20"
                />
              )}
            </div>
          </div>

          {/* Nama Tamu */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft">
              Nama Lengkap Tamu <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Budi Santoso"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[#D5C6B1] bg-white px-4 py-2.5 text-base text-ink placeholder-[#A89886] transition focus:border-gold-deep focus:outline-none focus:ring-2 focus:ring-gold-deep/20"
            />
          </div>

          {/* Kategori Grup */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft">
              Kategori / Grup Tamu
            </label>
            <div className="mt-1.5 relative">
              <select
                value={groupPreset}
                onChange={(e) => setGroupPreset(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#D5C6B1] bg-white px-4 py-2.5 pr-10 text-sm text-ink transition focus:border-gold-deep focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-deep/20"
              >
                {GROUP_PRESETS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
              <IconChevronDown
                size={16}
                className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
              />
            </div>

            {groupPreset === 'custom' && (
              <input
                type="text"
                placeholder="Nama grup baru (misal: komunitas_gowes)"
                value={customGroup}
                onChange={(e) => setCustomGroup(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#D5C6B1] bg-white px-4 py-2.5 text-sm text-ink placeholder-[#A89886] transition focus:border-gold-deep focus:outline-none focus:ring-2 focus:ring-gold-deep/20"
              />
            )}
          </div>

          {/* Tombol Simpan */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5D8C5]">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="cursor-pointer rounded-xl border border-[#D5C6B1] bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-[#FAF6F0]"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer rounded-xl bg-gold-deep px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-gold-deep/90 disabled:opacity-50"
            >
              {isLoading ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Tamu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
