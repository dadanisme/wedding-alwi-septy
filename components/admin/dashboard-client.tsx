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
    badgeClass: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300',
    cardBorder: 'border-emerald-500/30',
    progressColor: 'bg-emerald-500',
    desc: 'Jumlah tamu terkonfirmasi masih dalam kapasitas aman venue.',
  };

  if (projected >= 240) {
    statusTheme = {
      badge: 'Kapasitas Kritis / Penuh',
      badgeClass: 'bg-rose-950/70 border-rose-500/50 text-rose-300 animate-pulse',
      cardBorder: 'border-rose-500/50',
      progressColor: 'bg-rose-500',
      desc: 'PERINGATAN: Proyeksi kehadiran mendekati batas maksimal 250 katering!',
    };
  } else if (projected >= 200) {
    statusTheme = {
      badge: 'Waspada (Mendekati Batas)',
      badgeClass: 'bg-amber-950/60 border-amber-500/50 text-amber-300',
      cardBorder: 'border-amber-500/40',
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
    <div className="min-h-screen bg-[#140F0C] pb-24 text-[#F4EDE4]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-gold-bright/20 bg-[#1A120B]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 shrink-0">
              <Image
                src="/logo/monogram-gold.png"
                alt="Logo Alwi & Septy"
                fill
                sizes="36px"
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-display text-lg font-semibold tracking-wide text-gold-bright sm:text-xl">
                Wedding Alwi &amp; Septy
              </span>
              <span className="hidden text-xs tracking-wider text-label-on-dark/60 sm:inline sm:ml-2">
                · Admin Panel
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-lg border border-gold-bright/30 px-3 py-1.5 text-xs font-medium text-gold-bright/90 transition hover:border-gold-bright hover:bg-gold-bright/10 sm:inline-flex"
            >
              Lihat Undangan Publik ↗
            </a>
            <div className="hidden text-right text-xs text-label-on-dark/70 sm:block">
              <span>{adminEmail}</span>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-gold-bright/30 bg-[#251B15] px-3.5 py-1.5 text-xs font-semibold tracking-wide text-label-on-dark transition hover:border-rose-400/50 hover:bg-rose-950/30 hover:text-rose-200"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Notifikasi Aksi */}
        {notice && (
          <div
            role="alert"
            className={`mb-6 flex items-center justify-between rounded-xl border p-4 text-sm transition ${
              notice.type === 'success'
                ? 'border-emerald-500/40 bg-emerald-950/50 text-emerald-200'
                : 'border-rose-500/40 bg-rose-950/50 text-rose-200'
            }`}
          >
            <span>{notice.text}</span>
            <button
              onClick={() => setNotice(null)}
              className="ml-3 text-xs opacity-75 hover:opacity-100"
            >
              ✕ Tutup
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 1. KARTU SOROTAN: PROYEKSI TOTAL HEADCOUNT & KENDALI KAPASITAS (PRD §4.7) */}
        {/* ========================================================================= */}
        <section className={`mb-8 overflow-hidden rounded-2xl border ${statusTheme.cardBorder} bg-[#1E1815] p-6 shadow-xl`}>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-semibold tracking-wider uppercase text-label-on-dark/70">
                  Kendali Kapasitas Katering (PRD §4.7)
                </span>
                <span
                  className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${statusTheme.badgeClass}`}
                >
                  {statusTheme.badge}
                </span>
              </div>
              <h2 className="mt-2 font-display text-2xl font-normal text-[#F4EDE4] sm:text-3xl">
                Proyeksi Kehadiran:{' '}
                <span className="font-semibold text-gold-bright">{projected}</span>
                <span className="text-lg text-label-on-dark/60 font-normal"> / {capacity} Orang</span>
              </h2>
              <p className="mt-1 text-xs text-label-on-dark/80">{statusTheme.desc}</p>
            </div>

            <div className="flex flex-col items-start gap-1 rounded-xl border border-gold-bright/15 bg-[#140F0C]/80 px-4 py-3 md:items-end">
              <span className="text-xs text-label-on-dark/60 uppercase tracking-wider">
                Sisa Kuota Kursi
              </span>
              <span
                className={`font-display text-2xl font-bold ${
                  remaining <= 10 ? 'text-rose-400' : 'text-gold-bright'
                }`}
              >
                {remaining > 0 ? `${remaining} Kursi` : 'Penuh / Lewat Kuota'}
              </span>
            </div>
          </div>

          {/* Progress Bar Visual */}
          <div className="mt-5">
            <div className="h-3 w-full overflow-hidden rounded-full bg-[#120D0A] p-0.5 border border-gold-bright/20">
              <div
                className={`h-full rounded-full transition-all duration-500 ${statusTheme.progressColor}`}
                style={{ width: `${percentFilled}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-label-on-dark/60">
              <span>0</span>
              <span>Kapasitas Maksimal Venue: 250</span>
            </div>
          </div>

          {/* Rincian Rumus Proyeksi */}
          <div className="mt-4 rounded-lg border border-gold-bright/10 bg-[#16100D] p-3 text-xs text-label-on-dark/80">
            <span className="font-semibold text-gold-bright">Rumus Proyeksi: </span>
            {initialStats.attendingCount} Tamu Hadir + {initialStats.totalPlusOne} Pendamping + 50 Keluarga Inti &amp; Panitia = <strong className="text-gold-bright">{projected} Orang</strong>.
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. GRID METRIK RINGKASAN: TAMU, PEMBUKAAN, & RSVP (PRD §4.7) */}
        {/* ========================================================================= */}
        <section className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Tamu */}
          <div className="rounded-xl border border-gold-bright/20 bg-[#1E1815] p-5 shadow-sm">
            <span className="text-xs font-medium tracking-wider uppercase text-label-on-dark/70">
              Total Tamu Terdaftar
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-3xl font-semibold text-[#F4EDE4]">
                {initialStats.totalGuests}
              </span>
              <span className="text-xs text-label-on-dark/60">Undangan</span>
            </div>
            <p className="mt-2 text-[11px] text-label-on-dark/60">
              Kapasitas daftar target: 150 tamu
            </p>
          </div>

          {/* Status Buka Undangan */}
          <div className="rounded-xl border border-gold-bright/20 bg-[#1E1815] p-5 shadow-sm">
            <span className="text-xs font-medium tracking-wider uppercase text-label-on-dark/70">
              Sudah Buka Undangan
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-3xl font-semibold text-gold-bright">
                {initialStats.openedCount}
              </span>
              <span className="text-xs text-label-on-dark/60">
                ({initialStats.totalGuests > 0 ? Math.round((initialStats.openedCount / initialStats.totalGuests) * 100) : 0}%)
              </span>
            </div>
            <p className="mt-2 text-[11px] text-label-on-dark/60">
              {initialStats.unopenedCount} tamu belum membuka layar sampul
            </p>
          </div>

          {/* Konfirmasi Hadir */}
          <div className="rounded-xl border border-gold-bright/20 bg-[#1E1815] p-5 shadow-sm">
            <span className="text-xs font-medium tracking-wider uppercase text-emerald-400/90">
              RSVP Hadir
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-3xl font-semibold text-emerald-400">
                {initialStats.attendingCount}
              </span>
              <span className="text-xs text-label-on-dark/60">
                +{initialStats.totalPlusOne} pendamping
              </span>
            </div>
            <p className="mt-2 text-[11px] text-label-on-dark/60">
              Total {initialStats.attendingCount + initialStats.totalPlusOne} orang hadir
            </p>
          </div>

          {/* Belum Respons & Tidak Hadir */}
          <div className="rounded-xl border border-gold-bright/20 bg-[#1E1815] p-5 shadow-sm">
            <span className="text-xs font-medium tracking-wider uppercase text-amber-400/90">
              Belum Konfirmasi
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-3xl font-semibold text-amber-400">
                {initialStats.pendingCount}
              </span>
              <span className="text-xs text-label-on-dark/60">
                · {initialStats.notAttendingCount} absen
              </span>
            </div>
            <p className="mt-2 text-[11px] text-label-on-dark/60">
              Bot WhatsApp Preview: {initialStats.totalBotVisits || 0} kunjungan
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. MODUL MANAJEMEN TAMU (PREVIEW SESI 2) */}
        {/* ========================================================================= */}
        <section className="mb-10 rounded-2xl border border-gold-bright/20 bg-[#1E1815]/60 p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-gold-deep/30 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-gold-bright uppercase">
                  Tahap Pengerjaan Berikutnya (Sesi 2)
                </span>
              </div>
              <h3 className="mt-1 font-display text-xl font-normal text-[#F4EDE4]">
                Manajemen Tamu &amp; Generator WhatsApp (PRD §4.7)
              </h3>
              <p className="mt-1 text-xs text-label-on-dark/70">
                Tabel 150 tamu lengkap, filter reminder tamu belum konfirmasi, generator pesan WhatsApp personal, tambah/edit tamu, impor CSV, dan ekspor data katering/tata kursi.
              </p>
            </div>
            <button
              disabled
              className="cursor-not-allowed rounded-lg border border-gold-bright/30 bg-[#18120E] px-4 py-2 text-xs font-medium text-label-on-dark/50"
            >
              Segera Aktif di Sesi 2
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. MODUL MODERASI BUKU TAMU (PRD §4.4 & §4.7) */}
        {/* ========================================================================= */}
        <section className="rounded-2xl border border-gold-bright/20 bg-[#1E1815] p-6 shadow-xl">
          <div className="flex flex-col justify-between gap-4 border-b border-gold-bright/15 pb-5 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-display text-2xl font-normal text-gold-bright">
                Moderasi Buku Tamu
              </h3>
              <p className="mt-1 text-xs text-label-on-dark/70">
                Penyembunyian ucapan berlaku secara real-time dan langsung hilang dari tampilan publik tamu dalam ~12 detik tanpa muat ulang.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setModerationFilter('all')}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  moderationFilter === 'all'
                    ? 'border border-gold-bright bg-gold-deep text-white'
                    : 'border border-gold-bright/20 bg-[#140F0C] text-label-on-dark/70 hover:text-white'
                }`}
              >
                Semua ({messages.length})
              </button>
              <button
                onClick={() => setModerationFilter('visible')}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  moderationFilter === 'visible'
                    ? 'border border-emerald-500 bg-emerald-950 text-emerald-300'
                    : 'border border-gold-bright/20 bg-[#140F0C] text-label-on-dark/70 hover:text-white'
                }`}
              >
                Tampil ({visibleMessagesCount})
              </button>
              <button
                onClick={() => setModerationFilter('hidden')}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  moderationFilter === 'hidden'
                    ? 'border border-rose-500 bg-rose-950 text-rose-300'
                    : 'border border-gold-bright/20 bg-[#140F0C] text-label-on-dark/70 hover:text-white'
                }`}
              >
                Disembunyikan ({hiddenMessagesCount})
              </button>
            </div>
          </div>

          {/* Bar Pencarian */}
          <div className="mt-4 mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pengirim atau isi ucapan..."
              className="w-full rounded-lg border border-gold-bright/25 bg-[#140F0C] px-4 py-2.5 text-xs text-[#F4EDE4] placeholder-label-on-dark/50 transition focus:border-gold-bright focus:outline-none focus:ring-1 focus:ring-gold-bright"
            />
          </div>

          {/* Daftar Ucapan */}
          {filteredMessages.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gold-bright/20 py-12 text-center text-xs text-label-on-dark/60">
              {messages.length === 0
                ? 'Belum ada ucapan yang masuk di Buku Tamu.'
                : 'Tidak ada ucapan yang sesuai dengan filter atau pencarian.'}
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredMessages.map((msg) => {
                const isProcessing = pendingMessageId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col justify-between gap-3 rounded-xl border p-4 transition md:flex-row md:items-center ${
                      msg.isHidden
                        ? 'border-rose-950/60 bg-[#160E0E]/80 opacity-75'
                        : 'border-gold-bright/20 bg-[#16100D]'
                    }`}
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-base font-semibold text-gold-bright break-words">
                          {msg.guestName}
                        </span>
                        <span className="text-[11px] text-label-on-dark/50">
                          {formatDateTime(msg.createdAt)}
                        </span>
                        {msg.isHidden ? (
                          <span className="rounded-full border border-rose-500/40 bg-rose-950/60 px-2 py-0.5 text-[10px] font-medium text-rose-300">
                            Disembunyikan
                          </span>
                        ) : (
                          <span className="rounded-full border border-emerald-500/40 bg-emerald-950/60 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                            Tampil Publik
                          </span>
                        )}
                      </div>
                      <p className="text-xs leading-relaxed text-[#EDE5DA] break-words">
                        {msg.message}
                      </p>
                    </div>

                    <div className="shrink-0 pt-2 sm:pt-0">
                      <button
                        onClick={() => handleToggleVisibility(msg.id, msg.isHidden)}
                        disabled={isProcessing}
                        className={`w-full sm:w-auto rounded-lg px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          msg.isHidden
                            ? 'border border-emerald-500/50 bg-emerald-950/50 text-emerald-200 hover:bg-emerald-900/60'
                            : 'border border-rose-500/40 bg-rose-950/40 text-rose-200 hover:bg-rose-900/50'
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
