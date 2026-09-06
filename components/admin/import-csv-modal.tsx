'use client';

import React, { useState, useMemo } from 'react';
import type { Guest } from '../../types/database';
import { parseGuestsCsv, formatGuestGroup } from '../../lib/guest-utils';
import { importGuestsAction } from '../../app/actions/guests';
import {
  IconUpload,
  IconFileText,
  IconAlertTriangle,
  IconCheck,
  IconX,
} from './admin-icons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (count: number, guests?: Guest[]) => void;
}

const CSV_SAMPLE = `name,salutation,guest_group
Budi Santoso,Bapak,teman_kerja
Ani Wijaya,Ibu,keluarga_wanita
Rina Kusuma,Sdri,teman_kuliah
Ahmad Fauzi,Mas,teman_alwi`;

export default function ImportCsvModal({ isOpen, onClose, onImportSuccess }: Props) {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [csvText, setCsvText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parsing reaktif saat csvText berubah
  const parseResult = useMemo(() => {
    if (!csvText.trim()) return { valid: [], errors: [] };
    return parseGuestsCsv(csvText);
  }, [csvText]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result;
      if (typeof text === 'string') {
        setCsvText(text);
      }
    };
    reader.onerror = () => {
      setError('Gagal membaca berkas file.');
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    setActiveTab('paste');
    setCsvText(CSV_SAMPLE);
  };

  const handleSubmit = async () => {
    if (parseResult.valid.length === 0) {
      setError('Tidak ada data tamu yang valid untuk diimpor.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await importGuestsAction(parseResult.valid);
      if (!res.success) {
        setError(res.error || 'Gagal memproses impor CSV ke Firestore.');
        setIsLoading(false);
        return;
      }

      onImportSuccess(res.count || parseResult.valid.length, res.guests);
      onClose();
    } catch {
      setError('Terjadi galat sistem saat mengimpor data.');
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
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-[#E5D8C5] bg-[#FDFBF7] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5D8C5] px-6 py-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-deep/15 text-gold-deep">
                <IconUpload size={20} />
              </div>
              <h3 className="font-display text-2xl font-bold text-ink">
                Impor Data Tamu (CSV)
              </h3>
            </div>
            <p className="mt-1 text-sm text-ink-soft">
              Unggah massal daftar tamu sesuai spesifikasi PRD §4.7 &amp; Lampiran A.
            </p>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl p-2 text-ink-soft hover:bg-[#FAF6F0] hover:text-ink transition"
            aria-label="Tutup"
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Tab Navigasi */}
        <div className="flex items-center justify-between border-b border-[#E5D8C5] bg-[#FAF6F0] px-6 pt-3">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('upload')}
              className={`cursor-pointer inline-flex items-center gap-1.5 border-b-2 px-4 py-2 text-sm font-bold transition ${
                activeTab === 'upload'
                  ? 'border-gold-deep text-gold-deep'
                  : 'border-transparent text-ink-soft hover:text-ink'
              }`}
            >
              <IconUpload size={16} />
              <span>Unggah Berkas .CSV</span>
            </button>
            <button
              onClick={() => setActiveTab('paste')}
              className={`cursor-pointer inline-flex items-center gap-1.5 border-b-2 px-4 py-2 text-sm font-bold transition ${
                activeTab === 'paste'
                  ? 'border-gold-deep text-gold-deep'
                  : 'border-transparent text-ink-soft hover:text-ink'
              }`}
            >
              <IconFileText size={16} />
              <span>Tempel Teks CSV</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleLoadSample}
            className="cursor-pointer text-xs font-semibold text-gold-deep hover:underline pb-2"
          >
            Gunakan Contoh Format
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm text-rose-900">
              {error}
            </div>
          )}

          {activeTab === 'upload' ? (
            <div>
              <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D5C6B1] bg-white p-8 text-center cursor-pointer hover:border-gold-deep hover:bg-[#FAF6F0] transition">
                <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FAF6F0] text-gold-deep">
                  <IconFileText size={32} />
                </div>
                <span className="text-base font-bold text-ink">
                  {fileName ? fileName : 'Pilih berkas CSV atau seret ke sini'}
                </span>
                <span className="mt-1 text-xs text-ink-soft">
                  Mendukung format .csv dengan pemisah koma (,) atau titik koma (;)
                </span>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft mb-1">
                Tempel Data CSV (Header: name,salutation,guest_group)
              </label>
              <textarea
                rows={6}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="name,salutation,guest_group&#10;Budi Santoso,Bapak,teman_kerja&#10;Ani Wijaya,Ibu,keluarga_wanita"
                className="w-full font-mono text-xs sm:text-sm rounded-xl border border-[#D5C6B1] bg-white p-3 text-ink focus:border-gold-deep focus:outline-none"
              />
            </div>
          )}

          {/* Ringkasan Validasi */}
          {csvText.trim() && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                  <IconCheck size={14} />
                  <span>{parseResult.valid.length} Tamu Siap Diimpor</span>
                </span>
                {parseResult.errors.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-800">
                    <IconAlertTriangle size={14} />
                    <span>{parseResult.errors.length} Baris Bermasalah</span>
                  </span>
                )}
              </div>

              {/* Daftar Error jika ada */}
              {parseResult.errors.length > 0 && (
                <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-xs text-rose-900 space-y-1 max-h-24 overflow-y-auto">
                  <div className="font-bold">Rincian Baris yang Dilewati:</div>
                  {parseResult.errors.map((err, idx) => (
                    <div key={idx}>
                      Baris {err.row}: {err.error}
                    </div>
                  ))}
                </div>
              )}

              {/* Tabel Pratinjau 5 Tamu Pertama */}
              {parseResult.valid.length > 0 && (
                <div className="rounded-xl border border-[#E5D8C5] bg-white overflow-hidden shadow-xs">
                  <div className="bg-[#FAF6F0] px-4 py-2 border-b border-[#E5D8C5] text-xs font-bold uppercase tracking-wider text-ink-soft">
                    Pratinjau Tamu (Menampilkan hingga 5 baris pertama)
                  </div>
                  <div className="max-h-40 overflow-y-auto divide-y divide-[#E5D8C5] text-xs">
                    {parseResult.valid.slice(0, 5).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3">
                        <div>
                          <span className="font-bold text-ink">{item.salutation} {item.name}</span>
                        </div>
                        <span className="rounded-lg bg-[#FAF6F0] border border-[#D5C6B1] px-2 py-0.5 text-[11px] text-ink-soft font-semibold">
                          {formatGuestGroup(item.guestGroup || 'tamu_undangan')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[#E5D8C5] bg-[#FDFBF7] px-6 py-4">
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
            onClick={handleSubmit}
            disabled={isLoading || parseResult.valid.length === 0}
            className="cursor-pointer rounded-xl bg-gold-deep px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-gold-deep/90 disabled:opacity-50"
          >
            {isLoading
              ? 'Menyimpan ke Firestore...'
              : `Simpan ${parseResult.valid.length} Tamu ke Firestore`}
          </button>
        </div>
      </div>
    </div>
  );
}
