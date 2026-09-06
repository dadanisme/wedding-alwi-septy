'use client';

import React, { useState, useMemo, useSyncExternalStore } from 'react';
import type { Guest } from '../../types/database';
import { formatGuestGroup, exportGuestsToCsv } from '../../lib/guest-utils';
import WhatsAppModal from './whatsapp-modal';
import GuestFormModal from './guest-form-modal';
import DeleteGuestModal from './delete-guest-modal';
import ImportCsvModal from './import-csv-modal';
import {
  IconUserPlus,
  IconUpload,
  IconDownload,
  IconWhatsApp,
  IconLink,
  IconEdit,
  IconTrash,
  IconCheck,
  IconSearch,
  IconX,
  IconChevronDown,
  IconClock,
  IconAlertTriangle,
} from './admin-icons';

interface Props {
  guests: Guest[];
  onGuestAdded: (guest: Guest) => void;
  onGuestUpdated: (guest: Guest) => void;
  onGuestDeleted: (guestId: string) => void;
  onGuestsImported: (count: number, newGuests?: Guest[]) => void;
  setNotice: (notice: { type: 'success' | 'error'; text: string }) => void;
}

type RsvpFilter = 'all' | 'pending' | 'attending' | 'not_attending' | 'opened' | 'unopened';

export default function GuestManagement({
  guests,
  onGuestAdded,
  onGuestUpdated,
  onGuestDeleted,
  onGuestsImported,
  setNotice,
}: Props) {
  const [rsvpFilter, setRsvpFilter] = useState<RsvpFilter>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [copiedGuestId, setCopiedGuestId] = useState<string | null>(null);

  // Ambil origin browser secara aman untuk hydration React 19
  const origin = useSyncExternalStore(
    () => () => {},
    () => (typeof window !== 'undefined' ? window.location.origin : ''),
    () => ''
  );

  // Modals state
  const [selectedWaGuest, setSelectedWaGuest] = useState<Guest | null>(null);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingGuest, setDeletingGuest] = useState<Guest | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Handler filter yang langsung mereset halaman ke 1 tanpa cascading render
  const handleRsvpFilterChange = (f: RsvpFilter) => {
    setRsvpFilter(f);
    setCurrentPage(1);
  };

  const handleGroupFilterChange = (g: string) => {
    setGroupFilter(g);
    setCurrentPage(1);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (s: number) => {
    setPageSize(s);
    setCurrentPage(1);
  };

  // Hitung jumlah kategori untuk filter tab
  const counts = useMemo(() => {
    let pending = 0;
    let attending = 0;
    let notAttending = 0;
    let opened = 0;
    let unopened = 0;

    for (const g of guests) {
      if (g.rsvpStatus === 'attending') attending++;
      else if (g.rsvpStatus === 'not_attending') notAttending++;
      else pending++;

      if (g.openedAt || g.openCount > 0) opened++;
      else unopened++;
    }

    return { total: guests.length, pending, attending, notAttending, opened, unopened };
  }, [guests]);

  // Daftar grup unik yang ada di data
  const availableGroups = useMemo(() => {
    const set = new Set<string>();
    guests.forEach((g) => {
      if (g.guestGroup) set.add(g.guestGroup);
    });
    return Array.from(set).sort();
  }, [guests]);

  // Filter tamu
  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      // Filter status
      if (rsvpFilter === 'pending' && g.rsvpStatus !== 'pending') return false;
      if (rsvpFilter === 'attending' && g.rsvpStatus !== 'attending') return false;
      if (rsvpFilter === 'not_attending' && g.rsvpStatus !== 'not_attending') return false;
      if (rsvpFilter === 'opened' && !(g.openedAt || g.openCount > 0)) return false;
      if (rsvpFilter === 'unopened' && (g.openedAt || g.openCount > 0)) return false;

      // Filter grup
      if (groupFilter !== 'all' && g.guestGroup !== groupFilter) return false;

      // Pencarian nama / sapaan / catatan
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = g.name.toLowerCase().includes(q);
        const matchSalutation = g.salutation.toLowerCase().includes(q);
        const matchNotes = g.rsvp?.notes?.toLowerCase().includes(q) || false;
        const matchPlusOne = g.rsvp?.plusOneName?.toLowerCase().includes(q) || false;
        return matchName || matchSalutation || matchNotes || matchPlusOne;
      }

      return true;
    });
  }, [guests, rsvpFilter, groupFilter, searchQuery]);

  // Paginasi
  const totalPages = Math.max(1, Math.ceil(filteredGuests.length / pageSize));
  const paginatedGuests = useMemo(() => {
    if (pageSize >= 500) return filteredGuests;
    const start = (currentPage - 1) * pageSize;
    return filteredGuests.slice(start, start + pageSize);
  }, [filteredGuests, currentPage, pageSize]);

  // Handler Salin Link Personal Cepat
  const handleCopyLink = async (guest: Guest) => {
    const fullUrl = `${origin.replace(/\/+$/, '')}/${guest.fullSlug}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedGuestId(guest.id);
      setTimeout(() => setCopiedGuestId(null), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = fullUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedGuestId(guest.id);
      setTimeout(() => setCopiedGuestId(null), 2000);
    }
  };

  // Handler Ekspor CSV
  const handleExportCsv = (onlyFiltered = false) => {
    const dataToExport = onlyFiltered ? filteredGuests : guests;
    if (dataToExport.length === 0) {
      setNotice({ type: 'error', text: 'Tidak ada data tamu untuk diekspor.' });
      return;
    }
    exportGuestsToCsv(dataToExport, origin || 'https://wedding-alwi.vercel.app');
    setNotice({
      type: 'success',
      text: `Berhasil mengunduh CSV (${dataToExport.length} data tamu) untuk kebutuhan katering & tata kursi.`,
    });
  };

  const formatDateTime = (iso: string | null) => {
    if (!iso) return '-';
    try {
      const d = new Date(iso);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return iso;
    }
  };

  return (
    <section className="rounded-2xl border border-[#E5D8C5] bg-white p-6 sm:p-8 shadow-md">
      {/* Header Bagian Manajemen Tamu */}
      <div className="flex flex-col gap-4 border-b border-[#E5D8C5] pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-[#FAF6F0] border border-gold-deep/30 px-3 py-1 text-xs font-bold tracking-wider text-gold-deep uppercase">
              Manajemen Tamu (PRD §4.7)
            </span>
          </div>
          <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-ink">
            Daftar &amp; Generator Tautan Tamu
          </h3>
          <p className="mt-1.5 text-sm sm:text-base text-ink-soft">
            Kelola {guests.length} tamu undangan, generator pesan WhatsApp personal, pelacakan buka sampul, dan ekspor katering.
          </p>
        </div>

        {/* Tombol Aksi Utama: Tambah, Impor, Ekspor */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-gold-deep px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-gold-deep/90"
          >
            <IconUserPlus size={16} />
            <span>Tambah Tamu</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-[#D5C6B1] bg-[#FAF6F0] px-4 py-2.5 text-sm font-bold text-ink shadow-xs transition hover:bg-[#EFE7D8]"
          >
            <IconUpload size={16} />
            <span>Impor CSV</span>
          </button>

          <button
            onClick={() => handleExportCsv(false)}
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-[#D5C6B1] bg-white px-4 py-2.5 text-sm font-bold text-ink shadow-xs transition hover:bg-[#FAF6F0]"
          >
            <IconDownload size={16} />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Kontrol Filter */}
      <div className="mt-6 space-y-4">
        {/* Tab Status RSVP & Buka */}
        <div className="flex flex-nowrap items-center gap-2 overflow-x-auto pb-1 text-sm font-bold whitespace-nowrap">
          <button
            onClick={() => handleRsvpFilterChange('all')}
            className={`cursor-pointer shrink-0 rounded-xl px-4 py-2 transition shadow-xs ${
              rsvpFilter === 'all'
                ? 'bg-gold-deep text-white'
                : 'border border-[#D5C6B1] bg-[#FAF6F0] text-ink hover:bg-[#EFE7D8]'
            }`}
          >
            Semua ({counts.total})
          </button>

          <button
            onClick={() => handleRsvpFilterChange('pending')}
            className={`cursor-pointer shrink-0 rounded-xl px-4 py-2 transition shadow-xs ${
              rsvpFilter === 'pending'
                ? 'bg-amber-600 text-white'
                : 'border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100'
            }`}
          >
            Belum Respons ({counts.pending})
          </button>

          <button
            onClick={() => handleRsvpFilterChange('attending')}
            className={`cursor-pointer shrink-0 rounded-xl px-4 py-2 transition shadow-xs ${
              rsvpFilter === 'attending'
                ? 'bg-emerald-700 text-white'
                : 'border border-[#D5C6B1] bg-[#FAF6F0] text-ink hover:bg-[#EFE7D8]'
            }`}
          >
            Hadir ({counts.attending})
          </button>

          <button
            onClick={() => handleRsvpFilterChange('not_attending')}
            className={`cursor-pointer shrink-0 rounded-xl px-4 py-2 transition shadow-xs ${
              rsvpFilter === 'not_attending'
                ? 'bg-rose-700 text-white'
                : 'border border-[#D5C6B1] bg-[#FAF6F0] text-ink hover:bg-[#EFE7D8]'
            }`}
          >
            Tidak Hadir ({counts.notAttending})
          </button>

          <button
            onClick={() => handleRsvpFilterChange('opened')}
            className={`cursor-pointer shrink-0 rounded-xl px-4 py-2 transition shadow-xs ${
              rsvpFilter === 'opened'
                ? 'bg-ink text-white'
                : 'border border-[#D5C6B1] bg-[#FAF6F0] text-ink hover:bg-[#EFE7D8]'
            }`}
          >
            Sudah Buka ({counts.opened})
          </button>

          <button
            onClick={() => handleRsvpFilterChange('unopened')}
            className={`cursor-pointer shrink-0 rounded-xl px-4 py-2 transition shadow-xs ${
              rsvpFilter === 'unopened'
                ? 'bg-ink text-white'
                : 'border border-[#D5C6B1] bg-[#FAF6F0] text-ink hover:bg-[#EFE7D8]'
            }`}
          >
            Belum Buka ({counts.unopened})
          </button>
        </div>

        {/* Baris Pencarian & Dropdown Kategori */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <IconSearch
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari nama tamu, sapaan, atau catatan..."
              className="w-full rounded-xl border border-[#D5C6B1] bg-[#FAF6F0] pl-10 pr-9 py-2.5 text-sm text-ink placeholder-[#9C8B7B] transition focus:border-gold-deep focus:bg-white focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
                title="Hapus pencarian"
              >
                <IconX size={15} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <select
                value={groupFilter}
                onChange={(e) => handleGroupFilterChange(e.target.value)}
                className="cursor-pointer appearance-none rounded-xl border border-[#D5C6B1] bg-[#FAF6F0] pl-3.5 pr-9 py-2.5 text-sm text-ink font-medium focus:border-gold-deep focus:outline-none"
              >
                <option value="all">Semua Kategori Grup</option>
                {availableGroups.map((grp) => (
                  <option key={grp} value={grp}>
                    {formatGuestGroup(grp)}
                  </option>
                ))}
              </select>
              <IconChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft"
              />
            </div>

            <div className="relative">
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="cursor-pointer appearance-none rounded-xl border border-[#D5C6B1] bg-[#FAF6F0] pl-3.5 pr-9 py-2.5 text-sm text-ink font-medium focus:border-gold-deep focus:outline-none"
              >
                <option value={25}>25 / halaman</option>
                <option value={50}>50 / halaman</option>
                <option value={100}>100 / halaman</option>
                <option value={9999}>Tampilkan Semua</option>
              </select>
              <IconChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft"
              />
            </div>
          </div>
        </div>

        {/* Ringkasan Filter & Tombol Reminder Cepat */}
        {rsvpFilter === 'pending' && counts.pending > 0 && (
          <div className="flex flex-col gap-2 rounded-xl border border-amber-300 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between text-amber-900">
            <div className="flex items-center gap-2.5">
              <IconClock size={20} className="shrink-0 text-amber-700" />
              <span className="text-sm font-semibold">
                Ada {counts.pending} tamu belum konfirmasi RSVP. Disarankan mulai kirim reminder menjelang 26 September 2026.
              </span>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Gunakan tombol WhatsApp di kolom kanan untuk kirim pesan reminder
            </span>
          </div>
        )}
      </div>

      {/* Tabel Tamu */}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-[#E5D8C5]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#E5D8C5] bg-[#FAF6F0] text-xs font-bold uppercase tracking-wider text-ink-soft">
            <tr>
              <th className="px-4 py-3.5">Tamu Undangan</th>
              <th className="px-4 py-3.5">Kategori Grup</th>
              <th className="px-4 py-3.5">Status Buka</th>
              <th className="px-4 py-3.5">Status RSVP</th>
              <th className="px-4 py-3.5">Catatan / Alergi</th>
              <th className="px-4 py-3.5 text-right">Aksi &amp; WhatsApp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5D8C5] bg-white">
            {paginatedGuests.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-ink-soft">
                  {guests.length === 0
                    ? 'Belum ada tamu terdaftar. Silakan tambah tamu atau impor CSV.'
                    : 'Tidak ada tamu yang cocok dengan filter atau pencarian.'}
                </td>
              </tr>
            ) : (
              paginatedGuests.map((guest) => {
                const isOpened = Boolean(guest.openedAt || guest.openCount > 0);
                const hasMultipleDevices = (guest.uniqueDevices?.length || 0) > 1;

                return (
                  <tr key={guest.id} className="hover:bg-[#FAF6F0]/60 transition">
                    {/* Nama & Sapaan */}
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-ink">
                        <span className="text-ink-soft font-normal">{guest.salutation} </span>
                        {guest.name}
                      </div>
                      <div className="mt-0.5 text-xs font-mono text-gold-deep">
                        /{guest.fullSlug}
                      </div>
                    </td>

                    {/* Kategori Grup */}
                    <td className="px-4 py-3.5">
                      <span className="inline-block rounded-lg bg-[#FAF6F0] border border-[#D5C6B1] px-2.5 py-1 text-xs font-semibold text-ink-soft">
                        {formatGuestGroup(guest.guestGroup)}
                      </span>
                    </td>

                    {/* Status Buka Sampul */}
                    <td className="px-4 py-3.5">
                      {isOpened ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                            <IconCheck size={12} className="stroke-[3]" />
                            <span>Dibuka ({guest.openCount}x)</span>
                          </span>
                          <div className="text-[11px] text-ink-soft">
                            {formatDateTime(guest.lastOpenedAt || guest.openedAt)}
                          </div>
                          {hasMultipleDevices && (
                            <div className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-900" title="Tautan dibuka dari beberapa perangkat berbeda">
                              <IconAlertTriangle size={11} className="text-amber-800 shrink-0" />
                              <span>{guest.uniqueDevices.length} Perangkat</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span className="inline-block rounded-full bg-gray-100 border border-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
                            Belum Buka
                          </span>
                          {guest.autoVisitCount > 0 && (
                            <div className="text-[10px] text-ink-soft" title="Pratinjau link oleh bot WhatsApp">
                              WA Preview: {guest.autoVisitCount}x
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Status RSVP */}
                    <td className="px-4 py-3.5">
                      {guest.rsvpStatus === 'attending' ? (
                        <div className="space-y-1">
                          <span className="inline-block rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-xs font-bold text-emerald-900">
                            Hadir {guest.rsvp?.plusOne ? '(2 Orang)' : '(1 Orang)'}
                          </span>
                          {guest.rsvp?.plusOne && (
                            <div className="text-xs text-ink-soft">
                              +1 {guest.rsvp.plusOneName ? `(${guest.rsvp.plusOneName})` : 'Pendamping'}
                            </div>
                          )}
                        </div>
                      ) : guest.rsvpStatus === 'not_attending' ? (
                        <span className="inline-block rounded-full bg-rose-100 border border-rose-300 px-2.5 py-0.5 text-xs font-bold text-rose-900">
                          Tidak Hadir
                        </span>
                      ) : (
                        <span className="inline-block rounded-full bg-amber-100 border border-amber-300 px-2.5 py-0.5 text-xs font-bold text-amber-900">
                          Belum Konfirmasi
                        </span>
                      )}
                    </td>

                    {/* Catatan / Alergi */}
                    <td className="px-4 py-3.5 max-w-[200px]">
                      {guest.rsvp?.notes ? (
                        <p className="line-clamp-2 text-xs text-ink-soft italic" title={guest.rsvp.notes}>
                          &ldquo;{guest.rsvp.notes}&rdquo;
                        </p>
                      ) : (
                        <span className="text-xs text-ink-soft/40">-</span>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Tombol WhatsApp */}
                        <button
                          onClick={() => setSelectedWaGuest(guest)}
                          className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-2.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#20bd5a] transition"
                          title="Buka Generator WhatsApp"
                        >
                          <IconWhatsApp size={14} />
                          <span className="hidden xl:inline">WhatsApp</span>
                        </button>

                        {/* Tombol Salin Link */}
                        <button
                          onClick={() => handleCopyLink(guest)}
                          className="cursor-pointer rounded-lg border border-[#D5C6B1] bg-white p-2 text-xs font-semibold text-ink hover:bg-[#FAF6F0] transition"
                          title="Salin tautan personal"
                        >
                          {copiedGuestId === guest.id ? (
                            <IconCheck size={14} className="text-emerald-700 stroke-[3]" />
                          ) : (
                            <IconLink size={14} />
                          )}
                        </button>

                        {/* Tombol Edit */}
                        <button
                          onClick={() => setEditingGuest(guest)}
                          className="cursor-pointer rounded-lg border border-[#D5C6B1] bg-white p-2 text-xs font-semibold text-ink hover:bg-[#FAF6F0] transition"
                          title="Edit tamu"
                        >
                          <IconEdit size={14} />
                        </button>

                        {/* Tombol Hapus */}
                        <button
                          onClick={() => setDeletingGuest(guest)}
                          className="cursor-pointer rounded-lg border border-rose-200 bg-rose-50 p-2 text-xs font-semibold text-rose-800 hover:bg-rose-100 transition"
                          title="Hapus tamu"
                        >
                          <IconTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Paginasi & Baris Bawah */}
      <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row text-xs text-ink-soft">
        <div>
          Menampilkan{' '}
          <strong className="text-ink font-semibold">{paginatedGuests.length}</strong> dari{' '}
          <strong className="text-ink font-semibold">{filteredGuests.length}</strong> tamu tersaring
          {filteredGuests.length !== guests.length && ` (Total keseluruhan: ${guests.length} tamu)`}.
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="cursor-pointer rounded-lg border border-[#D5C6B1] bg-white px-3 py-1 text-xs font-semibold text-ink disabled:opacity-40"
            >
              Sebelumnya
            </button>
            <span className="px-2 font-medium">
              Halaman {currentPage} dari {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="cursor-pointer rounded-lg border border-[#D5C6B1] bg-white px-3 py-1 text-xs font-semibold text-ink disabled:opacity-40"
            >
              Berikutnya
            </button>
          </div>
        )}
      </div>

      {/* MODALS */}
      {selectedWaGuest && (
        <WhatsAppModal
          guest={selectedWaGuest}
          origin={origin || 'https://wedding-alwi.vercel.app'}
          onClose={() => setSelectedWaGuest(null)}
        />
      )}

      {isAddModalOpen && (
        <GuestFormModal
          key="add-guest"
          guest={null}
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={(newGuest) => {
            onGuestAdded(newGuest);
            setNotice({
              type: 'success',
              text: `Tamu "${newGuest.salutation} ${newGuest.name}" berhasil ditambahkan.`,
            });
          }}
        />
      )}

      {editingGuest && (
        <GuestFormModal
          key={editingGuest.id}
          guest={editingGuest}
          isOpen={Boolean(editingGuest)}
          onClose={() => setEditingGuest(null)}
          onSave={(updatedGuest) => {
            onGuestUpdated(updatedGuest);
            setNotice({
              type: 'success',
              text: `Data tamu "${updatedGuest.salutation} ${updatedGuest.name}" berhasil diperbarui.`,
            });
          }}
        />
      )}

      {deletingGuest && (
        <DeleteGuestModal
          guest={deletingGuest}
          isOpen={Boolean(deletingGuest)}
          onClose={() => setDeletingGuest(null)}
          onDelete={(id) => {
            onGuestDeleted(id);
            setNotice({
              type: 'success',
              text: 'Data tamu berhasil dihapus dari sistem.',
            });
          }}
        />
      )}

      {isImportModalOpen && (
        <ImportCsvModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onImportSuccess={(count, newGuests) => {
            onGuestsImported(count, newGuests);
            setNotice({
              type: 'success',
              text: `Berhasil mengimpor ${count} tamu baru ke Firestore.`,
            });
          }}
        />
      )}
    </section>
  );
}
