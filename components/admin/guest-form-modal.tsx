'use client';

import React, { useState } from 'react';
import type { Guest } from '../../types/database';
import { createGuestAction, updateGuestAction } from '../../app/actions/guests';

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
  const [updateSlug, setUpdateSlug] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          updateSlug,
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-[#E5D8C5] bg-[#FDFBF7] p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E5D8C5] pb-4">
          <h3 className="font-display text-2xl font-bold text-ink">
            {isEdit ? 'Edit Data Tamu' : 'Tambah Tamu Baru'}
          </h3>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl p-2 text-ink-soft hover:bg-[#FAF6F0] hover:text-ink transition"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm text-rose-900">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Sapaan */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft">
              Sapaan / Sebutan
            </label>
            <div className="mt-1 flex gap-2">
              <select
                value={salutationPreset}
                onChange={(e) => setSalutationPreset(e.target.value)}
                className="w-1/2 rounded-xl border border-[#D5C6B1] bg-white px-3 py-2.5 text-sm text-ink focus:border-gold-deep focus:outline-none"
              >
                {SALUTATION_PRESETS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              {salutationPreset === 'Kustom' && (
                <input
                  type="text"
                  placeholder="Ketik sapaan..."
                  value={customSalutation}
                  onChange={(e) => setCustomSalutation(e.target.value)}
                  className="w-1/2 rounded-xl border border-[#D5C6B1] bg-white px-3 py-2.5 text-sm text-ink focus:border-gold-deep focus:outline-none"
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
              className="mt-1 w-full rounded-xl border border-[#D5C6B1] bg-white px-4 py-2.5 text-base text-ink placeholder-[#A89886] focus:border-gold-deep focus:outline-none"
            />
          </div>

          {/* Kategori Grup */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft">
              Kategori / Grup Tamu
            </label>
            <select
              value={groupPreset}
              onChange={(e) => setGroupPreset(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#D5C6B1] bg-white px-3 py-2.5 text-sm text-ink focus:border-gold-deep focus:outline-none"
            >
              {GROUP_PRESETS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>

            {groupPreset === 'custom' && (
              <input
                type="text"
                placeholder="Nama grup baru (misal: komunitas_gowes)"
                value={customGroup}
                onChange={(e) => setCustomGroup(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#D5C6B1] bg-white px-3 py-2.5 text-sm text-ink focus:border-gold-deep focus:outline-none"
              />
            )}
          </div>

          {/* Opsi Update Slug saat Edit */}
          {isEdit && guest && (
            <div className="rounded-xl border border-[#E5D8C5] bg-[#FAF6F0] p-4 text-xs space-y-2 text-ink-soft">
              <div className="flex items-center justify-between">
                <span>Slug URL saat ini:</span>
                <span className="font-mono font-semibold text-gold-deep">{guest.fullSlug}</span>
              </div>
              <label className="flex items-start gap-2 pt-2 cursor-pointer border-t border-[#E5D8C5]">
                <input
                  type="checkbox"
                  checked={updateSlug}
                  onChange={(e) => setUpdateSlug(e.target.checked)}
                  className="mt-0.5 rounded border-[#D5C6B1] text-gold-deep focus:ring-gold-deep"
                />
                <span className="text-ink">
                  Perbarui tautan slug jika nama berubah (jangan dicentang jika tautan sudah disebar ke tamu).
                </span>
              </label>
            </div>
          )}

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
