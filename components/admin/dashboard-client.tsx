'use client';

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import type { GuestSummaryStats, GuestMessage } from '../../types/database';
import { logoutAdminAction } from '../../app/actions/auth';
import { toggleMessageVisibilityAction } from '../../app/actions/moderation';

interface Props {
  initialStats: GuestSummaryStats;
  initialMessages: GuestMessage[];
  adminEmail: string;
}

export default function AdminDashboardClient({
  initialStats,
  initialMessages,
  adminEmail,
}: Props) {
  const [messages, setMessages] = useState<GuestMessage[]>(initialMessages);
  const [moderationFilter, setModerationFilter] = useState<'all' | 'visible' | 'hidden'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingMessageId, setPendingMessageId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [, startTransition] = useTransition();

  // Perhitungan Proyeksi Headcount & Kapasitas (PRD §2.4 & §4.7)
  const capacity = initialStats.maxCapacity || 250;
  const projected = initialStats.projectedHeadcount;
  const remaining = capacity - projected;
  const percentFilled = Math.min(100, Math.round((projected / capacity) * 100));

  // Status Warna Kendali Kapasitas (PRD §4.7)
  let statusTheme = {
    badge: 'Aman',
    badgeClass: 'bg-emerald-50 border-emerald-300 text-emerald-800',
    cardBorder: 'border-emerald-400/80',
    progressColor: 'bg-emerald-600',
    desc: 'Jumlah tamu terkonfirmasi masih dalam kapasitas aman venue.',
  };

  if (projected >= 240) {
    statusTheme = {
      badge: 'Kapasitas Kritis / Penuh',
      badgeClass: 'bg-rose-100 border-rose-400 text-rose-900 animate-pulse',
      cardBorder: 'border-rose-500',
      progressColor: 'bg-rose-600',
      desc: 'PERINGATAN: Proyeksi kehadiran mendekati batas maksimal 250 katering!',
    };
  } else if (projected >= 200) {
    statusTheme = {
      badge: 'Waspada (Mendekati Batas)',
      badgeClass: 'bg-amber-100 border-amber-400 text-amber-900',
      cardBorder: 'border-amber-400',
      progressColor: 'bg-amber-500',
      desc: 'Perhatian: Kuota katering tersisa kurang dari 50 kursi.',
    };
  }

  // Filter Buku Tamu
  const visibleMessagesCount = messages.filter((m) => !m.isHidden).length;
  const hiddenMessagesCount = messages.filter((m) => m.isHidden).length;

  const filteredMessages = messages.filter((m) => {
    if (moderationFilter === 'visible' && m.isHidden) return false;
    if (moderationFilter === 'hidden' && !m.isHidden) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = m.guestName.toLowerCase().includes(q);
      const matchMsg = m.message.toLowerCase().includes(q);
      return matchName || matchMsg;
    }
    return true;
  });

  // Handler Moderasi Ucapan
  const handleToggleVisibility = async (messageId: string, currentHidden: boolean) => {
    const nextHidden = !currentHidden;
    setPendingMessageId(messageId);
    setNotice(null);

    // Pembaruan optimistik pada UI
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, isHidden: nextHidden } : m))
    );

    try {
      const res = await toggleMessageVisibilityAction(messageId, nextHidden);
      if (!res.success) {
        // Rollback jika gagal
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, isHidden: currentHidden } : m))
        );
        setNotice({
          type: 'error',
          text: res.error || 'Gagal mengubah status visibilitas ucapan.',
        });
      } else {
        setNotice({
          type: 'success',
          text: nextHidden
            ? 'Ucapan berhasil disembunyikan dari tampilan publik.'
            : 'Ucapan berhasil ditampilkan kembali di Buku Tamu publik.',
        });
      }
    } catch {
      // Rollback
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, isHidden: currentHidden } : m))
      );
      setNotice({
        type: 'error',
        text: 'Terjadi galat jaringan saat memproses moderasi.',
      });
    } finally {
      setPendingMessageId(null);
    }
  };

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAdminAction();
    });
  };

  // Format tanggal jam Indonesia
  const formatDateTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return iso;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F5EE] pb-24 text-[#2C1E14]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-[#E5D8C5] bg-[#FDFBF7]/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0">
              <Image
                src="/logo/monogram-gold.png"
                alt="Logo Alwi & Septy"
                fill
                sizes="40px"
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-display text-xl font-bold tracking-wide text-ink sm:text-2xl">
                Wedding Alwi &amp; Septy
              </span>
              <span className="hidden text-sm font-semibold tracking-wider text-ink-soft sm:inline sm:ml-2">
                · Admin Panel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden cursor-pointer rounded-xl border border-gold-deep/30 bg-[#FAF6F0] px-4 py-2 text-sm font-semibold text-gold-deep shadow-xs transition hover:bg-gold-deep hover:text-white sm:inline-flex"
            >
              Lihat Undangan Publik ↗
            </a>
            <div className="hidden text-right text-sm font-medium text-ink-soft sm:block">
              <span>{adminEmail}</span>
            </div>
            <button
              onClick={handleLogout}
              className="cursor-pointer rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-800 transition hover:bg-rose-100 hover:text-rose-900"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 space-y-8">
        {/* Notifikasi Aksi */}
        {notice && (
          <div
            role="alert"
            className={`flex items-center justify-between rounded-xl border p-4 text-base font-medium shadow-sm transition ${
              notice.type === 'success'
                ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                : 'border-rose-300 bg-rose-50 text-rose-900'
            }`}
          >
            <span>{notice.text}</span>
            <button
              onClick={() => setNotice(null)}
              className="cursor-pointer ml-3 text-sm font-semibold opacity-75 hover:opacity-100"
            >
              ✕ Tutup
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 1. KARTU SOROTAN: PROYEKSI TOTAL HEADCOUNT & KENDALI KAPASITAS (PRD §4.7) */}
        {/* ========================================================================= */}
        <section className={`overflow-hidden rounded-2xl border-2 ${statusTheme.cardBorder} bg-white p-6 sm:p-8 shadow-md`}>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-bold tracking-wider uppercase text-ink-soft">
                  Kendali Kapasitas Katering (PRD §4.7)
                </span>
                <span
                  className={`rounded-full border px-3.5 py-1 text-sm font-bold ${statusTheme.badgeClass}`}
                >
                  {statusTheme.badge}
                </span>
              </div>
              <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
                Proyeksi Kehadiran:{' '}
                <span className="text-gold-deep">{projected}</span>
                <span className="text-xl sm:text-2xl text-ink-soft font-normal"> / {capacity} Orang</span>
              </h2>
              <p className="mt-2 text-base text-ink-soft">{statusTheme.desc}</p>
            </div>

            <div className="flex flex-col items-start gap-1.5 rounded-2xl border border-[#E5D8C5] bg-[#FAF6F0] px-5 py-4 md:items-end">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-ink-soft">
                Sisa Kuota Kursi
              </span>
              <span
                className={`font-display text-3xl sm:text-4xl font-bold ${
                  remaining <= 10 ? 'text-rose-600' : 'text-gold-deep'
                }`}
              >
                {remaining > 0 ? `${remaining} Kursi` : 'Penuh / Lewat Kuota'}
              </span>
            </div>
          </div>

          {/* Progress Bar Visual */}
          <div className="mt-6">
            <div className="h-4 w-full overflow-hidden rounded-full bg-[#EAE0D3] p-0.5 border border-[#D5C6B1]">
              <div
                className={`h-full rounded-full transition-all duration-500 ${statusTheme.progressColor}`}
                style={{ width: `${percentFilled}%` }}
              />
            </div>
            <div className="mt-2.5 flex justify-between text-sm font-medium text-ink-soft">
              <span>0 Orang</span>
              <span>Kapasitas Maksimal Venue: 250 Orang</span>
            </div>
          </div>

          {/* Rincian Rumus Proyeksi */}
          <div className="mt-5 rounded-xl border border-[#E5D8C5] bg-[#FAF6F0] p-4 text-sm sm:text-base text-ink leading-relaxed">
            <span className="font-bold text-gold-deep">Rumus Proyeksi: </span>
            {initialStats.attendingCount} Tamu Hadir + {initialStats.totalPlusOne} Pendamping + 50 Keluarga Inti &amp; Panitia = <strong className="font-bold text-gold-deep">{projected} Orang</strong>.
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. GRID METRIK RINGKASAN: TAMU, PEMBUKAAN, & RSVP (PRD §4.7) */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Tamu */}
          <div className="rounded-2xl border border-[#E5D8C5] bg-white p-6 shadow-sm">
            <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-ink-soft">
              Total Tamu Terdaftar
            </span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-4xl sm:text-5xl font-bold text-ink">
                {initialStats.totalGuests}
              </span>
              <span className="text-sm font-medium text-ink-soft">Undangan</span>
            </div>
            <p className="mt-3 text-sm text-ink-soft">
              Target daftar: 150 undangan
            </p>
          </div>

          {/* Status Buka Undangan */}
          <div className="rounded-2xl border border-[#E5D8C5] bg-white p-6 shadow-sm">
            <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-ink-soft">
              Sudah Buka Undangan
            </span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-4xl sm:text-5xl font-bold text-gold-deep">
                {initialStats.openedCount}
              </span>
              <span className="text-sm font-medium text-ink-soft">
                ({initialStats.totalGuests > 0 ? Math.round((initialStats.openedCount / initialStats.totalGuests) * 100) : 0}%)
              </span>
            </div>
            <p className="mt-3 text-sm text-ink-soft">
              {initialStats.unopenedCount} tamu belum membuka sampul
            </p>
          </div>

          {/* Konfirmasi Hadir */}
          <div className="rounded-2xl border border-[#E5D8C5] bg-white p-6 shadow-sm">
            <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-emerald-700">
              RSVP Hadir
            </span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-4xl sm:text-5xl font-bold text-emerald-700">
                {initialStats.attendingCount}
              </span>
              <span className="text-sm font-medium text-ink-soft">
                +{initialStats.totalPlusOne} pendamping
              </span>
            </div>
            <p className="mt-3 text-sm text-ink-soft">
              Total {initialStats.attendingCount + initialStats.totalPlusOne} orang hadir
            </p>
          </div>

          {/* Belum Respons & Tidak Hadir */}
          <div className="rounded-2xl border border-[#E5D8C5] bg-white p-6 shadow-sm">
            <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-amber-700">
              Belum Konfirmasi
            </span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-4xl sm:text-5xl font-bold text-amber-700">
                {initialStats.pendingCount}
              </span>
              <span className="text-sm font-medium text-ink-soft">
                · {initialStats.notAttendingCount} absen
              </span>
            </div>
            <p className="mt-3 text-sm text-ink-soft">
              Bot WhatsApp Preview: {initialStats.totalBotVisits || 0} kunjungan
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. MODUL MANAJEMEN TAMU (PREVIEW SESI 2) */}
        {/* ========================================================================= */}
        <section className="rounded-2xl border border-[#E5D8C5] bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-[#FAF6F0] border border-gold-deep/30 px-3 py-1 text-xs font-bold tracking-wider text-gold-deep uppercase">
                  Tahap Pengerjaan Berikutnya (Sesi 2)
                </span>
              </div>
              <h3 className="mt-2 font-display text-2xl font-bold text-ink">
                Manajemen Tamu &amp; Generator WhatsApp (PRD §4.7)
              </h3>
              <p className="mt-1 text-sm sm:text-base text-ink-soft">
                Tabel 150 tamu lengkap, filter reminder tamu belum konfirmasi, generator pesan WhatsApp personal, tambah/edit tamu, impor CSV, dan ekspor data katering/tata kursi.
              </p>
            </div>
            <button
              disabled
              className="cursor-not-allowed rounded-xl border border-[#D5C6B1] bg-[#F2EDE4] px-5 py-2.5 text-sm font-semibold text-ink-soft/60"
            >
              Segera Aktif di Sesi 2
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. MODUL MODERASI BUKU TAMU (PRD §4.4 & §4.7) */}
        {/* ========================================================================= */}
        <section className="rounded-2xl border border-[#E5D8C5] bg-white p-6 sm:p-8 shadow-md">
          <div className="flex flex-col gap-4 border-b border-[#E5D8C5] pb-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink">
                Moderasi Buku Tamu
              </h3>
              <p className="mt-1.5 text-sm sm:text-base text-ink-soft">
                Penyembunyian ucapan berlaku secara real-time dan langsung hilang dari tampilan publik tamu dalam ~12 detik tanpa muat ulang.
              </p>
            </div>

            {/* Filter Tabs — 1 baris sejajar rapi tanpa bertumpuk */}
            <div className="flex flex-nowrap shrink-0 items-center gap-2.5 overflow-x-auto pb-1 sm:pb-0 whitespace-nowrap">
              <button
                onClick={() => setModerationFilter('all')}
                className={`cursor-pointer shrink-0 rounded-xl px-4 py-2 text-sm sm:text-base font-bold transition shadow-xs whitespace-nowrap ${
                  moderationFilter === 'all'
                    ? 'bg-gold-deep text-white shadow-md'
                    : 'border border-[#D5C6B1] bg-[#FAF6F0] text-ink hover:bg-[#EFE7D8]'
                }`}
              >
                Semua ({messages.length})
              </button>
              <button
                onClick={() => setModerationFilter('visible')}
                className={`cursor-pointer shrink-0 rounded-xl px-4 py-2 text-sm sm:text-base font-bold transition shadow-xs whitespace-nowrap ${
                  moderationFilter === 'visible'
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'border border-[#D5C6B1] bg-[#FAF6F0] text-ink hover:bg-[#EFE7D8]'
                }`}
              >
                Tampil ({visibleMessagesCount})
              </button>
              <button
                onClick={() => setModerationFilter('hidden')}
                className={`cursor-pointer shrink-0 rounded-xl px-4 py-2 text-sm sm:text-base font-bold transition shadow-xs whitespace-nowrap ${
                  moderationFilter === 'hidden'
                    ? 'bg-rose-700 text-white shadow-md'
                    : 'border border-[#D5C6B1] bg-[#FAF6F0] text-ink hover:bg-[#EFE7D8]'
                }`}
              >
                Disembunyikan ({hiddenMessagesCount})
              </button>
            </div>
          </div>

          {/* Bar Pencarian */}
          <div className="mt-6 mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pengirim atau isi ucapan..."
              className="w-full rounded-xl border border-[#D5C6B1] bg-[#FAF6F0] px-4 py-3 text-base text-ink placeholder-[#9C8B7B] transition focus:border-gold-deep focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-deep/20"
            />
          </div>

          {/* Daftar Ucapan */}
          {filteredMessages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#D5C6B1] py-14 text-center text-sm sm:text-base text-ink-soft">
              {messages.length === 0
                ? 'Belum ada ucapan yang masuk di Buku Tamu.'
                : 'Tidak ada ucapan yang sesuai dengan filter atau pencarian.'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map((msg) => {
                const isProcessing = pendingMessageId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col justify-between gap-4 rounded-2xl border p-5 sm:p-6 transition md:flex-row md:items-center ${
                      msg.isHidden
                        ? 'border-rose-200 bg-rose-50/50 opacity-80'
                        : 'border-[#E5D8C5] bg-[#FAF6F0]'
                    }`}
                  >
                    <div className="space-y-2 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-display text-lg sm:text-xl font-bold text-ink break-words">
                          {msg.guestName}
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-ink-soft">
                          {formatDateTime(msg.createdAt)}
                        </span>
                        {msg.isHidden ? (
                          <span className="rounded-full border border-rose-300 bg-rose-100 px-3 py-0.5 text-xs font-bold text-rose-800">
                            Disembunyikan
                          </span>
                        ) : (
                          <span className="rounded-full border border-emerald-300 bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
                            Tampil Publik
                          </span>
                        )}
                      </div>
                      <p className="text-base sm:text-lg leading-relaxed text-[#2C1E14] break-words">
                        {msg.message}
                      </p>
                    </div>

                    <div className="shrink-0 pt-2 md:pt-0">
                      <button
                        onClick={() => handleToggleVisibility(msg.id, msg.isHidden)}
                        disabled={isProcessing}
                        className={`w-full sm:w-auto cursor-pointer rounded-xl px-5 py-2.5 text-sm sm:text-base font-bold tracking-wider uppercase transition shadow-xs disabled:cursor-not-allowed disabled:opacity-50 ${
                          msg.isHidden
                            ? 'border border-emerald-400 bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'border border-rose-300 bg-rose-100 text-rose-900 hover:bg-rose-200'
                        }`}
                      >
                        {isProcessing ? (
                          'Memproses...'
                        ) : msg.isHidden ? (
                          'Tampilkan Kembali'
                        ) : (
                          'Sembunyikan'
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
