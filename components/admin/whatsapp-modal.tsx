'use client';

import React, { useState } from 'react';
import type { Guest } from '../../types/database';
import {
  generateWhatsAppInvitation,
  generateWhatsAppReminder,
} from '../../lib/guest-utils';
import {
  IconWhatsApp,
  IconMail,
  IconClock,
  IconLink,
  IconCopy,
  IconCheck,
  IconX,
} from './admin-icons';

interface Props {
  guest: Guest | null;
  origin: string;
  onClose: () => void;
}

export default function WhatsAppModal({ guest, origin, onClose }: Props) {
  const [templateType, setTemplateType] = useState<'invitation' | 'reminder'>('invitation');
  const [copiedType, setCopiedType] = useState<'message' | 'link' | null>(null);

  // Tutup dialog saat tombol Escape ditekan
  React.useEffect(() => {
    if (!guest) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [guest, onClose]);

  if (!guest) return null;

  const invitationText = generateWhatsAppInvitation(guest, origin);
  const reminderText = generateWhatsAppReminder(guest, origin);
  const currentText = templateType === 'invitation' ? invitationText : reminderText;
  const guestLink = `${origin.replace(/\/+$/, '')}/${guest.fullSlug}`;

  const handleCopy = async (text: string, type: 'message' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    }
  };

  const handleSendWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(currentText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
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
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#E5D8C5] bg-[#FDFBF7] shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5D8C5] px-6 py-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#25D366]/15 text-[#25D366]">
                <IconWhatsApp size={22} />
              </div>
              <h3 className="font-display text-2xl font-bold text-ink">
                Generator Pesan WhatsApp
              </h3>
            </div>
            <p className="mt-1 text-sm text-ink-soft">
              Tamu: <strong className="text-gold-deep font-semibold">{guest.salutation} {guest.name}</strong>
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

        {/* Tab Template */}
        <div className="flex border-b border-[#E5D8C5] bg-[#FAF6F0] px-6 pt-3">
          <button
            onClick={() => setTemplateType('invitation')}
            className={`cursor-pointer inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-bold transition ${
              templateType === 'invitation'
                ? 'border-gold-deep text-gold-deep'
                : 'border-transparent text-ink-soft hover:text-ink'
            }`}
          >
            <IconMail size={16} />
            <span>Undangan Resmi (PRD Lampiran B)</span>
          </button>
          <button
            onClick={() => setTemplateType('reminder')}
            className={`cursor-pointer inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-bold transition ${
              templateType === 'reminder'
                ? 'border-gold-deep text-gold-deep'
                : 'border-transparent text-ink-soft hover:text-ink'
            }`}
          >
            <IconClock size={16} />
            <span>Pengingat / Reminder RSVP</span>
          </button>
        </div>

        {/* Konten Pesan */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="rounded-xl border border-[#D5C6B1] bg-white p-4 shadow-inner">
            <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-ink-soft">
              <span>Pratinjau Pesan WhatsApp</span>
              <span className="text-gold-deep">{templateType === 'invitation' ? 'Format Resmi' : 'Format Reminder'}</span>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-sm text-[#2C1E14] leading-relaxed select-all">
              {currentText}
            </pre>
          </div>

          <div className="rounded-xl border border-[#E5D8C5] bg-[#FAF6F0] p-3 text-xs sm:text-sm text-ink-soft">
            <span className="font-semibold text-ink">Link Personal: </span>
            <span className="font-mono text-gold-deep break-all">{guestLink}</span>
          </div>
        </div>

        {/* Footer Tombol Aksi */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E5D8C5] bg-[#FDFBF7] px-6 py-4 rounded-b-2xl">
          <button
            onClick={() => handleCopy(guestLink, 'link')}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-[#D5C6B1] bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-[#FAF6F0]"
          >
            {copiedType === 'link' ? (
              <>
                <IconCheck size={16} className="text-emerald-600" />
                <span>Tautan Tersalin!</span>
              </>
            ) : (
              <>
                <IconLink size={16} />
                <span>Salin Tautan Saja</span>
              </>
            )}
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleCopy(currentText, 'message')}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-gold-deep bg-white px-4 py-2.5 text-sm font-bold text-gold-deep transition hover:bg-gold-deep/10"
            >
              {copiedType === 'message' ? (
                <>
                  <IconCheck size={16} className="text-emerald-600" />
                  <span>Pesan Tersalin!</span>
                </>
              ) : (
                <>
                  <IconCopy size={16} />
                  <span>Salin Pesan Lengkap</span>
                </>
              )}
            </button>
            <button
              onClick={handleSendWhatsApp}
              className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#20bd5a]"
            >
              <IconWhatsApp size={18} />
              <span>Kirim via WhatsApp ↗</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
